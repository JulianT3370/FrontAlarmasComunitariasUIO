import { View, Text } from "react-native";

function AlarmaDetalle({ route }) {
  const { alarm } = route.params;
  return (
    <View>
      <Text>Detalle de {alarm.name}</Text>
    </View>
  );
}

export default AlarmaDetalle;
