import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function EditProfile(): React.JSX.Element {
  const navigation = useNavigation();
  const [name, setName] = useState('홍길동');
  const [email, setEmail] = useState('hong@example.com');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const API_BASE_URL =
  Platform.OS === 'web'
    ? 'http://localhost:8000'  // 웹에서는 localhost 사용
    : Platform.OS === 'android'
    ? 'http://10.0.2.2:8000'   // Android 에뮬레이터에서는 10.0.2.2 사용
    : 'http://192.168.0.2:8000'

  // ✅ 이름 저장 처리
  const handleSave = async () => {
  try {
    const response = await axios.put(`${API_BASE_URL}/user/update`, {
      email,
      name,
    });

    if (response.status === 200) {
      Alert.alert('저장 완료', '이름이 성공적으로 수정되었습니다.');
      navigation.goBack(); // 돌아가기
    } else {
      Alert.alert('에러', '이름 저장에 실패했습니다.');
    }
  } catch (error) {
    console.error('이름 저장 실패:', error);
    Alert.alert('에러', '서버 오류로 저장에 실패했습니다.');
  }
};


  // ✅ 비밀번호 변경 처리
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('오류', '새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/user/change-password`, {
        email,
        current_password: currentPassword,
        new_password: newPassword,
      });

      if (response.status === 200) {
        Alert.alert('변경 완료', '비밀번호가 성공적으로 변경되었습니다.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        Alert.alert('에러', '비밀번호 변경 실패');
      }
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      Alert.alert('에러', '서버 오류로 비밀번호 변경에 실패했습니다.');
    }
  };

  // ✅ 회원 탈퇴 처리
  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/user/delete`, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: { email },
      });

      if (response.status === 200) {
        Alert.alert('회원 탈퇴 완료', '계정이 성공적으로 삭제되었습니다.');
        navigation.reset({ index: 0, routes: [{ name: 'LoginScreen' }] });
      } else {
        Alert.alert('에러', '회원 탈퇴에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원 탈퇴 실패:', error);
      Alert.alert('에러', '서버와의 통신에 실패했습니다.');
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
        editable={false}  // 이메일은 수정 불가
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

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() =>
          Alert.alert(
            '회원 탈퇴 확인',
            '정말로 회원 탈퇴를 진행하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
            [
              { text: '취소', style: 'cancel' },
              { text: '확인', style: 'destructive', onPress: handleDeleteAccount },
            ]
          )
        }
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
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#4682B4',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  passwordButton: {
    backgroundColor: '#556B2F',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#B22222',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  goBack: { marginTop: 30, textAlign: 'center', color: '#4682B4', fontSize: 16 },
});
