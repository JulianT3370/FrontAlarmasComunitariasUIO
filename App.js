import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import LocationAccess from './src/screens/LocationAccess';
import Login from './src/screens/Login';
import Microphone from './src/screens/Microphone';
import CamaraIP from './src/screens/CamaraIP';
import AgregarSector from "./src/screens/AgregarSector";
import SectorDetalle from "./src/screens/SectorDetalle";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown : false
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Inicio' }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: 'Iniciar Sesión' }}
        />
        <Stack.Screen
          name="LocationAccess"
          component={LocationAccess}
          options={{ title: 'Acceso a Ubicación' }}
        />
        <Stack.Screen
          name="AgregarSector"
          component={AgregarSector} // Se crea un nuevo sector
          options={{ title: 'AgregarSector' }}
        />
         <Stack.Screen
          name="SectorDetalle"
          component={SectorDetalle}
          options={{ title: 'SectorDetalle' }}
        />
        <Stack.Screen
          name="Microphone"
          component={Microphone} // Grabar voz para pasarla a texto
          options={{ title: 'Microfono' }}
        />
        <Stack.Screen
          name="CamaraIP"
          component={CamaraIP} 
          options={{ title: 'CamaraIP' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
