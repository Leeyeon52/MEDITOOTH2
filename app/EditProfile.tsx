import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function EditProfile(): React.JSX.Element {
  const navigation = useNavigation();

  const [name, setName] = useState('홍길동');
  const [email, setEmail] = useState('hong@example.com');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 플랫폼에 따라 API 주소 분기
  const API_BASE_URL = Platform.OS === 'web'
    ? 'http://localhost:8000'
    : 'http://192.168.0.10:8000';

  const handleSave = () => {
    Alert.alert('저장 완료', '개인정보가 수정되었습니다.');
    navigation.goBack();
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('오류', '새 비밀번호가 일치하지 않습니다.');
      return;
    }
    Alert.alert('변경 완료', '비밀번호가 변경되었습니다.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // --- 회원 탈퇴 함수 수정 ---
  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), // 이메일을 요청 바디에 전달
      });

      if (response.ok) {
        Alert.alert('회원 탈퇴 완료', '회원 탈퇴가 성공적으로 처리되었습니다.');
        // 로그아웃 처리 및 로그인 화면으로 이동
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        });
      } else {
        const data = await response.json();
        Alert.alert('오류', data.detail || '회원 탈퇴 실패');
      }
    } catch (error) {
      Alert.alert('오류', '서버와 통신 중 문제가 발생했습니다.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>개인정보 수정</Text>

      <TextInput
        style={styles.input}
        placeholder="이름"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={email}
        editable={false}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>저장</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>비밀번호 변경</Text>

      <TextInput
        style={styles.input}
        placeholder="현재 비밀번호"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="새 비밀번호"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="새 비밀번호 확인"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.passwordButton} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>비밀번호 변경</Text>
      </TouchableOpacity>

      {/* 회원 탈퇴 버튼 */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          Alert.alert(
            '회원 탈퇴 확인',
            '정말로 회원 탈퇴를 진행하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
            [
              { text: '취소', style: 'cancel' },
              { text: '확인', style: 'destructive', onPress: handleDeleteAccount },
            ],
          );
        }}
      >
        <Text style={styles.buttonText}>회원 탈퇴</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.goBack}>← 돌아가기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#4682B4' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 30, color: '#333' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#4682B4', padding: 14, borderRadius: 8, alignItems: 'center',
  },
  passwordButton: {
    backgroundColor: '#556B2F', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#B22222', // 진한 빨간색
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  goBack: { marginTop: 30, textAlign: 'center', color: '#4682B4', fontSize: 16 },
});
