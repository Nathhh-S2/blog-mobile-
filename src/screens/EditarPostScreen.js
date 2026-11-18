
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { buscarPost, atualizarPost } from '../services/api';

export default function EditarPostScreen({ navigation, route }) {
  const postId = route.params?.postId;
  const token = route.params?.token;

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [conteudo, setConteudo] = useState('');

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    async function carregarAula() {
      if (!postId || !token) {
        setErro('Acesso não autorizado ou aula não selecionada.');
        setCarregando(false);
        return;
      }

      try {
        setCarregando(true);
        setErro('');

        const aula = await buscarPost(postId);

        setTitulo(aula.titulo || '');
        setAutor(aula.autor || '');
        setConteudo(aula.conteudo || '');
      } catch (error) {
        setErro('Não foi possível carregar a aula.');
      } finally {
        setCarregando(false);
      }
    }

    carregarAula();
  }, [postId, token]);

  async function salvarAlteracoes() {
    if (!token || !postId) {
      setErro('Acesso não autorizado.');
      return;
    }

    if (!titulo.trim() || !autor.trim() || !conteudo.trim()) {
      setErro('Preencha todos os campos.');
      return;
    }

    try {
      setSalvando(true);
      setErro('');
      setMensagem('');

      await atualizarPost(
        postId,
        titulo.trim(),
        conteudo.trim(),
        autor.trim(),
        token
      );

      setMensagem('Aula atualizada com sucesso! 🌸');
    } catch (error) {
      setErro(error.message || 'Erro ao atualizar a aula.');
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#C04B78" />
        <Text style={styles.subtitle}>Carregando aula...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>
        🌸 Editar Aula
      </Text>

      <Text style={styles.subtitle}>
        Atualize as informações da postagem.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Título da aula</Text>

        <TextInput
          style={styles.input}
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Título"
          editable={!!token && !!postId}
        />

        <Text style={styles.label}>Nome do professor</Text>

        <TextInput
          style={styles.input}
          value={autor}
          onChangeText={setAutor}
          placeholder="Autor"
          editable={!!token && !!postId}
        />

        <Text style={styles.label}>Conteúdo da aula</Text>

        <TextInput
          style={[styles.input, styles.textArea]}
          value={conteudo}
          onChangeText={setConteudo}
          multiline
          textAlignVertical="top"
          placeholder="Conteúdo"
          editable={!!token && !!postId}
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
            (salvando || !token || !postId) && styles.disabled,
          ]}
          onPress={salvarAlteracoes}
          disabled={salvando || !token || !postId}
        >
          {salvando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>
              Salvar alterações 💗
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

  center: {
    flex: 1,
    backgroundColor: '#FFF0F5',
    justifyContent: 'center',
    alignItems: 'center',
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

  disabled: {
    opacity: 0.6,
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
    textAlign: 'center',
    marginBottom: 12,
  },

  success: {
    color: '#23804A',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 12,
  },
});
