
import React from 'react';

import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';

export default function AdminScreen({ route, navigation }) {
  const token = route.params?.token;

  if (!token) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>
          Acesso restrito. Faça login como professor.
        </Text>

        <Pressable
          style={styles.logoutButton}
          onPress={() => navigation.replace('Login')}
        >
          <Text style={styles.buttonText}>
            Fazer Login
          </Text>
        </Pressable>
      </View>
    );
  }

  function sairDaConta() {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>
        🌸 Painel Administrativo
      </Text>

      <Text style={styles.subtitle}>
        Bem-vindo à área do professor!
      </Text>

      <Text style={styles.description}>
        Escolha uma das opções abaixo para gerenciar
        o Blog Educacional.
      </Text>

      <Pressable
        style={styles.card}
        onPress={() =>
          navigation.navigate('GerenciarPosts', { token })
        }
      >
        <Text style={styles.cardIcon}>📚</Text>

        <Text style={styles.cardTitle}>
          Gerenciar Postagens
        </Text>

        <Text style={styles.cardDescription}>
          Criar, visualizar, editar e excluir aulas.
        </Text>

        <Text style={styles.cardLink}>
          Acessar postagens →
        </Text>
      </Pressable>

      <Pressable
        style={styles.card}
        onPress={() =>
          navigation.navigate('GerenciarProfessores', { token })
        }
      >
        <Text style={styles.cardIcon}>👩‍🏫</Text>

        <Text style={styles.cardTitle}>
          Gerenciar Professores
        </Text>

        <Text style={styles.cardDescription}>
          Cadastrar, consultar, editar e excluir professores.
        </Text>

        <Text style={styles.cardLink}>
          Acessar professores →
        </Text>
      </Pressable>

      <Pressable
        style={styles.card}
        onPress={() =>
          navigation.navigate('GerenciarEstudantes', { token })
        }
      >
        <Text style={styles.cardIcon}>🎓</Text>

        <Text style={styles.cardTitle}>
          Gerenciar Estudantes
        </Text>

        <Text style={styles.cardDescription}>
          Cadastrar, consultar, editar e excluir estudantes.
        </Text>

        <Text style={styles.cardLink}>
          Acessar estudantes →
        </Text>
      </Pressable>

      <Pressable
        style={styles.logoutButton}
        onPress={sairDaConta}
      >
        <Text style={styles.buttonText}>
          Sair da Conta 🚪
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0F5',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    backgroundColor: '#FFF0F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#C04B78',
    marginBottom: 12,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#703B55',
    textAlign: 'center',
    marginBottom: 10,
  },

  description: {
    fontSize: 15,
    color: '#8D6477',
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 25,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 22,
    marginBottom: 18,
    alignItems: 'center',
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F5D5E2',
  },

  cardIcon: {
    fontSize: 35,
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C04B78',
    marginBottom: 10,
    textAlign: 'center',
  },

  cardDescription: {
    fontSize: 15,
    color: '#703B55',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 12,
  },

  cardLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#C04B78',
  },

  logoutButton: {
    backgroundColor: '#C04B78',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  error: {
    color: '#C0392B',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});
