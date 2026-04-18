import React from 'react'
import { Text, View, SafeAreaView, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { appStyles } from '@/constants/app-styles'
import { COLORS } from '@/constants/app-styles'

export default function HomeScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={appStyles.screen}>
      <View style={appStyles.stack}>
        <Text style={appStyles.title}>Quilldeck</Text>
        <Text style={appStyles.subtitle}>Publish Smarter. Market Faster.</Text>
        <TouchableOpacity
          style={{ backgroundColor: '#E8A838', padding: 16, borderRadius: 12, marginTop: 32 }}
          onPress={() => router.push('/blurb-generator')}
        >
          <Text style={{ color: '#0F0F1A', fontWeight: 'bold', textAlign: 'center', fontSize: 16 }}>
            ✨ AI Blurb Generator
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}