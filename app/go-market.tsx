import { useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';

const API_URL = 'https://quilldeck-api.vercel.app/api/generate-marketing';

interface SocialPost { platform: string; content: string; hashtags: string[]; }
interface Email { type: string; subjectLine: string; subjectLineAlt: string; body: string; }
interface AdCopy { headline: string; body: string; keywords: string[]; }
interface CalendarDay { day: number; platform: string; postType: string; content: string; }
interface PromoSite { name: string; url: string; cost: string; genre: string; notes: string; }

interface MarketingPackage {
  socialPosts: SocialPost[];
  emails: Email[];
  adCopy: AdCopy[];
  calendar: CalendarDay[];
  promoSites: PromoSite[];
}

const TABS = ['Social', 'Emails', 'Ads', 'Calendar', 'Promo'];

const PLATFORM_COLORS: Record<string, string> = {
  booktok: '#FF0050',
  bookstagram: '#E1306C',
  instagram: '#E1306C',
  x: '#1DA1F2',
  twitter: '#1DA1F2',
  facebook: '#1877F2',
  general: '#E8A838',
  threads: '#000000',
};

const EMAIL_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  'pre-launch': { label: 'PRE-LAUNCH', color: '#9945FF' },
  'launch-day': { label: 'LAUNCH DAY', color: '#E8A838' },
  'launch-week': { label: 'LAUNCH WEEK', color: '#E8A838' },
  'post-launch': { label: 'POST-LAUNCH', color: '#14F195' },
  'follow-up': { label: 'FOLLOW-UP', color: '#14F195' },
};

export default function GoMarketScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [blurb, setBlurb] = useState('');
  const [launchDate, setLaunchDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [pkg, setPkg] = useState<MarketingPackage | null>(null);
  const [activeTab, setActiveTab] = useState('Social');
  const [copied, setCopied] = useState<string | null>(null);

  const generate = async () => {
    if (!title.trim() || !genre.trim()) return;
    setLoading(true);
    setPkg(null);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `You are an expert indie book marketing strategist. Generate a complete marketing package for a book launch.

Book details:
- Title: "${title}"
- Genre: ${genre}
- Blurb: ${blurb || 'Not provided'}
- Launch date: ${launchDate || 'Coming soon'}

Use the ACTUAL book title, genre, and any character/world details from the blurb throughout ALL content. Make every piece of content specific to THIS book, not generic.

Generate ALL of the following:

1. SOCIAL MEDIA POSTS (5 posts) — platform-specific, each referencing the actual book:
   - BookTok script (60-second hook)
   - Bookstagram caption (20 hashtags)
   - X/Twitter post
   - Facebook post
   - General post

2. EMAIL NEWSLETTERS (3 emails) with subject lines:
   - Pre-launch tease
   - Launch day announcement  
   - Post-launch follow-up

3. AMAZON AD COPY (3 variants):
   Each with headline, body copy, and 5 keywords

4. POSTING CALENDAR (14 days):
   Day-by-day with platform, post type, and content snippet

5. PROMO SITES (5 recommendations):
   Name, URL, cost, genre fit, submission notes

Respond in valid JSON only (no markdown):
{
  "socialPosts": [{"platform":"booktok","content":"...","hashtags":["..."]}],
  "emails": [{"type":"pre-launch","subjectLine":"...","subjectLineAlt":"...","body":"..."}],
  "adCopy": [{"headline":"...","body":"...","keywords":["..."]}],
  "calendar": [{"day":1,"platform":"...","postType":"...","content":"..."}],
  "promoSites": [{"name":"...","url":"...","cost":"...","genre":"...","notes":"..."}]
}`,
        }),
      });
      const data = await response.json();
      if (data.socialPosts) {
        setPkg(data);
        setActiveTab('Social');
      }
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyText = async (text: string, key: string) => {
    await Clipboard.setStringAsync(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>Go Market This 🚀</Text>
            <Text style={styles.subtitle}>One tap. Complete book launch plan.</Text>
          </View>
        </View>

        {/* Input Card */}
        {!pkg && (
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Book Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. The Silent One"
              placeholderTextColor="#555577"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.inputLabel}>Genre</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Afroeurofantasy"
              placeholderTextColor="#555577"
              value={genre}
              onChangeText={setGenre}
            />

            <Text style={styles.inputLabel}>Blurb <Text style={styles.optional}>(recommended)</Text></Text>
            <TextInput
              style={[styles.input, styles.inputMulti]}
              placeholder="Paste your book blurb here for more specific, powerful marketing content..."
              placeholderTextColor="#555577"
              value={blurb}
              onChangeText={setBlurb}
              multiline
              numberOfLines={4}
            />

            <Text style={styles.inputLabel}>Launch Date <Text style={styles.optional}>(optional)</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 2026-05-11"
              placeholderTextColor="#555577"
              value={launchDate}
              onChangeText={setLaunchDate}
            />

            <TouchableOpacity
              style={[styles.generateBtn, loading && styles.generateBtnDisabled]}
              onPress={generate}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#0F0F1A" size="small" />
                  <Text style={styles.generateBtnText}> Generating your complete marketing plan...</Text>
                </View>
              ) : (
                <Text style={styles.generateBtnText}>⚡ Go Market This</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Results */}
        {pkg && (
          <View style={styles.results}>
            {/* Results Header */}
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>Your Marketing Plan ✨</Text>
              <TouchableOpacity onPress={() => setPkg(null)} style={styles.resetBtn}>
                <Text style={styles.resetBtnText}>New Book</Text>
              </TouchableOpacity>
            </View>

            {/* Tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
              <View style={styles.tabs}>
                {TABS.map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    style={[styles.tab, activeTab === tab && styles.tabActive]}
                    onPress={() => setActiveTab(tab)}
                  >
                    <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                      {tab}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Social Tab */}
            {activeTab === 'Social' && (
              <View style={styles.tabContent}>
                {pkg.socialPosts.map((post, i) => {
                  const color = PLATFORM_COLORS[post.platform.toLowerCase()] || '#E8A838';
                  const key = `social-${i}`;
                  return (
                    <View key={key} style={styles.contentCard}>
                      <View style={styles.cardHeader}>
                        <View style={[styles.platformBadge, { borderColor: color }]}>
                          <Text style={[styles.platformText, { color }]}>
                            {post.platform.toUpperCase()}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={[styles.copyBtn, copied === key && styles.copyBtnSuccess]}
                          onPress={() => copyText(`${post.content}\n\n${post.hashtags?.map(h => `#${h}`).join(' ')}`, key)}
                        >
                          <Text style={styles.copyBtnText}>{copied === key ? '✓' : 'Copy'}</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.contentText}>{post.content}</Text>
                      {post.hashtags?.length > 0 && (
                        <Text style={styles.hashtags}>
                          {post.hashtags.map(h => `#${h}`).join(' ')}
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>
            )}

            {/* Emails Tab */}
            {activeTab === 'Emails' && (
              <View style={styles.tabContent}>
                {pkg.emails.map((email, i) => {
                  const config = EMAIL_TYPE_CONFIG[email.type.toLowerCase()] ||
                    { label: email.type.toUpperCase(), color: '#E8A838' };
                  const key = `email-${i}`;
                  return (
                    <View key={key} style={styles.contentCard}>
                      <View style={styles.cardHeader}>
                        <View style={[styles.platformBadge, { borderColor: config.color }]}>
                          <Text style={[styles.platformText, { color: config.color }]}>
                            {config.label}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={[styles.copyBtn, copied === key && styles.copyBtnSuccess]}
                          onPress={() => copyText(`Subject: ${email.subjectLine}\n\n${email.body}`, key)}
                        >
                          <Text style={styles.copyBtnText}>{copied === key ? '✓' : 'Copy'}</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.subjectLine}>✉ {email.subjectLine}</Text>
                      {email.subjectLineAlt && (
                        <Text style={styles.subjectLineAlt}>Alt: {email.subjectLineAlt}</Text>
                      )}
                      <Text style={styles.contentText}>{email.body}</Text>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Ads Tab */}
            {activeTab === 'Ads' && (
              <View style={styles.tabContent}>
                {pkg.adCopy.map((ad, i) => {
                  const key = `ad-${i}`;
                  return (
                    <View key={key} style={styles.contentCard}>
                      <View style={styles.cardHeader}>
                        <View style={[styles.platformBadge, { borderColor: '#E8A838' }]}>
                          <Text style={[styles.platformText, { color: '#E8A838' }]}>
                            VARIANT {i + 1}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={[styles.copyBtn, copied === key && styles.copyBtnSuccess]}
                          onPress={() => copyText(`${ad.headline}\n\n${ad.body}`, key)}
                        >
                          <Text style={styles.copyBtnText}>{copied === key ? '✓' : 'Copy'}</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.adHeadline}>{ad.headline}</Text>
                      <Text style={styles.contentText}>{ad.body}</Text>
                      <Text style={styles.keywords}>
                        🔑 {ad.keywords?.join(' · ')}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Calendar Tab */}
            {activeTab === 'Calendar' && (
              <View style={styles.tabContent}>
                {pkg.calendar.map((day, i) => {
                  const color = PLATFORM_COLORS[day.platform?.toLowerCase()] || '#E8A838';
                  const key = `cal-${i}`;
                  return (
                    <View key={key} style={styles.calendarCard}>
                      <View style={[styles.dayBadge, { backgroundColor: color }]}>
                        <Text style={styles.dayBadgeText}>D{day.day}</Text>
                      </View>
                      <View style={styles.calendarBody}>
                        <Text style={[styles.calendarPlatform, { color }]}>
                          {day.platform} · {day.postType}
                        </Text>
                        <Text style={styles.calendarContent}>{day.content}</Text>
                      </View>
                      <TouchableOpacity
                        style={[styles.copyBtnSmall, copied === key && styles.copyBtnSuccess]}
                        onPress={() => copyText(day.content, key)}
                      >
                        <Text style={styles.copyBtnText}>{copied === key ? '✓' : 'Copy'}</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Promo Tab */}
            {activeTab === 'Promo' && (
              <View style={styles.tabContent}>
                {pkg.promoSites.map((site, i) => (
                  <View key={i} style={styles.contentCard}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.siteName}>{site.name}</Text>
                      <TouchableOpacity onPress={() => Linking.openURL(site.url)}>
                        <Text style={styles.visitLink}>Visit →</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.siteMeta}>
                      <Text style={styles.siteMetaText}>💰 {site.cost}</Text>
                      <Text style={styles.siteMetaText}>🎯 {site.genre}</Text>
                    </View>
                    <Text style={styles.contentText}>{site.notes}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
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
  title: { fontSize: 22, fontWeight: '800', color: '#E8A838' },
  subtitle: { fontSize: 13, color: '#8888AA', marginTop: 2 },

  inputCard: { backgroundColor: '#1E1E32', borderRadius: 16, borderWidth: 1, borderColor: '#2A2A44', padding: 18, gap: 10 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#8888AA', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: -4 },
  optional: { color: '#555577', fontWeight: '400', textTransform: 'none' },
  input: { backgroundColor: '#0F0F1A', borderRadius: 10, borderWidth: 1, borderColor: '#2A2A44', padding: 14, color: '#F5F5F5', fontSize: 15 },
  inputMulti: { minHeight: 100, textAlignVertical: 'top' },

  generateBtn: { backgroundColor: '#E8A838', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 6 },
  generateBtnDisabled: { opacity: 0.7 },
  generateBtnText: { color: '#0F0F1A', fontWeight: '800', fontSize: 16 },
  loadingRow: { flexDirection: 'row', alignItems: 'center' },

  results: { gap: 16 },
  resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resultsTitle: { fontSize: 20, fontWeight: '800', color: '#F5F5F5' },
  resetBtn: { backgroundColor: '#1E1E32', borderRadius: 8, borderWidth: 1, borderColor: '#2A2A44', paddingHorizontal: 12, paddingVertical: 6 },
  resetBtnText: { color: '#8888AA', fontSize: 13, fontWeight: '600' },

  tabsScroll: { marginBottom: 4 },
  tabs: { flexDirection: 'row', gap: 8, paddingBottom: 4 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1E1E32', borderWidth: 1, borderColor: '#2A2A44' },
  tabActive: { backgroundColor: '#E8A838', borderColor: '#E8A838' },
  tabText: { color: '#8888AA', fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: '#0F0F1A', fontWeight: '800' },

  tabContent: { gap: 14 },

  contentCard: { backgroundColor: '#1E1E32', borderRadius: 14, borderWidth: 1, borderColor: '#2A2A44', padding: 16, gap: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  platformBadge: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  platformText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  contentText: { fontSize: 14, color: '#F5F5F5', lineHeight: 22 },
  hashtags: { fontSize: 12, color: '#9945FF', lineHeight: 18 },

  copyBtn: { backgroundColor: '#2A2A44', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6 },
  copyBtnSmall: { backgroundColor: '#2A2A44', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  copyBtnSuccess: { backgroundColor: '#1A3A1A' },
  copyBtnText: { color: '#F5F5F5', fontSize: 12, fontWeight: '600' },

  subjectLine: { fontSize: 14, color: '#E8A838', fontWeight: '700' },
  subjectLineAlt: { fontSize: 12, color: '#8888AA', fontStyle: 'italic' },

  adHeadline: { fontSize: 16, color: '#E8A838', fontWeight: '800' },
  keywords: { fontSize: 12, color: '#9945FF' },

  calendarCard: { backgroundColor: '#1E1E32', borderRadius: 12, borderWidth: 1, borderColor: '#2A2A44', padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  dayBadge: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  dayBadgeText: { color: '#0F0F1A', fontWeight: '800', fontSize: 13 },
  calendarBody: { flex: 1, gap: 4 },
  calendarPlatform: { fontSize: 12, fontWeight: '700' },
  calendarContent: { fontSize: 13, color: '#F5F5F5', lineHeight: 18 },

  siteName: { fontSize: 15, fontWeight: '800', color: '#E8A838' },
  visitLink: { fontSize: 13, color: '#9945FF', fontWeight: '600' },
  siteMeta: { flexDirection: 'row', gap: 12 },
  siteMetaText: { fontSize: 12, color: '#8888AA' },
});