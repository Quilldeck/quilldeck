import { useState, useEffect, useCallback } from 'react';
import {
  getSubscription,
  canUseBlurb,
  canUseMarketing,
  incrementBlurbUsage,
  incrementMarketingUsage,
  unlockPro,
  FREE_BLURB_LIMIT,
  FREE_MARKETING_LIMIT,
  type SubscriptionState,
} from '../services/subscriptionService';

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionState>({
    tier: 'free',
    blurbsUsed: 0,
    marketingUsed: 0,
  });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const state = await getSubscription();
    setSubscription(state);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const checkAndUseBlurb = useCallback(async (): Promise<boolean> => {
    const allowed = await canUseBlurb();
    if (!allowed) return false;
    const updated = await incrementBlurbUsage();
    setSubscription(updated);
    return true;
  }, []);

  const checkAndUseMarketing = useCallback(async (): Promise<boolean> => {
    const allowed = await canUseMarketing();
    if (!allowed) return false;
    const updated = await incrementMarketingUsage();
    setSubscription(updated);
    return true;
  }, []);

  const activatePro = useCallback(async (
    walletAddress: string,
    txSignature: string,
  ): Promise<void> => {
    const updated = await unlockPro(walletAddress, txSignature);
    setSubscription(updated);
  }, []);

  const isPro = subscription.tier === 'pro';
  const blurbsRemaining = isPro
    ? Infinity
    : Math.max(0, FREE_BLURB_LIMIT - subscription.blurbsUsed);
  const marketingRemaining = isPro
    ? Infinity
    : Math.max(0, FREE_MARKETING_LIMIT - subscription.marketingUsed);

  return {
    subscription,
    loading,
    isPro,
    blurbsRemaining,
    marketingRemaining,
    checkAndUseBlurb,
    checkAndUseMarketing,
    activatePro,
    refresh,
  };
}