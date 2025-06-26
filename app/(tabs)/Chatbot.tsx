import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
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

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // TODO: 챗봇 API 호출 후 답변 받기 (아래는 예시)
    setTimeout(() => {
      const botReply: Message = {
        id: (Date.now() + 1).toString(),
        text: '답변 준비 중입니다. 잠시만 기다려주세요.',
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botReply]);
    }, 1000);
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.botBubble]}>
      <Text style={item.sender === 'user' ? styles.userMessageText : styles.botMessageText}>
        {item.text}
      </Text>
    </View>
  );

  const handleBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backButton}>← 뒤로가기</Text>
        </TouchableOpacity>
        <Text style={styles.title}>의료진 상담 챗봇</Text>
        <View style={{ width: 70 }} /> {/* 균형용 빈 공간 */}
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatArea}
        inverted // 최신 메시지가 아래로 오도록 뒤집기
      />

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="메시지를 입력하세요"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>전송</Text>
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
