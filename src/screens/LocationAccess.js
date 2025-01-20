import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';

const LocationAccess = ({ navigation }) => {
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permiso Denegado',
          'La aplicación necesita acceso a tu ubicación para continuar.'
        );
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>La ubicación está habilitada.</Text>
      <Button
        title="Continuar"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});

export default LocationAccess;
