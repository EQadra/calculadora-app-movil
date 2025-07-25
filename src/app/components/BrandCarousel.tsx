import React, { useRef, useEffect, useState } from "react";
import {
  ScrollView,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
  Text,
} from "react-native";

export default function BrandCarousel(): JSX.Element {
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = useRef(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const brandImages = [
    "https://picsum.photos/seed/1/100",
    "https://picsum.photos/seed/2/100",
    "https://picsum.photos/seed/3/100",
    "https://picsum.photos/seed/4/100",
    "https://picsum.photos/seed/5/100",
    "https://picsum.photos/seed/6/100",
    "https://picsum.photos/seed/7/100",
    "https://picsum.photos/seed/8/100",
    "https://picsum.photos/seed/9/100",
    "https://picsum.photos/seed/10/100",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      scrollX.current += 110;
      const maxScroll = brandImages.length * 110;
      if (scrollX.current > maxScroll) {
        scrollX.current = 0;
      }
      scrollRef.current.scrollTo({ x: scrollX.current, animated: true });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const openImageModal = (uri: string) => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      >
        {brandImages.map((uri, index) => (
          <TouchableOpacity key={index} onPress={() => openImageModal(uri)}>
            <Image source={{ uri }} style={styles.image} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.modalContent}>
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.fullImage} />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  image: {
    width: 30,
    height: 30,
    borderRadius: 1,
    marginRight: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    maxWidth: width * 0.9,
    maxHeight: height * 0.9,
  },
  fullImage: {
    width: width * 0.8,
    height: width * 0.8,
    resizeMode: "contain",
    borderRadius: 8,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#ffffff33",
    borderRadius: 20,
    padding: 10,
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
});
