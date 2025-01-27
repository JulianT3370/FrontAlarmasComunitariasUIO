import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const NuevaAlarma = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva Alarma</Text>
      <TextInput 
        placeholder="Ingrese el nombre de la alarma" 
        style={styles.input}
      />
      <TextInput 
        placeholder="Ingrese el sector" 
        style={styles.input}
      />
      <Button title="Guardar Alarma" onPress={() => alert("Alarma guardada")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default NuevaAlarma;

