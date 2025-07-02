import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation, StackNavigationProp } from '@react-navigation/native';
import axios from 'axios';
import { RootStackParamList } from './index';

type RegistrationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const API_BASE_URL =
  Platform.OS === 'web'
    ? 'http://localhost:8000'  // 웹에서는 localhost 사용
    : Platform.OS === 'android'
    ? 'http://10.0.2.2:8000'   // Android 에뮬레이터에서는 10.0.2.2 사용
    : 'http://192.168.0.2:8000'

export default function RegistrationScreen(): React.JSX.Element {
  const navigation = useNavigation<RegistrationScreenNavigationProp>();
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [error, setError] = useState('');

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleRegister = async () => {
    setError('');

    const { email, password, confirmPassword, name } = form;

    // 유효성 검사
    if (!email || !password || !confirmPassword || !name) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        email,
        password,
        name,
      });

      if (response.status === 201) {
        Platform.OS === 'web'
          ? window.alert('회원가입 성공! 이제 로그인할 수 있습니다.')
          : Alert.alert('회원가입 성공', '이제 로그인할 수 있습니다.');

        navigation.navigate('Login');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(err.response.data.message || '회원가입에 실패했습니다.');
        } else if (err.request) {
          setError('서버 응답이 없습니다. 네트워크 상태를 확인해주세요.');
        } else {
          setError('요청 중 문제가 발생했습니다.');
        }
      } else {
        setError('예상치 못한 오류가 발생했습니다.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>
      {error !== '' && <Text style={styles.errorText}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="이메일 주소"
        placeholderTextColor="#A9A9A9"
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={(text) => handleChange('email', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호 (최소 6자)"
        placeholderTextColor="#A9A9A9"
        secureTextEntry
        value={form.password}
        onChangeText={(text) => handleChange('password', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호 확인"
        placeholderTextColor="#A9A9A9"
        secureTextEntry
        value={form.confirmPassword}
        onChangeText={(text) => handleChange('confirmPassword', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="이름 (비식별화 저장)"
        placeholderTextColor="#A9A9A9"
        value={form.name}
        onChangeText={(text) => handleChange('name', text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>이미 계정이 있으신가요? 로그인</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4682B4',
    marginBottom: 25,
  },
  input: {
    width: '90%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderColor: '#ADD8E6',
    borderWidth: 1,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  button: {
    width: '90%',
    height: 50,
    backgroundColor: '#4682B4',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 20,
    fontSize: 15,
    color: '#4682B4',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
});
