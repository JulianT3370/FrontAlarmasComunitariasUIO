import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import apiService from "../services/apiService";

const AddGroupScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleAddGroup = async () => {
    if (!nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    try {
      const data = { nombre, descripcion };
      await apiService.createSector(data);
      alert("Grupo creado con éxito");
      navigation.goBack();
    } catch (error) {
      alert("Error al crear el grupo");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Grupo</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del Grupo"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
      />
      <Button title="Agregar Grupo" onPress={handleAddGroup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
});

export default AddGroupScreen;
