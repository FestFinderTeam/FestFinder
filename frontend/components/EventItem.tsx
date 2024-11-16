import React from 'react';
import { Pressable, ImageBackground, Text, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';

const EventItem = ({ item }: { item: any }) => {
  const handlePress = () => {
    router.push(`/eventos/${item.id_evento}`);
  };

  return (
    <Pressable onPress={handlePress} style={styles.container} key={item.id_evento}>
      <ImageBackground
        source={
          item.logo
            ? { uri: item.logo }
            : require("@/assets/images/default.jpg")
        }
        style={styles.imageBackground}
      >
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {new Date(item.fecha_inicio).toLocaleDateString('es-ES', {
              day: 'numeric',
            })}
          </Text>
          <Text style={styles.monthText}>
            {new Date(item.fecha_inicio).toLocaleDateString('es-ES', {
              month: 'short',
            })}
          </Text>
        </View>
      </ImageBackground>
      <Text style={styles.genreText} numberOfLines={2}>
        {item.id_genero_fk_detail.titulo_genero}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    borderRadius: 150,
    marginTop: '2%',
    marginRight: 10,
  },
  imageBackground: {
    height: 200,
    width: 150,
    borderRadius: 150,
    alignItems: 'flex-end',
  },
  dateContainer: {
    backgroundColor: 'white',
    width: '35%',
    alignItems: 'center',
    padding: 3,
    borderRadius: 10,
    marginTop: 5,
    marginRight: 5,
  },
  dateText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  monthText: {
    fontSize: 12,
  },
  genreText: {
    fontFamily: 'Poppins-Regular',
    width: 150,
    textAlign: 'center',
  },
});

export default EventItem;
