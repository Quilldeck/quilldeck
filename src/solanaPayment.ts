// src/solanaPayment.ts
//
// Builds and sends a USDC transfer via Mobile Wallet Adapter, using classic
// web3.js types since that's what MWA's signAndSendTransactions expects.
// The rest of the app uses @solana/kit; this file intentionally does not.

import { transact, Web3MobileWallet } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { Connection, PublicKey, Transaction, clusterApiUrl } from '@solana/web3.js';
import {
  createAssociatedTokenAccountIdempotentInstruction,
  createTransferInstruction,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token';

import { TAOSCOPE_WALLET, USDC_MINT_DEVNET } from './subscriptionService';

// Solana's own reference devnet endpoint -- spec-compliant, unlike some
// third-party proxies that returned responses @solana/web3.js rejected.
const DEVNET_RPC_URL = clusterApiUrl('devnet');

// Confirmed against the devnet USDC mint's own on-chain data: 6 decimals,
// classic Token Program (not Token-2022).
const USDC_DECIMALS = 6;

const APP_IDENTITY = {
  name: 'Quilldeck',
  uri: 'https://quilldeck.app',
  icon: 'favicon.ico',
};

export interface PaymentResult {
  walletAddress: string;
  txSignature: string;
}

function isMwaTimeout(error: any): boolean {
  const message = error?.message ?? '';
  const name = error?.name ?? '';
  return (
    name === 'SolanaMobileWalletAdapterError' ||
    message.includes('Timed out waiting for response')
  );
}

/**
 * Opens an MWA session, prompts the user to authorize and pay `amountUSDC`
 * in devnet USDC to the Taoscope receiving wallet, and returns the payer's
 * address and the confirmed transaction signature.
 *
 * MWA sessions with the wallet app (Phantom, Solflare, etc.) occasionally
 * time out waiting for a response -- a known, transient class of flakiness
 * in Solana Mobile wallet communication, not specific to this transaction's
 * content. Retries the whole session up to twice on that specific failure;
 * any other error (rejection, insufficient balance, etc.) surfaces
 * immediately without retrying.
 */
export async function payWithSolana(amountUSDC: number): Promise<PaymentResult> {
  const connection = new Connection(DEVNET_RPC_URL, 'confirmed');
  const usdcMint = new PublicKey(USDC_MINT_DEVNET);
  const destinationOwner = new PublicKey(TAOSCOPE_WALLET);

  // Fetch the blockhash BEFORE opening the wallet session -- getting one
  // needs no wallet approval, so there's no reason to delay it until after
  // wallet.authorize() switches focus away to the wallet app and back.
  const { blockhash } = await connection.getLatestBlockhash();

  const runSession = () =>
    transact(async (wallet: Web3MobileWallet) => {
      const authResult = await wallet.authorize({
        chain: 'solana:devnet',
        identity: APP_IDENTITY,
      });

      const payerPublicKey = new PublicKey(
        Buffer.from(authResult.accounts[0].address, 'base64')
      );

      const sourceAta = getAssociatedTokenAddressSync(usdcMint, payerPublicKey);
      const destinationAta = getAssociatedTokenAddressSync(usdcMint, destinationOwner);

      const amountInSmallestUnit = Math.round(amountUSDC * 10 ** USDC_DECIMALS);

      const transaction = new Transaction().add(
        // No-op if the destination already has a USDC account; creates one if not.
        createAssociatedTokenAccountIdempotentInstruction(
          payerPublicKey,
          destinationAta,
          destinationOwner,
          usdcMint,
        ),
        createTransferInstruction(
          sourceAta,
          destinationAta,
          payerPublicKey,
          amountInSmallestUnit,
        ),
      );

      transaction.recentBlockhash = blockhash;
      transaction.feePayer = payerPublicKey;

      const signatures = await wallet.signAndSendTransactions({
        transactions: [transaction],
      });

      const txSignature = signatures[0];

      await connection.confirmTransaction(txSignature, 'confirmed');

      return {
        walletAddress: payerPublicKey.toBase58(),
        txSignature,
      };
    });

  let lastError: any;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await runSession();
    } catch (error: any) {
      lastError = error;
      if (!isMwaTimeout(error)) {
        throw error;
      }
      console.error(`MWA session timed out, retrying (attempt ${attempt + 1}/3)`);
    }
  }
  throw lastError;
}
