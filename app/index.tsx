import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.logoRow}>
            <Text style={styles.logoIcon}>✦</Text>
            <Text style={styles.logoText}>Quilldeck</Text>
          </View>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Built on Solana</Text>
            </View>
          </View>
        </Animated.View>

        {/* Hero */}
        <Animated.View
          style={[
            styles.hero,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.heroHeadline}>
            Your book deserves{'\n'}
            <Text style={styles.heroAccent}>a fighting chance.</Text>
          </Text>
          <Text style={styles.heroSub}>
            AI-powered publishing and marketing toolkit for indie authors.
            One tap. Complete launch plan.
          </Text>
        </Animated.View>

        {/* Feature Cards */}
        <Animated.View style={[styles.cards, { opacity: cardAnim }]}>
          {/* Blurb Card */}
          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => router.push('/blurb-generator')}
            activeOpacity={0.85}
          >
            <View style={styles.cardIconWrap}>
              <Text style={styles.cardIcon}>✨</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>AI Blurb Generator</Text>
              <Text style={styles.cardDesc}>
                3 professional blurbs from your synopsis — emotional, action,
                and mystery hooks. Ready to paste into KDP.
              </Text>
              <View style={styles.cardTag}>
                <Text style={styles.cardTagText}>FREE</Text>
              </View>
            </View>
            <Text style={styles.cardArrow}>›</Text>
          </TouchableOpacity>

          {/* Go Market Card */}
          <TouchableOpacity
            style={[styles.featureCard, styles.featureCardHero]}
            onPress={() => router.push('/go-market')}
            activeOpacity={0.85}
          >
            <View style={[styles.cardIconWrap, styles.cardIconWrapHero]}>
              <Text style={styles.cardIcon}>⚡</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={[styles.cardTitle, styles.cardTitleHero]}>
                Go Market This
              </Text>
              <Text style={[styles.cardDesc, styles.cardDescHero]}>
                One tap generates your complete book launch plan — social posts,
                emails, ad copy, and a 14-day calendar.
              </Text>
              <View style={[styles.cardTag, styles.cardTagHero]}>
                <Text style={[styles.cardTagText, styles.cardTagTextHero]}>
                  PRO FEATURE
                </Text>
              </View>
            </View>
            <Text style={[styles.cardArrow, styles.cardArrowHero]}>›</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Stats Strip */}
        <Animated.View style={[styles.statsRow, { opacity: cardAnim }]}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>4M+</Text>
            <Text style={styles.statLabel}>Indie Authors</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>$6B</Text>
            <Text style={styles.statLabel}>Market Size</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>0%</Text>
            <Text style={styles.statLabel}>Commission</Text>
          </View>
        </Animated.View>

        {/* Solana Strip */}
        <Animated.View style={[styles.solanaStrip, { opacity: cardAnim }]}>
          <Text style={styles.solanaText}>
            ◎ Pay with USDC · Zero platform fees · Seeker-native
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0F0F1A',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 36,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    fontSize: 20,
    color: '#E8A838',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#E8A838',
    letterSpacing: 0.5,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  badge: {
    backgroundColor: '#1A1A3A',
    borderWidth: 1,
    borderColor: '#9945FF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    color: '#9945FF',
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // Hero
  hero: {
    marginBottom: 32,
  },
  heroHeadline: {
    fontSize: 34,
    fontWeight: '800',
    color: '#F5F5F5',
    lineHeight: 42,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  heroAccent: {
    color: '#E8A838',
  },
  heroSub: {
    fontSize: 15,
    color: '#8888AA',
    lineHeight: 22,
  },

  // Cards
  cards: {
    gap: 14,
    marginBottom: 28,
  },
  featureCard: {
    backgroundColor: '#1E1E32',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A44',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  featureCardHero: {
    backgroundColor: '#1A1200',
    borderColor: '#E8A838',
    borderWidth: 1.5,
  },
  cardIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#2A2A44',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconWrapHero: {
    backgroundColor: '#2A1A00',
  },
  cardIcon: {
    fontSize: 22,
  },
  cardBody: {
    flex: 1,
    gap: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F5F5F5',
  },
  cardTitleHero: {
    color: '#E8A838',
    fontSize: 17,
  },
  cardDesc: {
    fontSize: 13,
    color: '#8888AA',
    lineHeight: 18,
  },
  cardDescHero: {
    color: '#BBA060',
  },
  cardTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#2A2A44',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 2,
  },
  cardTagHero: {
    backgroundColor: '#2A1A00',
    borderWidth: 1,
    borderColor: '#E8A838',
  },
  cardTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8888AA',
    letterSpacing: 0.5,
  },
  cardTagTextHero: {
    color: '#E8A838',
  },
  cardArrow: {
    fontSize: 24,
    color: '#2A2A44',
    fontWeight: '300',
  },
  cardArrowHero: {
    color: '#E8A838',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#1E1E32',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2A2A44',
    paddingVertical: 18,
    marginBottom: 14,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNum: {
    fontSize: 22,
    fontWeight: '800',
    color: '#E8A838',
  },
  statLabel: {
    fontSize: 11,
    color: '#8888AA',
    marginTop: 2,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#2A2A44',
  },

  // Solana Strip
  solanaStrip: {
    backgroundColor: '#0D0D1F',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1A1A3A',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  solanaText: {
    fontSize: 12,
    color: '#9945FF',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});