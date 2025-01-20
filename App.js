import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import LocationAccess from './src/screens/LocationAccess';
import CommunityGroups from './src/screens/CommunityGroups';
import AddGroupScreen from './src/screens/AddGroupScreen';
import AlarmScreen from './src/screens/AlarmScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LocationAccess"
        screenOptions={{
          headerStyle: { backgroundColor: '#6200ee' }, // Fondo del encabezado
          headerTintColor: '#fff', // Color del texto e íconos en el encabezado
          headerTitleStyle: { fontWeight: 'bold' }, // Estilo del título
        }}
      >
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
