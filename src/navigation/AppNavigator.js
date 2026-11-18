
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import AdminScreen from '../screens/AdminScreen';
import PostScreen from '../screens/PostScreen';
import GerenciarPostsScreen from '../screens/GerenciarPostsScreen';
import CriarPostScreen from '../screens/CriarPostScreen';
import EditarPostScreen from '../screens/EditarPostScreen';
import GerenciarProfessoresScreen from '../screens/GerenciarProfessoresScreen';
import GerenciarEstudantesScreen from '../screens/GerenciarEstudantesScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFF0F5',
          },
          headerTintColor: '#C04B78',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#FFF0F5',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Blog Educacional' }}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Área do Professor' }}
        />

        <Stack.Screen
          name="Admin"
          component={AdminScreen}
          options={{ title: 'Painel Administrativo' }}
        />

        <Stack.Screen
          name="Post"
          component={PostScreen}
          options={{ title: 'Leitura da Aula' }}
        />

        <Stack.Screen
          name="GerenciarPosts"
          component={GerenciarPostsScreen}
          options={{ title: 'Gerenciar Postagens' }}
        />

        <Stack.Screen
          name="CriarPost"
          component={CriarPostScreen}
          options={{ title: 'Criar Nova Aula' }}
        />

        <Stack.Screen
          name="EditarPost"
          component={EditarPostScreen}
          options={{ title: 'Editar Aula' }}
        />

        <Stack.Screen
          name="GerenciarProfessores"
          component={GerenciarProfessoresScreen}
          options={{ title: 'Gerenciar Professores' }}
        />

        <Stack.Screen
          name="GerenciarEstudantes"
          component={GerenciarEstudantesScreen}
          options={{ title: 'Gerenciar Estudantes' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
