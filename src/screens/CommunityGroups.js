import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import apiService from "../services/apiService";

const CommunityGroups = () => {
  const [sectores, setSectores] = useState([]);

  useEffect(() => {
    const fetchSectores = async () => {
      try {
        const data = await apiService.getSectores();
        setSectores(data);
      } catch (error) {
        console.error("Error obteniendo sectores:", error);
      }
    };

    fetchSectores();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grupos Comunitarios</Text>
      <FlatList
        data={sectores}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>Nombre: {item.nombre}</Text>
            <Text style={styles.itemText}>Descripción: {item.descripcion}</Text>
            <Text style={styles.itemText}>Número de alarmas: {item.numero_alarmas}</Text>
          </View>
        )}
      />
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
  item: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    elevation: 1,
  },
  itemText: {
    fontSize: 16,
  },
});

export default CommunityGroups;
