
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';

const COLORS = {
  background: '#0F0F1A',
  surface: '#1E1E32',
  surfaceLight: '#2A2A44',
  text: '#F5F5F5',
  textMuted: '#8888AA',
  accent: '#E8A838',
  primary: '#1A1A2E',
};

export default function BlurbGenerator() {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [blurbs, setBlurbs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateBlurbs = async () => {
    if (!title || !genre || !synopsis) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://quilldeck-api.vercel.app/api/generate-blurb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, genre, synopsis }),
      });
      const data = await response.json();
      if (data.blurbs) {
        setBlurbs(data.blurbs);
      } else {
        setError('No blurbs returned. Try again.');
      }
    } catch (err) {
      setError('Connection failed. Check your internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 }}>
        AI Blurb Generator
      </Text>
      <Text style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 24 }}>
        Get 3 professional blurbs for your book
      </Text>

      <TextInput
        style={{ backgroundColor: COLORS.surface, color: COLORS.text, borderRadius: 10, padding: 14, marginBottom: 12 }}
        placeholder="Book title"
        placeholderTextColor={COLORS.textMuted}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={{ backgroundColor: COLORS.surface, color: COLORS.text, borderRadius: 10, padding: 14, marginBottom: 12 }}
        placeholder="Genre (e.g. Afroeurofantasy)"
        placeholderTextColor={COLORS.textMuted}
        value={genre}
        onChangeText={setGenre}
      />
      <TextInput
        style={{ backgroundColor: COLORS.surface, color: COLORS.text, borderRadius: 10, padding: 14, marginBottom: 24, height: 100, textAlignVertical: 'top' }}
        placeholder="Brief synopsis (2-3 sentences)"
        placeholderTextColor={COLORS.textMuted}
        value={synopsis}
        onChangeText={setSynopsis}
        multiline
      />

      <TouchableOpacity
        style={{ backgroundColor: COLORS.accent, borderRadius: 10, padding: 16, alignItems: 'center', marginBottom: 24 }}
        onPress={generateBlurbs}
        disabled={loading}
      >
        <Text style={{ color: COLORS.primary, fontWeight: 'bold', fontSize: 16 }}>
          {loading ? 'Generating...' : '✦ Generate Blurbs'}
        </Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator color={COLORS.accent} size="large" style={{ marginTop: 24 }} />
      )}

      {error ? (
        <Text style={{ color: '#EF5350', textAlign: 'center', marginBottom: 16 }}>{error}</Text>
      ) : null}

      {blurbs.map((blurb) => (
        <View key={blurb.variant} style={{ backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <Text style={{ color: COLORS.accent, fontSize: 11, fontWeight: 'bold', marginBottom: 8 }}>
            {blurb.hook.toUpperCase()} HOOK
          </Text>
          <Text style={{ color: COLORS.text, lineHeight: 22 }}>{blurb.text}</Text>
        </View>
      ))}
    </ScrollView>
  );
}