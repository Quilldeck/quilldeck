
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Clipboard,
  Linking,
  Alert,
} from "react-native";

const COLORS = {
  primary: "#1A1A2E",
  accent: "#E8AB38",
  surface: "#1E1E32",
  surfaceLight: "#2A2A44",
  text: "#F5F5F5",
  textMuted: "#8888AA",
  background: "#0F0F1A",
  success: "#4CAF50",
  solana: "#9945FF",
};

const API_URL = "https://quilldeck-api.vercel.app/api/generate-marketing";

interface SocialPost {
  platform: string;
  content: string;
  hashtags: string[];
}

interface Email {
  type: string;
  subjectLine: string;
  subjectLineAlt: string;
  body: string;
}

interface AdCopy {
  headline: string;
  body: string;
  keywords: string[];
}

interface CalendarDay {
  day: number;
  date: string;
  platform: string;
  postType: string;
  content: string;
}

interface PromoSite {
  name: string;
  url: string;
  cost: string;
  genre: string;
  notes: string;
}

interface MarketingPackage {
  socialPosts: SocialPost[];
  emails: Email[];
  adCopy: AdCopy[];
  calendar: CalendarDay[];
  promoSites: PromoSite[];
}

const TABS = ["Social", "Emails", "Ads", "Calendar", "Promo"];

export default function GoMarketScreen() {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [blurb, setBlurb] = useState("");
  const [launchDate, setLaunchDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MarketingPackage | null>(null);
  const [activeTab, setActiveTab] = useState("Social");
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!title || !genre) {
      Alert.alert("Missing fields", "Please enter at least a title and genre.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, genre, blurb, launchDate }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setActiveTab("Social");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    Clipboard.setString(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const CopyButton = ({ text, id }: { text: string; id: string }) => (
    <TouchableOpacity
      style={[styles.copyBtn, copied === id && styles.copyBtnSuccess]}
      onPress={() => copyToClipboard(text, id)}
    >
      <Text style={styles.copyBtnText}>
        {copied === id ? "Copied!" : "Copy"}
      </Text>
    </TouchableOpacity>
  );

  const renderSocial = () =>
    result?.socialPosts.map((post, i) => (
      <View key={i} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardLabel}>
            {post.platform.toUpperCase()}
          </Text>
          <CopyButton
            text={post.content + "\n\n" + post.hashtags.map(h => "#" + h).join(" ")}
            id={"social_" + i}
          />
        </View>
        <Text style={styles.cardContent}>{post.content}</Text>
        <Text style={styles.hashtags}>
          {post.hashtags.map(h => "#" + h).join(" ")}
        </Text>
      </View>
    ));

  const renderEmails = () =>
    result?.emails.map((email, i) => (
      <View key={i} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardLabel}>{email.type.toUpperCase()}</Text>
          <CopyButton
            text={`Subject: ${email.subjectLine}\n\n${email.body}`}
            id={"email_" + i}
          />
        </View>
        <Text style={styles.subjectLine}>📧 {email.subjectLine}</Text>
        <Text style={styles.subjectLineAlt}>Alt: {email.subjectLineAlt}</Text>
        <Text style={styles.cardContent}>{email.body}</Text>
      </View>
    ));

  const renderAds = () =>
    result?.adCopy.map((ad, i) => (
      <View key={i} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardLabel}>VARIANT {i + 1}</Text>
          <CopyButton
            text={`${ad.headline}\n\n${ad.body}`}
            id={"ad_" + i}
          />
        </View>
        <Text style={styles.adHeadline}>{ad.headline}</Text>
        <Text style={styles.cardContent}>{ad.body}</Text>
        <Text style={styles.keywords}>
          🔑 {ad.keywords.join(" · ")}
        </Text>
      </View>
    ));

  const renderCalendar = () =>
    result?.calendar.map((day, i) => (
      <View key={i} style={styles.calendarRow}>
        <View style={styles.calendarDay}>
          <Text style={styles.calendarDayNum}>D{day.day}</Text>
        </View>
        <View style={styles.calendarContent}>
          <Text style={styles.calendarMeta}>
            {day.platform} · {day.postType}
          </Text>
          <Text style={styles.calendarText}>{day.content}</Text>
        </View>
        <CopyButton text={day.content} id={"cal_" + i} />
      </View>
    ));

  const renderPromo = () =>
    result?.promoSites.map((site, i) => (
      <View key={i} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardLabel}>{site.name}</Text>
          <TouchableOpacity onPress={() => Linking.openURL(site.url)}>
            <Text style={styles.linkBtn}>Visit →</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.promoMeta}>💰 {site.cost} · 🎯 {site.genre}</Text>
        <Text style={styles.cardContent}>{site.notes}</Text>
      </View>
    ));

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Go Market This 🚀</Text>
      <Text style={styles.subtitle}>
        One tap. Complete book launch plan.
      </Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Book title"
          placeholderTextColor={COLORS.textMuted}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Genre (e.g. Afroeurofantasy)"
          placeholderTextColor={COLORS.textMuted}
          value={genre}
          onChangeText={setGenre}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Blurb (optional but recommended)"
          placeholderTextColor={COLORS.textMuted}
          value={blurb}
          onChangeText={setBlurb}
          multiline
          numberOfLines={4}
        />
        <TextInput
          style={styles.input}
          placeholder="Launch date (e.g. 2026-05-11)"
          placeholderTextColor={COLORS.textMuted}
          value={launchDate}
          onChangeText={setLaunchDate}
        />

        <TouchableOpacity
          style={[styles.generateBtn, loading && styles.generateBtnDisabled]}
          onPress={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.primary} />
          ) : (
            <Text style={styles.generateBtnText}>⚡ Go Market This</Text>
          )}
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingBox}>
          <Text style={styles.loadingText}>
            Generating your complete marketing plan...
          </Text>
          <Text style={styles.loadingSubtext}>
            Social posts · Emails · Ad copy · Calendar · Promo sites
          </Text>
        </View>
      )}

      {result && (
        <View style={styles.results}>
          <Text style={styles.resultsTitle}>Your Marketing Plan ✨</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabs}
          >
            {TABS.map(tab => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.tabTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.tabContent}>
            {activeTab === "Social" && renderSocial()}
            {activeTab === "Emails" && renderEmails()}
            {activeTab === "Ads" && renderAds()}
            {activeTab === "Calendar" && renderCalendar()}
            {activeTab === "Promo" && renderPromo()}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  title: { fontSize: 28, fontWeight: "bold", color: COLORS.accent, marginTop: 24 },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginBottom: 24 },
  form: { gap: 12 },
  input: {
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: COLORS.surfaceLight,
  },
  textArea: { height: 100, textAlignVertical: "top" },
  generateBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  generateBtnDisabled: { opacity: 0.6 },
  generateBtnText: { color: COLORS.primary, fontWeight: "bold", fontSize: 17 },
  loadingBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
    marginTop: 24,
    alignItems: "center",
  },
  loadingText: { color: COLORS.text, fontSize: 16, fontWeight: "600" },
  loadingSubtext: { color: COLORS.textMuted, fontSize: 13, marginTop: 8 },
  results: { marginTop: 32 },
  resultsTitle: { fontSize: 20, fontWeight: "bold", color: COLORS.text, marginBottom: 16 },
  tabs: { flexDirection: "row", marginBottom: 16 },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    marginRight: 8,
  },
  tabActive: { backgroundColor: COLORS.accent },
  tabText: { color: COLORS.textMuted, fontSize: 14, fontWeight: "600" },
  tabTextActive: { color: COLORS.primary },
  tabContent: { paddingBottom: 40 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.surfaceLight,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardLabel: { color: COLORS.accent, fontWeight: "bold", fontSize: 12 },
  cardContent: { color: COLORS.text, fontSize: 14, lineHeight: 22 },
  hashtags: { color: COLORS.solana, fontSize: 13, marginTop: 8 },
  subjectLine: { color: COLORS.text, fontWeight: "600", fontSize: 15, marginBottom: 4 },
  subjectLineAlt: { color: COLORS.textMuted, fontSize: 13, marginBottom: 10 },
  adHeadline: { color: COLORS.accent, fontWeight: "bold", fontSize: 16, marginBottom: 8 },
  keywords: { color: COLORS.textMuted, fontSize: 13, marginTop: 8 },
  calendarRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  calendarDay: {
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  calendarDayNum: { color: COLORS.primary, fontWeight: "bold", fontSize: 12 },
  calendarContent: { flex: 1 },
  calendarMeta: { color: COLORS.accent, fontSize: 12, fontWeight: "600", marginBottom: 4 },
  calendarText: { color: COLORS.text, fontSize: 13 },
  promoMeta: { color: COLORS.textMuted, fontSize: 13, marginBottom: 8 },
  linkBtn: { color: COLORS.accent, fontWeight: "bold", fontSize: 14 },
  copyBtn: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  copyBtnSuccess: { backgroundColor: COLORS.success },
  copyBtnText: { color: COLORS.text, fontSize: 12, fontWeight: "600" },
});
