import { useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

const TIERS = [
  {
    id: 'launch',
    name: 'Launch',
    price: 29,
    priceUSDC: 24.65,
    period: 'one-off',
    description: 'Perfect for your first book launch',
    community: 'The Debut Lounge',
    color: '#14F195',
    features: [
      '3 AI Blurb variants',
      'Go Market This package',
      '14-day posting calendar',
      '5 promo site recommendations',
      'KDP Metadata Helper',
      'The Debut Lounge community',
    ],
  },
  {
    id: 'campaign',
    name: 'Campaign',
    price: 39,
    priceUSDC: 33.15,
    period: 'one-off',
    description: 'For the intentional, strategic author',
    community: 'The Author\'s Table',
    color: '#9945FF',
    features: [
      'Everything in Launch',
      '30-day posting calendar',
      'Extended email sequences',
      'Platform analytics guidance',
      'The Author\'s Table community',
    ],
  },
  {
    id: 'command',
    name: 'Command',
    price: 59,
    priceUSDC: 50.15,
    period: 'one-off',
    description: 'Be your own marketing manager',
    community: 'The Marketing Room',
    color: '#E8A838',
    features: [
      'Everything in Campaign',
      '90-day posting calendar',
      'Promo site submission deadlines',
      'Amazon ad refresh variants',
      'The Marketing Room community',
    ],
  },
  {
    id: 'studio',
    name: 'Studio',
    price: 249,
    priceUSDC: 211.65,
    period: 'per year',
    description: 'Book Marketing Agency in a Box',
    community: 'The Boardroom',
    color: '#FF6B35',
    badge: 'FOUNDING MEMBER — 200 ONLY',
    features: [
      'Unlimited book projects',
      '12-month calendar per project',
      'Series awareness across catalogue',
      'Agency dashboard',
      'Break even after one client',
      'The Boardroom community',
      'Shape every future version',
    ],
  },
];

export default function SubscriptionScreen() {
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState('command');
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [useCrypto, setUseCrypto] = useState(true);

  const selected = TIERS.find(t => t.id === selectedTier)!;

  const handlePayment = async () => {
    setPaying(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    setPaying(false);
    setPaid(true);
  };

  if (paid) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.successScreen}>
          <Text style={styles.successIcon}>✦</Text>
          <Text style={styles.successTitle}>Welcome to {selected.name}</Text>
          <Text style={styles.successSub}>
            Your payment was confirmed on Solana.{'\n'}
            {selected.community} is waiting for you.
          </Text>
          <View style={styles.txCard}>
            <Text style={styles.txLabel}>Transaction confirmed</Text>
            <Text style={styles.txHash}>DemoTx_{Date.now().toString().slice(-8)}...✓</Text>
            <Text style={styles.txNetwork}>Solana · USDC · &lt;1 second</Text>
          </View>
          <TouchableOpacity style={styles.successBtn} onPress={() => router.back()}>
            <Text style={styles.successBtnText}>Start Publishing →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>Choose Your Plan</Text>
            <Text style={styles.subtitle}>One-off payment. No hidden fees.</Text>
          </View>
        </View>

        {/* Crypto Toggle */}
        <View style={styles.cryptoToggle}>
          <TouchableOpacity
            style={[styles.toggleOption, useCrypto && styles.toggleOptionActive]}
            onPress={() => setUseCrypto(true)}
          >
            <Text style={[styles.toggleText, useCrypto && styles.toggleTextActive]}>
              ◎ Pay with USDC
            </Text>
            {useCrypto && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>15% OFF</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleOption, !useCrypto && styles.toggleOptionActiveStd]}
            onPress={() => setUseCrypto(false)}
          >
            <Text style={[styles.toggleText, !useCrypto && styles.toggleTextActive]}>
              💳 Standard
            </Text>
          </TouchableOpacity>
        </View>

        {useCrypto && (
          <View style={styles.cryptoInfo}>
            <Text style={styles.cryptoInfoText}>
              ◎ Zero platform commission · Confirmed in &lt;1 second · Seed Vault secured
            </Text>
          </View>
        )}

        {/* Tier Cards */}
        <View style={styles.tiers}>
          {TIERS.map((tier) => (
            <TouchableOpacity
              key={tier.id}
              style={[
                styles.tierCard,
                { borderColor: selectedTier === tier.id ? tier.color : '#2A2A44' },
                selectedTier === tier.id && styles.tierCardSelected,
              ]}
              onPress={() => setSelectedTier(tier.id)}
              activeOpacity={0.85}
            >
              {tier.badge && (
                <View style={[styles.tierBadge, { backgroundColor: tier.color }]}>
                  <Text style={styles.tierBadgeText}>{tier.badge}</Text>
                </View>
              )}

              <View style={styles.tierHeader}>
                <View>
                  <Text style={[styles.tierName, { color: tier.color }]}>{tier.name}</Text>
                  <Text style={styles.tierDesc}>{tier.description}</Text>
                </View>
                <View style={styles.tierPricing}>
                  <Text style={styles.tierPrice}>
                    {useCrypto
                      ? `$${tier.priceUSDC} USDC`
                      : `$${tier.price}`}
                  </Text>
                  <Text style={styles.tierPeriod}>{tier.period}</Text>
                  {useCrypto && (
                    <Text style={styles.tierOriginal}>${tier.price}</Text>
                  )}
                </View>
              </View>

              <View style={styles.tierFeatures}>
                {tier.features.map((f, i) => (
                  <View key={i} style={styles.featureRow}>
                    <Text style={[styles.featureCheck, { color: tier.color }]}>✓</Text>
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Button */}
        <View style={styles.paymentSection}>
          <View style={styles.paymentSummary}>
            <Text style={styles.paymentSummaryText}>
              {selected.name} · {useCrypto ? `$${selected.priceUSDC} USDC` : `$${selected.price}`}
            </Text>
            {useCrypto && (
              <Text style={styles.paymentSaving}>
                You save ${(selected.price - selected.priceUSDC).toFixed(2)}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.payBtn, { backgroundColor: selected.color }, paying && styles.payBtnDisabled]}
            onPress={handlePayment}
            disabled={paying}
            activeOpacity={0.85}
          >
            {paying ? (
              <View style={styles.payingRow}>
                <ActivityIndicator color="#0F0F1A" size="small" />
                <Text style={styles.payBtnText}> Confirming on Solana...</Text>
              </View>
            ) : (
              <Text style={styles.payBtnText}>
                {useCrypto ? '◎ Pay with Solana' : '💳 Pay Now'} · {selected.name}
              </Text>
            )}
          </TouchableOpacity>

          {useCrypto && (
            <Text style={styles.payNote}>
              Secured by Seed Vault · Zero platform commission
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0F0F1A' },
  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },

  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#1E1E32', alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 18, color: '#E8A838' },
  headerText: { flex: 1 },
  title: { fontSize: 22, fontWeight: '800', color: '#F5F5F5' },
  subtitle: { fontSize: 13, color: '#8888AA', marginTop: 2 },

  cryptoToggle: { flexDirection: 'row', backgroundColor: '#1E1E32', borderRadius: 12, borderWidth: 1, borderColor: '#2A2A44', padding: 4, marginBottom: 12, gap: 4 },
  toggleOption: { flex: 1, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  toggleOptionActive: { backgroundColor: '#9945FF' },
  toggleOptionActiveStd: { backgroundColor: '#2A2A44' },
  toggleText: { fontSize: 13, color: '#8888AA', fontWeight: '600' },
  toggleTextActive: { color: '#F5F5F5' },
  discountBadge: { backgroundColor: '#14F195', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  discountText: { fontSize: 10, color: '#0F0F1A', fontWeight: '800' },

  cryptoInfo: { backgroundColor: '#0D0D1F', borderRadius: 10, borderWidth: 1, borderColor: '#1A1A3A', padding: 12, marginBottom: 20, alignItems: 'center' },
  cryptoInfoText: { fontSize: 12, color: '#9945FF', fontWeight: '500' },

  tiers: { gap: 14, marginBottom: 24 },
  tierCard: { backgroundColor: '#1E1E32', borderRadius: 16, borderWidth: 1.5, padding: 18, gap: 14 },
  tierCardSelected: { backgroundColor: '#1A1A2E' },
  tierBadge: { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  tierBadgeText: { fontSize: 10, color: '#0F0F1A', fontWeight: '800', letterSpacing: 0.5 },
  tierHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  tierName: { fontSize: 18, fontWeight: '800' },
  tierDesc: { fontSize: 12, color: '#8888AA', marginTop: 2 },
  tierPricing: { alignItems: 'flex-end' },
  tierPrice: { fontSize: 16, fontWeight: '800', color: '#F5F5F5' },
  tierPeriod: { fontSize: 11, color: '#8888AA' },
  tierOriginal: { fontSize: 11, color: '#555577', textDecorationLine: 'line-through' },
  tierFeatures: { gap: 8 },
  featureRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  featureCheck: { fontSize: 13, fontWeight: '700', marginTop: 1 },
  featureText: { fontSize: 13, color: '#8888AA', flex: 1, lineHeight: 18 },

  paymentSection: { gap: 12 },
  paymentSummary: { backgroundColor: '#1E1E32', borderRadius: 12, borderWidth: 1, borderColor: '#2A2A44', padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  paymentSummaryText: { fontSize: 15, color: '#F5F5F5', fontWeight: '700' },
  paymentSaving: { fontSize: 13, color: '#14F195', fontWeight: '600' },
  payBtn: { borderRadius: 14, padding: 18, alignItems: 'center' },
  payBtnDisabled: { opacity: 0.7 },
  payBtnText: { color: '#0F0F1A', fontWeight: '800', fontSize: 16 },
  payingRow: { flexDirection: 'row', alignItems: 'center' },
  payNote: { textAlign: 'center', fontSize: 12, color: '#555577' },

  successScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 },
  successIcon: { fontSize: 48, color: '#E8A838' },
  successTitle: { fontSize: 28, fontWeight: '800', color: '#F5F5F5', textAlign: 'center' },
  successSub: { fontSize: 15, color: '#8888AA', textAlign: 'center', lineHeight: 22 },
  txCard: { backgroundColor: '#1E1E32', borderRadius: 14, borderWidth: 1, borderColor: '#2A2A44', padding: 18, width: '100%', gap: 8, alignItems: 'center' },
  txLabel: { fontSize: 12, color: '#8888AA', fontWeight: '600' },
  txHash: { fontSize: 13, color: '#14F195', fontWeight: '700' },
  txNetwork: { fontSize: 12, color: '#9945FF' },
  successBtn: { backgroundColor: '#E8A838', borderRadius: 14, padding: 18, width: '100%', alignItems: 'center' },
  successBtnText: { color: '#0F0F1A', fontWeight: '800', fontSize: 16 },
});