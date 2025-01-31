import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import LocationAccess from './src/screens/LocationAccess';
import CommunityGroups from './src/screens/CommunityGroups';
import AddGroupScreen from './src/screens/AddGroupScreen';
import AlarmScreen from './src/screens/AlarmScreen';
import Login from './src/screens/Login';
import ListaSectores from './src/screens/ListaSectores'; // Importa ListaSectores
import NuevaAlarma from './src/screens/NuevaAlarma';
import Microphone from './src/screens/Microphone';
import CamaraIP from './src/screens/CamaraIP';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#6200ee' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
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
          name="CommunityGroups"
          component={CommunityGroups}
          options={{ title: 'Grupos Comunitarios' }}
        />
        <Stack.Screen
          name="AddGroup"
          component={AddGroupScreen}
          options={{ title: 'Agregar Grupo' }}
        />
        <Stack.Screen
          name="Alarm"
          component={AlarmScreen}
          options={{ title: 'Activar Alarma' }}
        />
        <Stack.Screen
          name="ListaSectores"
          component={ListaSectores} // Se incluye sectores para alarma 
          options={{ title: 'Lista de Sectores' }}
        />
<<<<<<< HEAD
        <Stack.Screen
          name="NuevaAlarma"
          component={NuevaAlarma} // Se crea una nueva alarma
          options={{ title: 'NuevaAlarma' }}
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
        
=======
         <Stack.Screen
          name="AlarmaDetalle"
          component={AlarmaDetalle}
          options={{ title: 'Detalle de la Alarma' }}
        />
        <Stack.Screen
          name="NuevaAlarma"
          component={NuevaAlarma}
          options={{ title: 'Nueva Alarma' }}
        />
        <Stack.Screen
          name="GenerarAlarma"
          component={GenerarAlarma}
          options={{ title: 'Generar Alarma' }}
        />
>>>>>>> origin/Leonardo
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
