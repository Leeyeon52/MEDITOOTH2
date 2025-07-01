// app/ImageDiagnosis/Input.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function ImageDiagnosisInput() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [likertValue, setLikertValue] = useState<number>(3);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  // 사진 선택 함수 (갤러리 또는 카메라)
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('권한 필요', '사진을 업로드하려면 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // 진단 요청 버튼 클릭 시 (임시 시뮬레이션)
  const handleSubmit = () => {
    if (!imageUri) {
      Alert.alert('사진 선택 필요', '구강 사진을 업로드해 주세요.');
      return;
    }
    setLoading(true);

    // 실제 API 요청 코드 대신 시뮬레이션
    setTimeout(() => {
      setLoading(false);
      Alert.alert('진단 요청 접수', 'AI가 구강 상태를 분석 중입니다.');
      router.push('/ImageDiagnosis/Waiting');
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>구강 사진/영상 업로드</Text>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imagePlaceholder}>사진 선택 또는 촬영</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>문진 (리커트 척도): {likertValue}</Text>
      <View style={styles.likertRow}>
        {[1, 2, 3, 4, 5].map((v) => (
          <TouchableOpacity key={v} onPress={() => setLikertValue(v)} style={[styles.likertCircle, likertValue === v && styles.likertSelected]}>
            <Text style={likertValue === v ? styles.likertTextSelected : styles.likertText}>{v}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>코멘트</Text>
      <TextInput
        style={styles.commentInput}
        multiline
        placeholder="진단에 도움이 될 내용을 입력해 주세요."
        value={comment}
        onChangeText={setComment}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>진단 요청</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F8FF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#4682B4',
  },
  imagePicker: {
    backgroundColor: '#DDEEFF',
    height: 200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ADD8E6',
  },
  imagePlaceholder: {
    color: '#999',
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  likertRow: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  likertCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4682B4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  likertSelected: {
    backgroundColor: '#4682B4',
  },
  likertText: {
    color: '#4682B4',
    fontWeight: 'bold',
  },
  likertTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  commentInput: {
    height: 80,
    backgroundColor: '#fff',
    borderColor: '#ADD8E6',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    textAlignVertical: 'top',
    marginBottom: 30,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#4682B4',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
