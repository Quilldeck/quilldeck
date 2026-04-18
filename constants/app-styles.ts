import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#0F0F1A',
  primaryLight: '#1A1A2E',
  accent: '#E8A838',
  accentLight: '#F0C060',
  teal: '#14B8A6',
  purple: '#7C3AED',
  background: '#0F0F1A',
  surface: '#1E1E32',
  surfaceLight: '#2A2A44',
  text: '#F5F5F5',
  textMuted: '#8888AA',
  success: '#4CAF50',
  error: '#EF5350',
  solana: '#9945FF',
  solanaTeal: '#14F195',
};

export const appStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surfaceLight,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    padding: 16,
  },
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    gap: 16,
    paddingHorizontal: 16,
  },
  stack: {
    gap: 8,
  },
  subtitle: {
      fontSize: 16,
      color: COLORS.textMuted,
    },
    title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});
