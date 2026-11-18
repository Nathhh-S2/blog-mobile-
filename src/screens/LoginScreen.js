
import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { fazerLogin } from '../services/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function entrar() {
    if (!email.trim() || !senha) {
      setErro('Preencha o e-mail e a senha.');
      return;
    }

    try {
      setCarregando(true);
      setErro('');

      const dados = await fazerLogin(email.trim(), senha);

      // A tela administrativa será protegida
      // com o token no próximo passo.
      navigation.replace('Admin', {
        token: dados.token,
      });
    } catch (error) {
      setErro(error.message || 'Erro ao fazer login.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Olá, professor! 🌸
      </Text>

      <Text style={styles.subtitle}>
        Entre para acessar sua área administrativa.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      {erro !== '' && (
        <Text style={styles.error}>{erro}</Text>
      )}

      <Pressable
        style={[
          styles.button,
          carregando && styles.buttonDisabled,
        ]}
        onPress={entrar}
        disabled={carregando}
      >
        {carregando ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>
            Entrar 💗
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0F5',
    justifyContent: 'center',
    padding: 25,
  },

  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#C04B78',
    textAlign: 'center',
  },

  subtitle: {
    color: '#8D6477',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 30,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    fontSize: 16,
  },

  error: {
    color: '#C0392B',
    textAlign: 'center',
    marginBottom: 15,
  },

  button: {
    backgroundColor: '#C04B78',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

