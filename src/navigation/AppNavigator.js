import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import LocationAccess from '../screens/LocationAccess';
import CommunityGroups from '../screens/CommunityGroups';
import AddGroupScreen from '../screens/AddGroupScreen';
import AlarmScreen from '../screens/AlarmScreen';
import HeatMapScreen from '../screens/HeatMapScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="LocationAccess" component={LocationAccess} />
        <Stack.Screen name="CommunityGroups" component={CommunityGroups} />
        <Stack.Screen name="AddGroup" component={AddGroupScreen} />
        <Stack.Screen name="Alarm" component={AlarmScreen} />
        <Stack.Screen name="HeatMap" component={HeatMapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
