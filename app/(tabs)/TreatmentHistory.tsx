import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

// 샘플 진료 기록 데이터
const treatmentData = [
  { id: '1', date: '2025-05-20', description: '충치 치료' },
  { id: '2', date: '2025-06-10', description: '스케일링' },
  { id: '3', date: '2025-06-15', description: '임플란트 상담' },
];

export default function TreatmentHistory(): React.JSX.Element {
  const router = useRouter();

  // 각 진료 기록을 렌더링하는 함수
  const renderItem = ({ item }: { item: { id: string; date: string; description: string } }) => (
    <View style={styles.recordItem}>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  // 뒤로가기 버튼 처리
  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backButton}>← 뒤로가기</Text>
        </TouchableOpacity>
        <Text style={styles.title}>치료 기록 확인</Text>
        <View style={{ width: 70 }} /> {/* 균형을 위한 공백 */}
      </View>

      {/* 진료 기록 목록 */}
      <FlatList
        data={treatmentData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  recordItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: '#333',
  },
});
