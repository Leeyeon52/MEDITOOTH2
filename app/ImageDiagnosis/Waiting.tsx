// app/ImageDiagnosis/Waiting.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

export default function DiagnosisWaitingScreen() {
  const router = useRouter();

  useEffect(() => {
    // 3초 후 결과 화면으로 자동 전환 (시뮬레이션)
    const timer = setTimeout(() => {
      router.push('/ImageDiagnosis/Result');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI가 구강 상태를 분석 중입니다...</Text>
      <ActivityIndicator size="large" color="#4682B4" style={{ marginVertical: 30 }} />
      <Text style={styles.subText}>예상 대기 시간: 약 3초</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    color: '#666',
  },
});
