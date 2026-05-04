import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSubscription } from '../src/hooks/useSubscription';
import { SUBSCRIPTION_PRICE_USDC } from '../src/services/subscriptionService';

export default function SubscriptionScreen() {
  const router = useRouter();
  const { activatePro } = useSubscription();
  const [paying, setPaying] = React.useState(false);

  const handleUpgrade = async () => {
    setPaying(true);
    try {
      const mockWallet = 'DemoWallet_' + Date.now();
      const mockTx = 'DemoTx_' + Math.random().toString(36).substr(2, 9);
      await activatePro(mockWallet, mockTx);
      Alert.alert('Welcome to Pro!', 'Unlimited blurbs and marketing packages await.', [{ text: 'Let\'s go!', onPress: () => router.back() }]);
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Payment failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upgrade to Pro</Text>
      <Text style={styles.price}>{SUBSCRIPTION_PRICE_USDC} USDC/month</Text>
      <TouchableOpacity style={styles.button} onPress={handleUpgrade} disabled={paying}>
        <Text style={styles.buttonText}>{paying ? 'Processing...' : 'Upgrade Now'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  price: { fontSize: 18, marginBottom: 30 },
  button: { backgroundColor: '#E8A838', padding: 15, borderRadius: 8, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
