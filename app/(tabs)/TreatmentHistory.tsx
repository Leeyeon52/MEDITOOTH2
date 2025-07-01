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

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${year}.${month}.${day}`;
  };

  const renderItem = ({ item }: { item: { id: string; date: string; description: string } }) => (
    <View style={styles.recordItem}>
      <Text style={styles.date}>{formatDate(item.date)}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← 뒤로가기</Text>
        </TouchableOpacity>
        <Text style={styles.title}>치료 기록 확인</Text>
        <View style={{ width: 70 }} /> {/* 균형 맞춤용 */}
      </View>

      {treatmentData.length > 0 ? (
        <FlatList
          data={treatmentData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>등록된 치료 기록이 없습니다.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 20,
    paddingTop: 20,
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4682B4',
  },
  listContainer: {
    paddingBottom: 30,
  },
  recordItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  separator: {
    height: 12,
  },
  date: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    color: '#333',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
