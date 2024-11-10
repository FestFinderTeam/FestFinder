import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6200EE" />
      <Text style={styles.text}>Cargando</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#402158', 
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: '#402158', 
  },
});

export default LoadingScreen;
