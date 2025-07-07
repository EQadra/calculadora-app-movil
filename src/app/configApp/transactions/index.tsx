import React from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTransactions } from '../../../context/TransactionContext';

const TransactionScreen: React.FC = () => {
  const { transactions, deleteTransaction } = useTransactions();

  return (
    <LinearGradient
      colors={['#1e3a8a', '#2563eb']}
      style={styles.gradientContainer}
    >
      <View style={styles.container}>
        <LinearGradient
          colors={['#facc15', '#fbbf24']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.titleGradient}
        >
          <Text style={styles.title}>Transacciones (Estáticas)</Text>
        </LinearGradient>

        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.text}>Tipo: {item.type}</Text>
              <Text style={styles.text}>Metal: {item.metal_type}</Text>
              <Text style={styles.text}>Gramos: {item.grams}</Text>
              <Text style={styles.text}>Precio x gr: S/{item.price_per_gram}</Text>
              <Text style={styles.text}>Total PEN: S/{item.total_pen}</Text>
              <Text style={styles.text}>Total USD: ${item.total_usd}</Text>
              <Button title="Eliminar" color="#dc2626" onPress={() => deleteTransaction(item.id)} />
            </View>
          )}
        />
      </View>
    </LinearGradient>
  );
};

export default TransactionScreen;

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    padding: 16,
    flex: 1,
  },
  titleGradient: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
  },
});
