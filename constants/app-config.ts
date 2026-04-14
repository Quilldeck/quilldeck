import { AppIdentity, createSolanaDevnet, createSolanaTestnet } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { SolanaCluster } from '@solana/web3.js';

export class AppConfig {
  static identity: AppIdentity = { name: 'Quilldeck' }
  static networks: SolanaCluster[] = [
    createSolanaDevnet({ url: 'https://api.devnet.solana.com' }),
    createSolanaTestnet({ url: 'https://api.testnet.solana.com' })
  ]

  // Free tier limits
  static FREE_BLURB_LIMIT = 3;
  static FREE_MARKETING_LIMIT = 1;

  // Subscription price in USDC
  static SUBSCRIPTION_PRICE_USDC = 4.99;

  // API
  static API_BASE_URL = 'https://quilldeck-api.vercel.app/api';
}