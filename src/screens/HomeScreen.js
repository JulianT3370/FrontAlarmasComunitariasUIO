import { View, Image, TouchableOpacity, Text, StatusBar } from 'react-native';
import { HomeStyles } from '../styles/HomeStyle';

export default function App({ navigation }) {
  return (
    <View style={HomeStyles.view}>
      <StatusBar
        backgroundColor="#6200ee"
        barStyle="light-content" 
        hidden={false}           
      />
      <Image source={require("../assets/Logo.png")} />

      <TouchableOpacity style={HomeStyles.button} onPress={() => navigation.navigate("Login")}>
        <Text style={HomeStyles.buttonText}>Comenzar</Text>
      </TouchableOpacity>
    </View>
  );
}
