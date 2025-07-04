// components/TransactionList.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { useTransactions } from '../../../context/TransactionContext';

const Transactionscreen: React.FC = () => {
  const { transactions, deleteTransaction } = useTransactions();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transacciones (Estáticas)</Text>
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
            <Button title="Eliminar" color="red" onPress={() => deleteTransaction(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

export default Transactionscreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
  },
});
