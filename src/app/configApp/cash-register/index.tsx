import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useCashRegister } from '../../../context/CashRegisterContext';

const CashRegisterScreen: React.FC = () => {
  const {
    cashRegister,
    loading,
    fetchToday,
    openCash,
    closeCash,
  } = useCashRegister();

  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);

  const [form, setForm] = useState({
    opening_cash: '',
    opening_gold: '',
    opening_silver: '',
    closing_cash: '',
    closing_gold: '',
    closing_silver: '',
  });

  useEffect(() => {
    fetchToday();
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpen = async () => {
    try {
      await openCash({
        opening_cash: parseFloat(form.opening_cash),
        opening_gold: parseFloat(form.opening_gold),
        opening_silver: parseFloat(form.opening_silver),
      });
      setShowOpenModal(false);
    } catch (e: any) {
      Alert.alert('Error', e);
    }
  };

  const handleClose = async () => {
    try {
      await closeCash({
        closing_cash: parseFloat(form.closing_cash),
        closing_gold: parseFloat(form.closing_gold),
        closing_silver: parseFloat(form.closing_silver),
      });
      setShowCloseModal(false);
    } catch (e: any) {
      Alert.alert('Error', e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Caja del día</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : !cashRegister ? (
        <>
          <Text>No hay caja abierta hoy.</Text>
          <Button title="Abrir caja" onPress={() => setShowOpenModal(true)} />
        </>
      ) : (
        <View style={styles.infoBox}>
          <Text>📅 <Text style={styles.bold}>Fecha:</Text> {cashRegister.date}</Text>
          <Text>💵 <Text style={styles.bold}>Inicio efectivo:</Text> ${cashRegister.opening_cash}</Text>
          <Text>🥇 <Text style={styles.bold}>Inicio oro:</Text> {cashRegister.opening_gold}g</Text>
          <Text>🥈 <Text style={styles.bold}>Inicio plata:</Text> {cashRegister.opening_silver}g</Text>
          {cashRegister.closing_cash !== null ? (
            <Text>✅ <Text style={styles.bold}>Cierre efectivo:</Text> ${cashRegister.closing_cash}</Text>
          ) : (
            <Text style={styles.textDanger}>⚠️ Caja aún no cerrada.</Text>
          )}
          {cashRegister.closing_cash === null && (
            <Button
              title="Cerrar caja"
              color="#f59e0b"
              onPress={() => setShowCloseModal(true)}
            />
          )}
        </View>
      )}

      {/* Modal Abrir Caja */}
      <Modal visible={showOpenModal} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={() => setShowOpenModal(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Abrir Caja</Text>
          <TextInput
            placeholder="Efectivo inicial"
            keyboardType="numeric"
            style={styles.input}
            value={form.opening_cash}
            onChangeText={(v) => handleChange('opening_cash', v)}
          />
          <TextInput
            placeholder="Oro inicial (g)"
            keyboardType="numeric"
            style={styles.input}
            value={form.opening_gold}
            onChangeText={(v) => handleChange('opening_gold', v)}
          />
          <TextInput
            placeholder="Plata inicial (g)"
            keyboardType="numeric"
            style={styles.input}
            value={form.opening_silver}
            onChangeText={(v) => handleChange('opening_silver', v)}
          />
          <Button title="Abrir" onPress={handleOpen} />
          <Button title="Cancelar" color="#888" onPress={() => setShowOpenModal(false)} />
        </View>
      </Modal>

      {/* Modal Cerrar Caja */}
      <Modal visible={showCloseModal} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={() => setShowCloseModal(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Cerrar Caja</Text>
          <TextInput
            placeholder="Efectivo final"
            keyboardType="numeric"
            style={styles.input}
            value={form.closing_cash}
            onChangeText={(v) => handleChange('closing_cash', v)}
          />
          <TextInput
            placeholder="Oro final (g)"
            keyboardType="numeric"
            style={styles.input}
            value={form.closing_gold}
            onChangeText={(v) => handleChange('closing_gold', v)}
          />
          <TextInput
            placeholder="Plata final (g)"
            keyboardType="numeric"
            style={styles.input}
            value={form.closing_silver}
            onChangeText={(v) => handleChange('closing_silver', v)}
          />
          <Button title="Cerrar" onPress={handleClose} />
          <Button title="Cancelar" color="#888" onPress={() => setShowCloseModal(false)} />
        </View>
      </Modal>
    </ScrollView>
  );
};

export default CashRegisterScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    maxWidth: 500,
    alignSelf: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  noData: {
    marginBottom: 10,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#f3f4f6',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    gap: 8,
  },
  label: {
    fontWeight: 'bold',
  },
  textDanger: {
    color: '#ef4444',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  modal: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    right: '10%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  bold: {
    fontWeight: 'bold',
    color: '#0f172a',
  },
  
});
