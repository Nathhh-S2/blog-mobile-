
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';

import { listarPosts } from '../services/api';

export default function HomeScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarPosts();
  }, []);

  async function carregarPosts() {
    try {
      setCarregando(true);
      setErro('');

      const aulas = await listarPosts();
      setPosts(aulas);

    } catch (error) {
      setErro('Não foi possível carregar as aulas.');
    } finally {
      setCarregando(false);
    }
  }

  const postsFiltrados = posts.filter((post) => {
    const termo = pesquisa.toLowerCase();

    return (
      post.titulo.toLowerCase().includes(termo) ||
      post.conteudo.toLowerCase().includes(termo) ||
      post.autor.toLowerCase().includes(termo)
    );
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={postsFiltrados}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.content}

        ListHeaderComponent={
          <View>
            <Text style={styles.logo}>
              🌸 Blog Educacional
            </Text>

            <Text style={styles.title}>
              Bem-vindo!
            </Text>

            <Text style={styles.subtitle}>
              Seu espaço de aprendizagem.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="🔎 Pesquisar aulas..."
              placeholderTextColor="#9B7A89"
              value={pesquisa}
              onChangeText={setPesquisa}
            />

            <Text style={styles.sectionTitle}>
              📚 Nossas aulas
            </Text>

            {carregando && (
              <ActivityIndicator
                size="large"
                color="#C04B78"
              />
            )}

            {erro !== '' && (
              <Text style={styles.error}>
                {erro}
              </Text>
            )}
          </View>
        }

        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {item.titulo}
            </Text>

            <Text style={styles.author}>
              ✏️ {item.autor}
            </Text>

            <Text
              style={styles.description}
              numberOfLines={3}
            >
              {item.conteudo}
            </Text>

            <Pressable
              style={styles.button}
              onPress={() =>
                navigation.navigate('Post', {
                  postId: item._id,
                })
              }
            >
              <Text style={styles.buttonText}>
                Ler aula 💗
              </Text>
            </Pressable>
          </View>
        )}

        ListEmptyComponent={
          !carregando && !erro ? (
            <Text style={styles.empty}>
              Nenhuma aula encontrada.
            </Text>
          ) : null
        }

        ListFooterComponent={
          <View>
            <Pressable
              style={styles.loginButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginText}>
                Entrar como professor
              </Text>
            </Pressable>

            <Text style={styles.footer}>
              Aprender é florescer! 🌷
            </Text>
          </View>
        }
      />
    </View>
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

  logo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#C04B78',
    textAlign: 'center',
    marginBottom: 25,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#703B55',
  },

  subtitle: {
    fontSize: 16,
    color: '#8D6477',
    marginTop: 8,
    marginBottom: 25,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8B7CB',
    borderRadius: 14,
    padding: 15,
    fontSize: 15,
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#703B55',
    marginBottom: 15,
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 18,
    marginBottom: 18,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#C04B78',
    marginBottom: 10,
  },

  author: {
    fontSize: 13,
    color: '#8D6477',
    marginBottom: 12,
  },

  description: {
    fontSize: 15,
    color: '#65505A',
    lineHeight: 23,
  },

  button: {
    backgroundColor: '#C04B78',
    padding: 13,
    borderRadius: 12,
    marginTop: 18,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },

  loginButton: {
    alignItems: 'center',
    padding: 15,
    marginTop: 15,
  },

  loginText: {
    color: '#C04B78',
    fontWeight: 'bold',
    fontSize: 16,
  },

  footer: {
    textAlign: 'center',
    color: '#C04B78',
    marginTop: 15,
  },

  error: {
    color: '#C0392B',
    textAlign: 'center',
    marginBottom: 20,
  },

  empty: {
    color: '#8D6477',
    textAlign: 'center',
    marginTop: 20,
  },
});
