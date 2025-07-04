import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useProducts } from '../../../context/ProductContext';
import * as ImagePicker from 'expo-image-picker';

const ProductScreen: React.FC = () => {
  const { products, fetchAll, create, update, remove } = useProducts();

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    metal_type: '',
    grams: '',
    purity: '',
    price_per_gram: '',
    image: null as null | any,
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const openCreate = () => {
    resetForm();
    setEditMode(false);
    setShowModal(true);
  };

  const edit = (product: any) => {
    setForm({
      name: product.name,
      metal_type: product.metal_type,
      grams: product.grams.toString(),
      purity: product.purity?.toString() ?? '',
      price_per_gram: product.price_per_gram.toString(),
      image: null,
    });
    setPreview(product.image_path ? getImageUrl(product.image_path) : null);
    setSelectedId(product.id);
    setEditMode(true);
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({
      name: '',
      metal_type: '',
      grams: '',
      purity: '',
      price_per_gram: '',
      image: null,
    });
    setPreview(null);
    setSelectedId(null);
  };

  const getImageUrl = (path: string) => `/storage/${path}`;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const file = result.assets[0];
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(file.uri);
    }
  };

  const handleSubmit = async () => {
    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        if (key === 'image' && value.uri) {
          fd.append('image', {
            uri: value.uri,
            type: 'image/jpeg',
            name: 'product.jpg',
          } as any);
        } else {
          fd.append(key, value);
        }
      }
    });

    if (editMode && selectedId) {
      await update(selectedId, fd);
    } else {
      await create(fd);
    }
    setShowModal(false);
    resetForm();
  };

  const handleDelete = async (id: number) => {
    Alert.alert('Confirmar', '¿Eliminar producto?', [
      { text: 'Cancelar' },
      { text: 'Eliminar', onPress: () => remove(id) },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gestión de Productos</Text>
      <Button title="Agregar producto" onPress={openCreate} />

      {products.map((product) => (
        <View key={product.id} style={styles.card}>
          {product.image_path && (
            <Image
              source={{ uri: getImageUrl(product.image_path) }}
              style={styles.image}
            />
          )}
          <Text style={styles.name}>{product.name}</Text>
          <Text>Metal: {product.metal_type}</Text>
          <Text>Gramos: {product.grams}</Text>
          <Text>Pureza: {product.purity ?? '—'}%</Text>
          <Text style={styles.price}>Precio x gr: ${product.price_per_gram}</Text>

          <View style={styles.actions}>
            <TouchableOpacity onPress={() => edit(product)}>
              <Text style={styles.edit}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(product.id)}>
              <Text style={styles.delete}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <Modal visible={showModal} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {editMode ? 'Editar producto' : 'Crear producto'}
          </Text>
          <TextInput
            placeholder="Nombre"
            value={form.name}
            onChangeText={(v) => setForm({ ...form, name: v })}
            style={styles.input}
          />
          <TextInput
            placeholder="Metal (oro/plata)"
            value={form.metal_type}
            onChangeText={(v) => setForm({ ...form, metal_type: v })}
            style={styles.input}
          />
          <TextInput
            placeholder="Gramos"
            keyboardType="numeric"
            value={form.grams}
            onChangeText={(v) => setForm({ ...form, grams: v })}
            style={styles.input}
          />
          <TextInput
            placeholder="Pureza (%)"
            keyboardType="numeric"
            value={form.purity}
            onChangeText={(v) => setForm({ ...form, purity: v })}
            style={styles.input}
          />
          <TextInput
            placeholder="Precio x gr"
            keyboardType="numeric"
            value={form.price_per_gram}
            onChangeText={(v) => setForm({ ...form, price_per_gram: v })}
            style={styles.input}
          />

          <Button title="Seleccionar imagen" onPress={pickImage} />
          {preview && (
            <Image source={{ uri: preview }} style={styles.preview} />
          )}

          <Button title={editMode ? 'Actualizar' : 'Crear'} onPress={handleSubmit} />
          <Button title="Cancelar" color="#888" onPress={() => setShowModal(false)} />
        </ScrollView>
      </Modal>
    </ScrollView>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 4,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  price: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  edit: {
    color: '#2563eb',
  },
  delete: {
    color: '#dc2626',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  modalContainer: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  preview: {
    width: 160,
    height: 160,
    marginTop: 10,
    borderRadius: 8,
  },
});
