import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  map: {
    flex: 1,  // Permite que el mapa use el espacio completo
    height: 400,
    width: "100%",
  },
  alarmBox: {
    backgroundColor: "#F5F5F5",
    margin: 20,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Sombra en Android
  },
  alarmTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  alarmItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  alarmName: {
    fontWeight: "bold",
    fontSize: 14,
  },
  alarmAddress: {
    color: "gray",
    fontSize: 12,
  },
  addButton: {
    alignSelf: "center",
    marginTop: 15,
    backgroundColor: "blue",
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  generateAlarm: {
    padding: 20,
    marginBottom: 20,
  },
  generateTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 14,
  },
  generateButton: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  generateButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
