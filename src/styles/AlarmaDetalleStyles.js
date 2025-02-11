// AlarmaDetalleStyles.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0F2F5", // Fondo claro y neutro
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF", // Fondo blanco para el contenido
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
    marginVertical: 20,
    textAlign: "center",
  },
  map: {
    width: "100%",
    height: 250,
    borderRadius: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    elevation: 3
  },
  detailBox: {
    width: "100%",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    elevation: 4
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
});
