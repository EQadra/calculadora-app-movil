import React, { useRef, useEffect } from "react";
import { ScrollView, Image, View, StyleSheet } from "react-native";

export default function BrandCarousel(): JSX.Element {
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = useRef(0);

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

  return (
    <View style={{ marginBottom: 16 }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      >
        {brandImages.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.image} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 30,
    height: 30,
    borderRadius: 1,
    marginRight: 5,
  },
});
