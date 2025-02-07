import { View, Image, TouchableOpacity, Text } from 'react-native';

export default function App({ navigation }) {
  return (
    <View style={style.view}>
      <Image source={require("../assets/Logo.png")} />

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
};
