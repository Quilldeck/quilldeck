import { useRouter } from 'expo-router'
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native'

const appStyles = {
  screen: { flex: 1, backgroundColor: '#0F0F1A' },
  stack: { flex: 1, padding: 24, justifyContent: 'center' as const },
  title: { fontSize: 32, fontWeight: 'bold' as const, color: '#E8AB38', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#8888AA', marginBottom: 40 },
}

export default function HomeScreen() {
  const router = useRouter()
  return (
    <SafeAreaView style={appStyles.screen}>
      <View style={appStyles.stack}>
        <Text style={appStyles.title}>Quilldeck</Text>
        <Text style={appStyles.subtitle}>Publish Smarter. Market Faster.</Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push('/blurb-generator')}
        >
          <Text style={styles.btnText}>✨ AI Blurb Generator</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnHero]}
          onPress={() => router.push('/go-market')}
        >
          <Text style={styles.btnText}>⚡ Go Market This</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#1E1E32',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2A44',
  },
  btnHero: {
    backgroundColor: '#E8AB38',
  },
  btnText: {
    color: '#F5F5F5',
    fontWeight: 'bold',
    fontSize: 17,
  },
})