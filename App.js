import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import LocationAccess from './src/screens/LocationAccess';
import CommunityGroups from './src/screens/CommunityGroups';
import AddGroupScreen from './src/screens/AddGroupScreen';
import AlarmScreen from './src/screens/AlarmScreen';
import Login from './src/screens/Login';
import ListaSectores from './src/screens/ListaSectores';
import AlarmaDetalle from './src/screens/AlarmaDetalle';
import NuevaAlarma from './src/screens/NuevaAlarma';
import GenerarAlarma from './src/screens/GenerarAlarma';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: '#6200ee' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
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
          name="Home"
          component={HomeScreen}
          options={{ title: 'Inicio' }}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
