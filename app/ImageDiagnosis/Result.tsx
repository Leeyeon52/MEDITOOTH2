import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Switch, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function DiagnosisResultScreen() {
  const router = useRouter();
  const [overlayEnabled, setOverlayEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    Alert.alert('저장 완료', '진단 결과가 저장되었습니다.\n마이페이지에서 다시 확인할 수 있습니다.');
  };

  const handleRequestRemote = () => {
    Alert.alert(
      '비대면 진단 요청 완료',
      '비대면 진단 요청이 의사에게 전달되었습니다.\n답변이 오면 알림으로 알려드릴게요.'
    );
    router.push('/RemoteDiagnosisResult');
  };

  // 네트워크 연결 시 사용 가능한 예시 이미지 URL
  const overlayImageUri = 'https://dummyimage.com/300x250/4682b4/ffffff&text=Overlay+Image';
  const originalImageUri = 'https://dummyimage.com/300x250/808080/ffffff&text=Original+Image';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI 진단 결과</Text>

      <View style={styles.imageBox}>
        <Image
          source={{ uri: overlayEnabled ? overlayImageUri : originalImageUri }}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.overlayToggle}>
          <Text style={styles.overlayLabel}>병변 오버레이 보기</Text>
          <Switch
            value={overlayEnabled}
            onValueChange={setOverlayEnabled}
            thumbColor={overlayEnabled ? '#4682B4' : '#ccc'}
            trackColor={{ false: '#ddd', true: '#A2C5E8' }}
          />
        </View>
      </View>

      <Text style={styles.resultSummary}>
        🦷 분석 결과: 충치 의심 부위가 2곳 감지되었습니다.{'\n'}
        더 정확한 진단을 원하시면 비대면 진료를 요청해 보세요.
      </Text>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saved}>
        <Text style={styles.saveButtonText}>{saved ? '✅ 저장 완료' : '📥 결과 저장'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.remoteButton} onPress={handleRequestRemote}>
        <Text style={styles.remoteButtonText}>🩺 비대면 진단 신청</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    padding: 20,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  overlayToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  overlayLabel: {
    fontSize: 14,
    color: '#333',
    marginRight: 10,
  },
  resultSummary: {
    fontSize: 16,
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 24,
  },
  saveButton: {
    backgroundColor: '#4682B4',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  remoteButton: {
    backgroundColor: '#6FAF98',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  remoteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
