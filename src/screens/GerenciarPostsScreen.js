
import React, { useCallback, useState } from 'react';

import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import {
  listarPosts,
  excluirPost,
} from '../services/api';

export default function GerenciarPostsScreen({ route, navigation }) {
  const token = route.params?.token;

  const [posts, setPosts] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [excluindoId, setExcluindoId] = useState(null);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  const carregarPosts = useCallback(async () => {
    try {
      setCarregando(true);
      setErro('');

      const aulas = await listarPosts();
      setPosts(aulas);
    } catch (error) {
      setErro('Não foi possível carregar as postagens.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (token) {
        carregarPosts();
      } else {
        setCarregando(false);
      }
    }, [token, carregarPosts])
  );

  async function confirmarExclusao(post) {
    if (!token) {
      setErro('Faça login como professor.');
      return;
    }

    const executarExclusao = async () => {
      try {
        setExcluindoId(post._id);
        setErro('');
        setMensagem('');

        await excluirPost(post._id, token);

        setPosts((anteriores) =>
          anteriores.filter((item) => item._id !== post._id)
        );

        setMensagem('Aula excluída com sucesso! 🌸');
      } catch (error) {
        setErro(error.message || 'Erro ao excluir a aula.');
      } finally {
        setExcluindoId(null);
      }
    };

    if (Platform.OS === 'web') {
      const confirmado = window.confirm(
        `Deseja realmente excluir a aula "${post.titulo}"?`
      );

      if (confirmado) {
        await executarExclusao();
      }

      return;
    }

    Alert.alert(
      'Excluir aula',
      `Deseja realmente excluir "${post.titulo}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: executarExclusao,
        },
      ]
    );
  }

  if (!token) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>
          Acesso restrito. Faça login como professor.
        </Text>

        <Pressable
          style={styles.createButton}
          onPress={() => navigation.replace('Login')}
        >
          <Text style={styles.buttonText}>
            Fazer login
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        📚 Gerenciar Postagens
      </Text>

      <Text style={styles.subtitle}>
        Crie, visualize, edite ou exclua suas aulas.
      </Text>

      <Pressable
        style={styles.createButton}
        onPress={() =>
          navigation.navigate('CriarPost', { token })
        }
      >
        <Text style={styles.buttonText}>
          + Criar Nova Aula 🌸
        </Text>
      </Pressable>

      {erro !== '' && (
        <Text style={styles.error}>{erro}</Text>
      )}

      {mensagem !== '' && (
        <Text style={styles.success}>{mensagem}</Text>
      )}

      {carregando ? (
        <ActivityIndicator
          size="large"
          color="#C04B78"
        />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.subtitle}>
              Nenhuma postagem cadastrada.
            </Text>
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
                numberOfLines={2}
              >
                {item.conteudo}
              </Text>

              <Pressable
                style={styles.viewButton}
                onPress={() =>
                  navigation.navigate('Post', {
                    postId: item._id,
                  })
                }
              >
                <Text style={styles.buttonText}>
                  Visualizar aula 💗
                </Text>
              </Pressable>

              <Pressable
                style={styles.editButton}
                onPress={() =>
                  navigation.navigate('EditarPost', {
                    postId: item._id,
                    token,
                  })
                }
              >
                <Text style={styles.buttonText}>
                  Editar aula ✏️
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.deleteButton,
                  excluindoId !== null && styles.disabled,
                ]}
                disabled={excluindoId !== null}
                onPress={() => confirmarExclusao(item)}
              >
                {excluindoId === item._id ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>
                    Excluir aula 🗑️
                  </Text>
                )}
              </Pressable>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0F5',
    padding: 20,
  },

  center: {
    flex: 1,
    backgroundColor: '#FFF0F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#C04B78',
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 15,
    color: '#703B55',
    marginBottom: 20,
  },

  createButton: {
    backgroundColor: '#C04B78',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 22,
  },

  list: {
    paddingBottom: 30,
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#C04B78',
    marginBottom: 8,
  },

  author: {
    fontSize: 14,
    color: '#8D6477',
    marginBottom: 10,
  },

  description: {
    fontSize: 15,
    color: '#65505A',
    lineHeight: 23,
  },

  viewButton: {
    backgroundColor: '#C04B78',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },

  editButton: {
    backgroundColor: '#A86A91',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  deleteButton: {
    backgroundColor: '#C45B68',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  disabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },

  error: {
    color: '#C0392B',
    textAlign: 'center',
    marginBottom: 15,
  },

  success: {
    color: '#23804A',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 15,
  },
});
