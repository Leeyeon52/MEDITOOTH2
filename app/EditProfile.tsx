// EditProfile.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function EditProfile(): React.JSX.Element {
  const navigation = useNavigation();

  const [name, setName] = useState('홍길동');
  const [email, setEmail] = useState('hong@example.com');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
    // 실제 저장 API 호출
    Alert.alert('저장 완료', '개인정보가 수정되었습니다.');
    navigation.goBack();
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('오류', '새 비밀번호가 일치하지 않습니다.');
      return;
    }

    // 실제 비밀번호 변경 API 호출
    Alert.alert('변경 완료', '비밀번호가 변경되었습니다.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
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
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  goBack: { marginTop: 30, textAlign: 'center', color: '#4682B4', fontSize: 16 },
});
