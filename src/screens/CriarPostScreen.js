
import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { criarPost } from '../services/api';

export default function CriarPostScreen({ navigation, route }) {
  const token = route.params?.token;

  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [autor, setAutor] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  async function publicarAula() {
    if (!token) {
      setErro('Faça login como professor para publicar.');
      return;
    }

    if (!titulo.trim() || !conteudo.trim() || !autor.trim()) {
      setErro('Preencha todos os campos.');
      return;
    }

    try {
      setCarregando(true);
      setErro('');
      setMensagem('');

      await criarPost(
        titulo.trim(),
        conteudo.trim(),
        autor.trim(),
        token
      );

      setMensagem('Aula publicada com sucesso! 🌸');
      setTitulo('');
      setConteudo('');
      setAutor('');

    } catch (error) {
      setErro(error.message || 'Erro ao publicar aula.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>
        🌸 Criar Nova Aula
      </Text>

      <Text style={styles.subtitle}>
        Compartilhe um novo conteúdo com seus estudantes.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Título da aula</Text>

        <TextInput
          style={styles.input}
          placeholder="Ex.: Introdução ao JavaScript"
          value={titulo}
          onChangeText={setTitulo}
        />

        <Text style={styles.label}>Nome do professor</Text>

        <TextInput
          style={styles.input}
          placeholder="Ex.: Professor João"
          value={autor}
          onChangeText={setAutor}
        />

        <Text style={styles.label}>Conteúdo da aula</Text>

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Escreva aqui a explicação da aula..."
          value={conteudo}
          onChangeText={setConteudo}
          multiline
          textAlignVertical="top"
        />

        {erro !== '' && (
          <Text style={styles.error}>{erro}</Text>
        )}

        {mensagem !== '' && (
          <Text style={styles.success}>{mensagem}</Text>
        )}

        <Pressable
          style={[
            styles.button,
            carregando && styles.buttonDisabled,
          ]}
          onPress={publicarAula}
          disabled={carregando || !token}
        >
          {carregando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>
              Publicar aula 🌸
            </Text>
          )}
        </Pressable>

        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>
            Voltar às postagens
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0F5',
  },
  content: {
    padding: 22,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#C04B78',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#703B55',
    marginBottom: 22,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 18,
    elevation: 2,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#703B55',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF7FA',
    borderWidth: 1,
    borderColor: '#E8B7CB',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    marginBottom: 18,
    color: '#703B55',
  },
  textArea: {
    minHeight: 150,
  },
  button: {
    backgroundColor: '#C04B78',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  backText: {
    color: '#C04B78',
    fontWeight: 'bold',
  },
  error: {
    color: '#C0392B',
    marginBottom: 12,
    textAlign: 'center',
  },
  success: {
    color: '#23804A',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
