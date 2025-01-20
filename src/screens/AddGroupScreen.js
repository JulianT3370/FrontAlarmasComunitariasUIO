import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const AddGroupScreen = ({ navigation }) => {
  const [groupName, setGroupName] = useState('');

  const handleAddGroup = () => {
    if (groupName.trim() === '') {
      alert('El nombre del grupo no puede estar vacío.');
      return;
    }
    // Aquí puedes enviar el grupo a una API o base de datos
    alert(`Grupo "${groupName}" agregado con éxito.`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre del Grupo"
        value={groupName}
        onChangeText={setGroupName}
      />
      <Button title="Guardar Grupo" onPress={handleAddGroup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default AddGroupScreen;
