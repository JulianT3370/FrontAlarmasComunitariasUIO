import { View, Image, TouchableOpacity, Text } from 'react-native';
import { useState } from 'react';
import Dialog from "react-native-dialog";

export default function App({ navigation }) {
  const [isVisible, setIsVisible] = useState(false);

  const alertDialog = () => {
    setIsVisible(true);
  }
  const handleCancel = () => {
    setIsVisible(false);
  };

  return (
    <View style={style.view}>
      <TouchableOpacity onPress={alertDialog}>
        <Image source={require("../assets/Logo.png")} />
      </TouchableOpacity>

      <Dialog.Container visible={isVisible}>
        <Dialog.Title>Envio de Alerta</Dialog.Title>
        <Dialog.Description>
          Se enviará una alerta en unos segundos!
        </Dialog.Description>
        <Dialog.Button label="Cancelar" onPress={handleCancel} />
      </Dialog.Container>

      <TouchableOpacity style={style.button} onPress={() => navigation.navigate("Login")}>
        <Text style={style.buttonText}>Comenzar</Text>
      </TouchableOpacity>
    </View>
  );
}

const style = {
  view: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  button: {
    borderRadius: 10,
    padding: 15,
    backgroundColor: "blue",
    width: "50%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalText: {
    color: "white",
    fontSize: 18,
    marginBottom: 20,
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
};
