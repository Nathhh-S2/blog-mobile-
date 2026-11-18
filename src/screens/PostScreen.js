
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';

import { buscarPost } from '../services/api';

export default function PostScreen({ route }) {
  const postId = route.params?.postId;

  const [post, setPost] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarPost() {
      if (!postId) {
        setErro('Nenhuma aula foi selecionada.');
        setCarregando(false);
        return;
      }

      try {
        setCarregando(true);
        setErro('');

        const aula = await buscarPost(postId);
        setPost(aula);
      } catch (error) {
        setErro('Não foi possível carregar esta aula.');
      } finally {
        setCarregando(false);
      }
    }

    carregarPost();
  }, [postId]);

  if (carregando) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#C04B78" />
        <Text style={styles.message}>Carregando aula...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{erro}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.card}>
        <Text style={styles.category}>
          🌸 BLOG EDUCACIONAL
        </Text>

        <Text style={styles.title}>
          {post.titulo}
        </Text>

        <Text style={styles.author}>
          ✏️ Autor: {post.autor}
        </Text>

        <View style={styles.divider} />

        <Text style={styles.content}>
          {post.conteudo}
        </Text>

        <Text style={styles.footer}>
          Aprender é florescer! 🌷
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0F5',
  },

  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    backgroundColor: '#FFF0F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },

  message: {
    marginTop: 15,
    color: '#8D6477',
    fontSize: 16,
  },

  error: {
    color: '#C0392B',
    fontSize: 16,
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 22,
    borderRadius: 18,
    marginTop: 15,
    elevation: 3,
  },

  category: {
    color: '#C04B78',
    fontWeight: 'bold',
    marginBottom: 15,
    fontSize: 13,
  },

  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#703B55',
    marginBottom: 15,
  },

  author: {
    color: '#8D6477',
    fontSize: 14,
    marginBottom: 20,
  },

  divider: {
    height: 1,
    backgroundColor: '#F3D4E0',
    marginBottom: 20,
  },

  content: {
    fontSize: 16,
    lineHeight: 27,
    color: '#65505A',
  },

  footer: {
    marginTop: 35,
    textAlign: 'center',
    color: '#C04B78',
    fontSize: 14,
  },
});

