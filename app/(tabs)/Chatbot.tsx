import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
};

export default function Chatbot() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: '안녕하세요! 무엇을 도와드릴까요?', sender: 'bot' },
  ]);
  const [inputText, setInputText] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const scrollToBottom = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!inputText.trim() || isWaiting) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
    };

    setMessages((prev) => [userMessage, ...prev]);
    setInputText('');
    setIsWaiting(true);

    // 가상 로딩 메시지 추가
    const loadingId = (Date.now() + 1).toString();
    const loadingMessage: Message = {
      id: loadingId,
      text: '답변을 생성 중입니다...',
      sender: 'bot',
    };
    setMessages((prev) => [loadingMessage, ...prev]);

    // 실제 응답 예시
    setTimeout(() => {
      // 로딩 메시지 제거 후 실제 답변 추가
      setMessages((prev) =>
        [
          {
            id: (Date.now() + 2).toString(),
            text: 'AI 챗봇입니다. 현재 기능은 데모용이며, 의료진의 실제 상담과는 다를 수 있습니다.',
            sender: 'bot',
          },
          ...prev.filter((msg) => msg.id !== loadingId),
        ]
      );
      setIsWaiting(false);
    }, 1500);
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.botBubble,
      ]}
    >
      <Text
        style={
          item.sender === 'user' ? styles.userMessageText : styles.botMessageText
        }
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← 뒤로가기</Text>
        </TouchableOpacity>
        <Text style={styles.title}>의료진 상담 챗봇</Text>
        <View style={{ width: 70 }} /> {/* 균형 맞춤용 */}
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatArea}
        inverted
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="메시지를 입력하세요"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
          editable={!isWaiting}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={isWaiting}>
          <Text style={styles.sendButtonText}>{isWaiting ? '...' : '전송'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F8FF', padding: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  backButton: {
    fontSize: 16,
    color: '#4682B4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4682B4',
  },
  chatArea: { paddingBottom: 10 },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 15,
    marginVertical: 6,
  },
  userBubble: {
    backgroundColor: '#4682B4',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  botBubble: {
    backgroundColor: '#D0E8FF',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  userMessageText: {
    color: '#fff',
    fontSize: 16,
  },
  botMessageText: {
    color: '#000',
    fontSize: 16,
  },
  inputArea: {
    flexDirection: 'row',
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    height: 44,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4682B4',
    borderRadius: 20,
    paddingHorizontal: 20,
    marginLeft: 10,
    height: 44,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
