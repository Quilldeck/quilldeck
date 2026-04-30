import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSubscription } from '../src/hooks/useSubscription';
import { TAOSCOPE_WALLET, SUBSCRIPTION_PRICE_USDC } from '../src/services/subscriptionService';

export default function SubscriptionScreen() {
  const router = useRouter();
  const { subscription, isPro, blurbsRemaining, marketingRemaining, activatePro } = useSubscription();
  const [paying, setPaying] = useState(false);

  const handleUpgrade = async () => {
    setPaying(true);
    try {
      // For hackathon demo: simulate a successful USDC payment
      // In production this would trigger Mobile Wallet Adapter + Solana Pay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockWallet = 'DemoWallet_' + Date.now();
      const mockTx = 'DemoTx_' + Math.random().toString(36).substr(2, 9);
      
      await activatePro(mockWallet, mockTx);
      
      Alert.alert(
        'Welcome to Pro!',
        'Your Quilldeck Pro subscription is now active. Unlimited blurbs and marketing packages await.',
        [{ text: 'Let\'s go!', onPress: () => router.back() }]
      );
    }