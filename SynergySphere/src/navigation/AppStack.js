// src/navigation/AppStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProjectsScreen from '../screens/Projects/ProjectsScreen';
import ProjectDetailScreen from '../screens/Projects/ProjectDetailScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';


const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();


// Projects Stack Navigator
const ProjectsStack = () => {
  return (

    <Stack.Navigator>
      <Stack.Screen 
        name="ProjectsList" 
        component={ProjectsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ProjectDetail" 
        component={ProjectDetailScreen}
        options={({ route }) => ({ 
          title: route.params.projectName || 'Project Details',
          headerBackTitle: 'Back'
        })}
      />
    </Stack.Navigator>
  );
};

// Main Tab Navigator

const AppStack = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Projects') {
            iconName = focused ? 'folder' : 'folder-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Projects" component={ProjectsStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default AppStack;
