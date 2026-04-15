import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../constants/app-styles';

export default function BlurbGenerator() {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [blurbs, setBlurbs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const generateBlurbs = async () => {
    if (!title || !genre || !synopsis) return;
    setLoading(true);
    try {
      const response = await fetch('https://quilldeck-api.vercel.app/api/generate-blurb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, genre, synopsis }),
      });
      const data = await response.json();
      setBlurbs(data.blurbs);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
        { variant: 1, hook: 'emotional', text: 'Sample blurb 1 — emotional hook. This will be replaced by Claude AI.' },
        { variant: 2, hook: 'action', text: 'Sample blurb 2 — action hook. This will be replaced by Claude AI.' },
        { variant: 3, hook: 'mystery', text: 'Sample blurb 3 — mystery hook. This will be replaced by Claude AI.' },
      ]);
      setLoading(false);
    }, 1500);
  };

  return (
    <ScrollView style={styles.screen}>
      <Text style={styles.title}>AI Blurb Generator</Text>
      <Text style={styles.subtitle}>Get 3 professional blurbs for your book</Text>

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
        placeholder="Brief synopsis (2-3 sentences)"
        placeholderTextColor={COLORS.textMuted}
        value={synopsis}
        onChangeText={setSynopsis}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.button} onPress={generateBlurbs}>
        <Text style={styles.buttonText}>✨ Generate Blurbs</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator color={COLORS.accent} size="large" style={{ marginTop: 24 }} />}

      {blurbs.map((blurb) => (
        <View key={blurb.variant} style={styles.card}>
          <Text style={styles.hookLabel}>{blurb.hook.toUpperCase()} HOOK</Text>
          <Text style={styles.blurbText}>{blurb.text}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginBottom: 24 },
  input: { backgroundColor: COLORS.surface, color: COLORS.text, borderRadius: 10, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: COLORS.surfaceLight },
  textArea: { height: 100, textAlignVertical: 'top' },
  button: { backgroundColor: COLORS.accent, borderRadius: 10, padding: 16, alignItems: 'center', marginBottom: 24 },
  buttonText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16 },
  card: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: COLORS.surfaceLight },
  hookLabel: { color: COLORS.accent, fontSize: 11, fontWeight: 'bold', marginBottom: 8 },
  blurbText: { color: COLORS.text, lineHeight: 22 },
});