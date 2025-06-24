// LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform
} from 'react-native';
import { useNavigation, StackNavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './index';
import axios from 'axios'; // axios 임포트

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

// 백엔드 서버의 URL (개발 환경에 따라 변경 필요)
const API_BASE_URL = Platform.OS === 'web' ? 'http://localhost:3000' : 'http://0.0.0.0.0:3000';
// YOUR_LOCAL_IP_ADDRESS는 개발 PC의 내부 IP 주소 (예: 192.168.0.100)로 바꿔야 합니다.

export default function LoginScreen(): React.JSX.Element {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleLogin = async () => {
    setError('');

    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password
      });

      if (response.status === 200) {
        // 로그인 성공 시 (여기서 서버가 JWT 등을 반환한다면 저장)
        if (Platform.OS === 'web') {
          window.alert('로그인 성공!');
          // localStorage.setItem('userToken', response.data.token); // 예시: 토큰 저장
        } else {
          Alert.alert('로그인 성공', '환영합니다!', [{ text: '확인' }]);
          // AsyncStorage.setItem('userToken', response.data.token); // 예시: 토큰 저장
        }
        navigation.navigate('Home');
      }
    } catch (err) {
      console.error('로그인 요청 오류:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || '로그인에 실패했습니다.');
      } else {
        setError('네트워크 오류 또는 서버 응답이 없습니다.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="이메일 주소"
        placeholderTextColor="#A9A9A9"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        placeholderTextColor="#A9A9A9"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerLink}>계정이 없으신가요? 회원가입</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F8FF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4682B4',
    marginBottom: 30,
  },
  input: {
    width: '90%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderColor: '#ADD8E6',
    borderWidth: 1,
    fontSize: 16,
    color: '#333333',
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 20,
    color: '#4682B4',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
});
