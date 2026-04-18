import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";

const COLORS = {
  primary: "#1A1A2E",
  accent: "#E8A838",
  surface: "#1E1E32",
  text: "#F5F5F5",
  background: "#0F0F1A",
};

const API_URL = "https://quilldeck-api.vercel.app/api/generate-blurb";

export default function BlurbGenerator() {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [blurbs, setBlurbs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateBlurbs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, genre, synopsis }),
      });
      const data = await response.json();
      setBlurbs(data.blurbs || []);
    } catch (err) {
      setError("Failed to generate blurbs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>AI Blurb Generator</Text>
      <TextInput style={styles.input} placeholder="Book Title" placeholderTextColor="#888" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Genre (e.g. Afroeurofantasy)" placeholderTextColor="#888" value={genre} onChangeText={setGenre} />
      <TextInput style={styles.input} placeholder="Synopsis (2-3 sentences)" placeholderTextColor="#888" value={synopsis} onChangeText={setSynopsis} multiline numberOfLines={4} />
      <TouchableOpacity style={styles.button} onPress={generateBlurbs} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Generating..." : "Generate Blurbs"}</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator color={COLORS.accent} size="large" style={{ marginTop: 24 }} />}
      {error && <Text style={styles.error}>{error}</Text>}
      {blurbs.map((blurb, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.hook}>{blurb.hook?.toUpperCase()} HOOK</Text>
          <Text style={styles.blurbText}>{blurb.text}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20 },
  heading: { color: COLORS.accent, fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  input: { backgroundColor: COLORS.surface, color: COLORS.text, borderRadius: 8, padding: 12, marginBottom: 16 },
  button: { backgroundColor: COLORS.accent, borderRadius: 8, padding: 16, alignItems: "center", marginBottom: 16 },
  buttonText: { color: COLORS.primary, fontWeight: "bold", fontSize: 16 },
  error: { color: "#EF5350", textAlign: "center", marginBottom: 16 },
  card: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, marginBottom: 16 },
  hook: { color: COLORS.accent, fontSize: 11, fontWeight: "bold", marginBottom: 8 },
  blurbText: { color: COLORS.text, lineHeight: 22 },
});
