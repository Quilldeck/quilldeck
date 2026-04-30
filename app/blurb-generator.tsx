import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { useSubscription } from '../src/hooks/useSubscription';

const GENRES = [
  'Fantasy', 'Science Fiction', 'Romance', 'Mystery / Thriller',
  'Horror', 'Literary Fiction', 'Historical Fiction', 'Urban Fantasy',
  'Paranormal Romance', 'Cozy Mystery', 'Dark Fantasy', 'Epic Fantasy',
  'Space Opera', 'Dystopian', 'Contemporary Romance', 'Afroeurofantasy',
  'LitRPG / GameLit', 'Steampunk', 'Grimdark', 'Young Adult',
  'Middle Grade', 'Non-Fiction', 'Memoir', 'Self-Help',
];

interface Blurb {
  variant: number;
  hook: string;
  text: string;
}

export default function BlurbGeneratorScreen() {
  const router = useRouter();
  const {
    isPro,
    blurbsRemaining,
    checkAndUseBlurb,
    loading: subLoading,
  } = useSubscription();

  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [showGenrePicker, setShowGenrePicker] = useState(false);
  const [blurbs, setBlurbs] = useState<Blurb[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = async (text: string, variant: number) => {
    await Clipboard.setStringAsync(text);
    setCopiedId(variant);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerate = async () => {
    if (!title.trim() || !synopsis.trim() || !selectedGenre) {
      Alert.alert('Missing details', 'Please fill in your book title, genre, and synopsis.');
      return;
    }

    if (!isPro && blurbsRemaining <= 0) {
      Alert.alert(
        'Free limit reached',
        'You have used all 3 free blurb generations. Upgrade to Pro for unlimited access.',
        [
          { text: 'Upgrade to Pro', onPress: () => router.push('/subscription') },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }

    const allowed = await checkAndUseBlurb();
    if (!allowed) {
      Alert.alert(
        'Free limit reached',
        'Upgrade to Pro for unlimited blurb generations.',
        [
          { text: 'Upgrade to Pro', onPress: () => router.push('/subscription') },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }

    setLoading(true);
    setBlurbs([]);

    try {
      const prompt = `You are a professional book marketing copywriter specialising in ${selectedGenre} fiction.

Generate exactly 3 different book blurbs for an indie author's novel. Each blurb should use a different hook strategy:
1. EMOTIONAL HOOK — Lead with the character's emotional stakes
2. ACTION HOOK — Lead with the inciting incident or central conflict
3. MYSTERY HOOK — Lead with an intriguing question or enigma

Book details:
- Title: "${title}"
- Genre: ${selectedGenre}
- Synopsis: ${synopsis}

Requirements for EACH blurb:
- 150-200 words (Amazon optimal length)
- End with a compelling call-to-action line
- Include genre-appropriate tone and language
- Be ready to paste directly into KDP
- No spoilers beyond Act 1

Respond in this exact JSON format (no markdown, no backticks):
{
  "blurbs": [
    {"variant": 1, "hook": "emotional", "text": "Full blurb text here..."},
    {"variant": 2, "hook": "action", "text": "Full blurb text here..."},
    {"variant": 3, "hook": "mystery", "text": "Full blurb text here..."}
  ]
}`;

      const response = await fetch('https://quilldeck-api.vercel.app/api/generate-blurb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (data.blurbs && Array.isArray(data.blurbs)) {
        setBlurbs(data.blurbs);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      Alert.alert('Generation failed', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const hookLabel = (hook: string) => {
    switch (hook) {
      case 'emotional': return '❤️ Emotional Hook';
      case 'action': return '⚡ Action Hook';
      case 'mystery': return '🔮 Mystery Hook';
      default: return hook;
    }
  };

  if (subLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#E8A838" size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>AI Blurb Generator</Text>
        {!isPro && (
          <TouchableOpacity onPress={() => router.push('/subscription')}>
            <Text style={styles.usageText}>
              {blurbsRemaining} free {blurbsRemaining === 1 ? 'generation' : 'generations'} left
            </Text>
          </TouchableOpacity>
        )}
        {isPro && <Text style={styles.proText}>✓ Pro — Unlimited</Text>}
      </View>

      {/* Inputs */}
      <View style={styles.inputSection}>
        <Text style={styles.label}>Book Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your book title"
          placeholderTextColor="#555577"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Genre</Text>
        <TouchableOpacity
          style={styles.genreSelector}
          onPress={() => setShowGenrePicker(!showGenrePicker)}
        >
          <Text style={selectedGenre ? styles.genreSelected : styles.genrePlaceholder}>
            {selectedGenre || 'Select genre'}
          </Text>
          <Text style={styles.genreArrow}>{showGenrePicker ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {showGenrePicker && (
          <View style={styles.genrePicker}>
            <ScrollView style={styles.genreList} nestedScrollEnabled>
              {GENRES.map((genre) => (
                <TouchableOpacity
                  key={genre}
                  style={[styles.genreOption, selectedGenre === genre && styles.genreOptionSelected]}
                  onPress={() => {
                    setSelectedGenre(genre);
                    setShowGenrePicker(false);
                  }}
                >
                  <Text style={[
                    styles.genreOptionText,
                    selectedGenre === genre && styles.genreOptionTextSelected,
                  ]}>
                    {genre}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <Text style={styles.label}>Synopsis</Text>
        <TextInput
          style={[styles.input, styles.synopsisInput]}
          placeholder="Write 2-3 sentences about your book — what happens, who it's about, what's at stake"
          placeholderTextColor="#555577"
          value={synopsis}
          onChangeText={setSynopsis}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Generate button */}
      <TouchableOpacity
        style={[styles.generateButton, loading && styles.generateButtonDisabled]}
        onPress={handleGenerate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#0F0F1A" />
        ) : (
          <Text style={styles.generateButtonText}>✨ Generate 3 Blurbs</Text>
        )}
      </TouchableOpacity>

      {/* Upgrade prompt for free users */}
      {!isPro && blurbsRemaining <= 1 && blurbsRemaining > 0 && (
        <TouchableOpacity
          style={styles.upgradePrompt}
          onPress={() => router.push('/subscription')}
        >
          <Text style={styles.upgradePromptText}>
            Last free generation — Upgrade to Pro for unlimited ✦
          </Text>
        </TouchableOpacity>
      )}

      {/* Results */}
      {blurbs.length > 0 && (
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>Your Blurbs</Text>
          {blurbs.map((blurb) => (
            <View key={blurb.variant} style={styles.blurbCard}>
              <View style={styles.blurbCardHeader}>
                <Text style={styles.blurbHook}>{hookLabel(blurb.hook)}</Text>
                <TouchableOpacity
                  style={[styles.copyButton, copiedId === blurb.variant && styles.copyButtonSuccess]}
                  onPress={() => handleCopy(blurb.text, blurb.variant)}
                >
                  <Text style={styles.copyButtonText}>
                    {copiedId === blurb.variant ? '✓ Copied' : 'Copy'}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.blurbText}>{blurb.text}</Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  centered: {
    flex: 1,
    backgroundColor: '#0F0F1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginBottom: 24,
    marginTop: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#E8A838',
    marginBottom: 4,
  },
  usageText: {
    color: '#8888AA',
    fontSize: 13,
  },
  proText: {
    color: '#14F195',
    fontSize: 13,
    fontWeight: '600',
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    color: '#F5F5F5',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#1E1E32',
    borderRadius: 10,
    padding: 14,
    color: '#F5F5F5',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2A2A44',
  },
  synopsisInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  genreSelector: {
    backgroundColor: '#1E1E32',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2A2A44',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  genreSelected: {
    color: '#F5F5F5',
    fontSize: 15,
  },
  genrePlaceholder: {
    color: '#555577',
    fontSize: 15,
  },
  genreArrow: {
    color: '#8888AA',
    fontSize: 12,
  },
  genrePicker: {
    backgroundColor: '#1E1E32',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2A2A44',
    marginTop: 4,
    maxHeight: 200,
  },
  genreList: {
    padding: 8,
  },
  genreOption: {
    padding: 12,
    borderRadius: 8,
  },
  genreOptionSelected: {
    backgroundColor: '#2A2A44',
  },
  genreOptionText: {
    color: '#8888AA',
    fontSize: 15,
  },
  genreOptionTextSelected: {
    color: '#E8A838',
    fontWeight: '600',
  },
  generateButton: {
    backgroundColor: '#E8A838',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    color: '#0F0F1A',
    fontSize: 17,
    fontWeight: 'bold',
  },
  upgradePrompt: {
    backgroundColor: '#1E1E32',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8A838',
  },
  upgradePromptText: {
    color: '#E8A838',
    fontSize: 13,
  },
  resultsSection: {
    marginTop: 8,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F5F5F5',
    marginBottom: 16,
  },
  blurbCard: {
    backgroundColor: '#1E1E32',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2A44',
  },
  blurbCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  blurbHook: {
    color: '#E8A838',
    fontSize: 14,
    fontWeight: '600',
  },
  copyButton: {
    backgroundColor: '#2A2A44',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  copyButtonSuccess: {
    backgroundColor: '#14F195',
  },
  copyButtonText: {
    color: '#F5F5F5',
    fontSize: 13,
    fontWeight: '600',
  },
  blurbText: {
    color: '#F5F5F5',
    fontSize: 15,
    lineHeight: 24,
  },
  backButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  backButtonText: {
    color: '#8888AA',
    fontSize: 16,
  },
});