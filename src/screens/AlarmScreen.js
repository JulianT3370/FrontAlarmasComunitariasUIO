import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const AlarmScreen = () => {
  const handleActivateAlarm = () => {
    alert('¡Alarma activada!');
    // Aquí podrías activar la grabación o cualquier acción relacionada
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Presiona para activar la alarma.</Text>
      <Button title="Activar Alarma" onPress={handleActivateAlarm} />
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
    marginBottom: 20,
  },
});

export default AlarmScreen;
