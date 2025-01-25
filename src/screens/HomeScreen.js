import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a la App</Text>
      {/* Botón para ir a la pantalla de CommunityGroups */}
      <Button
        title="Grupos Comunitarios"
        onPress={() => navigation.navigate("CommunityGroups")}
      />
      {/* Botón para ir a la pantalla de ListaSectores */}
      <Button
        title="Consultar Sectores"
        onPress={() => navigation.navigate("ListaSectores")}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    marginVertical: 10,
  },
});

export default HomeScreen;
