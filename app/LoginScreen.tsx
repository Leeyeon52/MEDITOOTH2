import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { RootStackParamList } from './index';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const API_BASE_URL = Platform.OS === 'web'
  ? 'http://localhost:3000'
  : 'http://172.22.240.1:3000';

export default function LoginScreen(): React.JSX.Element {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);

  const handleLogin = async () => {
    setError('');

    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/login`, { email, password });

      if (res.status === 200) {
        if (Platform.OS === 'web') {
          window.alert('로그인 성공!');
          // 웹에서 화면 전환 시 navigation.reset 사용 (히스토리 초기화)
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        } else {
          Alert.alert('로그인 성공', '환영합니다!', [
            {
              text: '확인',
              onPress: () => navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              }),
            },
          ]);
        }
      } else {
        setError(`로그인 실패: 상태 코드 ${res.status}`);
      }
    } catch (err) {
      console.error('로그인 요청 오류:', err);

      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(err.response.data?.message || '아이디 또는 비밀번호를 확인해주세요.');
        } else if (err.request) {
          setError('서버 응답이 없습니다. 네트워크 상태를 확인해주세요.');
        } else {
          setError('요청 처리 중 문제가 발생했습니다.');
        }
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>로그인</Text>

      {error !== '' && <Text style={styles.errorText}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="이메일 주소"
        placeholderTextColor="#A9A9A9"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="비밀번호"
          placeholderTextColor="#A9A9A9"
          secureTextEntry={secureEntry}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setSecureEntry(!secureEntry)}>
          <Text style={styles.toggleText}>
            {secureEntry ? '보기' : '숨김'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerLink}>계정이 없으신가요? 회원가입</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  passwordContainer: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    marginBottom: 10,
  },
  toggleText: {
    marginLeft: 10,
    color: '#4682B4',
    fontWeight: 'bold',
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