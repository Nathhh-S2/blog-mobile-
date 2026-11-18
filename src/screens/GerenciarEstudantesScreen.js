
import React, { useCallback, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import {
  listarUsuarios,
  cadastrarUsuario,
  atualizarUsuario,
  excluirUsuario,
} from '../services/api';

export default function GerenciarEstudantesScreen({ route }) {
  const token = route.params?.token;

  const [estudantes, setEstudantes] = useState([]);

  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total, setTotal] = useState(0);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [editandoId, setEditandoId] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [excluindoId, setExcluindoId] = useState(null);

  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  const carregarEstudantes = useCallback(
    async (paginaDesejada = pagina) => {
      if (!token) {
        setCarregando(false);
        return;
      }

      try {
        setCarregando(true);
        setErro('');

        const dados = await listarUsuarios(
          'estudante',
          token,
          paginaDesejada
        );

        const quantidadePaginas = Math.max(
          1,
          dados.totalPaginas || 1
        );

        if (paginaDesejada > quantidadePaginas) {
          setPagina(quantidadePaginas);
          return;
        }

        setEstudantes(dados.usuarios || []);
        setTotalPaginas(quantidadePaginas);
        setTotal(dados.total || 0);
      } catch (error) {
        setErro(error.message || 'Erro ao carregar estudantes.');
      } finally {
        setCarregando(false);
      }
    },
    [token, pagina]
  );

  useFocusEffect(
    useCallback(() => {
      carregarEstudantes();
    }, [carregarEstudantes])
  );

  function limparFormulario() {
    setNome('');
    setEmail('');
    setSenha('');
    setEditandoId(null);
    setMostrarFormulario(false);
  }

  function iniciarCadastro() {
    limparFormulario();
    setErro('');
    setMensagem('');
    setMostrarFormulario(true);
  }

  function iniciarEdicao(estudante) {
    setNome(estudante.nome);
    setEmail(estudante.email);
    setSenha('');
    setEditandoId(estudante._id);
    setMostrarFormulario(true);
    setErro('');
    setMensagem('');
  }

  async function salvarEstudante() {
    setErro('');
    setMensagem('');

    if (!nome.trim() || !email.trim()) {
      setErro('Preencha nome e e-mail.');
      return;
    }

    if (!editandoId && !senha) {
      setErro('Informe uma senha para o novo estudante.');
      return;
    }

    if (senha && senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      setSalvando(true);

      const foiEdicao = Boolean(editandoId);

      if (foiEdicao) {
        await atualizarUsuario(
          'estudante',
          editandoId,
          nome.trim(),
          email.trim(),
          senha,
          token
        );
      } else {
        await cadastrarUsuario(
          'estudante',
          nome.trim(),
          email.trim(),
          senha,
          token
        );
      }

      limparFormulario();

      if (foiEdicao) {
        await carregarEstudantes(pagina);
      } else {
        setPagina(1);
        await carregarEstudantes(1);
      }

      setMensagem(
        foiEdicao
          ? 'Estudante atualizado com sucesso! 🌸'
          : 'Estudante cadastrado com sucesso! 🌸'
      );
    } catch (error) {
      setErro(error.message || 'Erro ao salvar estudante.');
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarExclusao(estudante) {
    const executarExclusao = async () => {
      try {
        setExcluindoId(estudante._id);
        setErro('');
        setMensagem('');

        await excluirUsuario('estudante', estudante._id, token);

        await carregarEstudantes(pagina);

        setMensagem('Estudante excluído com sucesso! 🌸');
      } catch (error) {
        setErro(error.message || 'Erro ao excluir estudante.');
      } finally {
        setExcluindoId(null);
      }
    };

    const pergunta =
      `Deseja realmente excluir o estudante "${estudante.nome}"?`;

    if (Platform.OS === 'web') {
      const confirmado = window.confirm(pergunta);

      if (confirmado) {
        await executarExclusao();
      }

      return;
    }

    Alert.alert(
      'Excluir estudante',
      pergunta,
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={estudantes}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>
              🎓 Gerenciar Estudantes
            </Text>

            <Text style={styles.subtitle}>
              Cadastre, consulte, edite ou exclua estudantes.
            </Text>

            <Pressable
              style={styles.createButton}
              onPress={iniciarCadastro}
              disabled={salvando}
            >
              <Text style={styles.buttonText}>
                + Cadastrar Estudante 🌸
              </Text>
            </Pressable>

            {mostrarFormulario && (
              <View style={styles.form}>
                <Text style={styles.formTitle}>
                  {editandoId
                    ? '✏️ Editar Estudante'
                    : '🌸 Novo Estudante'}
                </Text>

                <Text style={styles.label}>Nome</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Nome completo"
                  value={nome}
                  onChangeText={setNome}
                />

                <Text style={styles.label}>E-mail</Text>

                <TextInput
                  style={styles.input}
                  placeholder="estudante@exemplo.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Text style={styles.label}>
                  {editandoId
                    ? 'Nova senha (opcional)'
                    : 'Senha'}
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder={
                    editandoId
                      ? 'Deixe vazio para manter a senha'
                      : 'Mínimo de 6 caracteres'
                  }
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry
                />

                <Pressable
                  style={[
                    styles.saveButton,
                    salvando && styles.disabled,
                  ]}
                  onPress={salvarEstudante}
                  disabled={salvando}
                >
                  <Text style={styles.buttonText}>
                    {salvando
                      ? 'Salvando...'
                      : editandoId
                        ? 'Salvar Alterações 💗'
                        : 'Cadastrar Estudante 💗'}
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.cancelButton}
                  onPress={limparFormulario}
                  disabled={salvando}
                >
                  <Text style={styles.cancelText}>
                    Cancelar
                  </Text>
                </Pressable>
              </View>
            )}

            {erro !== '' && (
              <Text style={styles.error}>{erro}</Text>
            )}

            {mensagem !== '' && (
              <Text style={styles.success}>{mensagem}</Text>
            )}

            <Text style={styles.sectionTitle}>
              Estudantes cadastrados
            </Text>

            <Text style={styles.counter}>
              Total de estudantes: {total}
            </Text>

            {carregando && (
              <ActivityIndicator
                size="large"
                color="#C04B78"
              />
            )}
          </View>
        }
        ListEmptyComponent={
          !carregando ? (
            <Text style={styles.subtitle}>
              Nenhum estudante encontrado.
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              🎓 {item.nome}
            </Text>

            <Text style={styles.cardEmail}>
              ✉️ {item.email}
            </Text>

            <Text style={styles.cardType}>
              Tipo: Estudante
            </Text>

            <Pressable
              style={styles.editButton}
              onPress={() => iniciarEdicao(item)}
              disabled={salvando || excluindoId !== null}
            >
              <Text style={styles.buttonText}>
                Editar estudante ✏️
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.deleteButton,
                excluindoId !== null && styles.disabled,
              ]}
              onPress={() => confirmarExclusao(item)}
              disabled={salvando || excluindoId !== null}
            >
              {excluindoId === item._id ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>
                  Excluir estudante 🗑️
                </Text>
              )}
            </Pressable>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.pagination}>
            <Text style={styles.pageText}>
              Página {pagina} de {totalPaginas}
            </Text>

            <View style={styles.paginationButtons}>
              <Pressable
                style={[
                  styles.pageButton,
                  (pagina === 1 || carregando) &&
                    styles.disabled,
                ]}
                disabled={pagina === 1 || carregando}
                onPress={() =>
                  setPagina((atual) => atual - 1)
                }
              >
                <Text style={styles.buttonText}>
                  ← Anterior
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.pageButton,
                  (pagina >= totalPaginas || carregando) &&
                    styles.disabled,
                ]}
                disabled={
                  pagina >= totalPaginas || carregando
                }
                onPress={() =>
                  setPagina((atual) => atual + 1)
                }
              >
                <Text style={styles.buttonText}>
                  Próxima →
                </Text>
              </Pressable>
            </View>
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
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF0F5',
    padding: 20,
  },

  list: {
    paddingBottom: 35,
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
    lineHeight: 23,
  },

  createButton: {
    backgroundColor: '#C04B78',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },

  form: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },

  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C04B78',
    marginBottom: 15,
  },

  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#703B55',
    marginBottom: 7,
  },

  input: {
    borderWidth: 1,
    borderColor: '#E8B6CA',
    backgroundColor: '#FFF8FB',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    marginBottom: 15,
  },

  saveButton: {
    backgroundColor: '#C04B78',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },

  cancelButton: {
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },

  cancelText: {
    color: '#703B55',
    fontWeight: 'bold',
  },

  disabled: {
    opacity: 0.5,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#C04B78',
    marginBottom: 8,
  },

  counter: {
    fontSize: 14,
    color: '#8D6477',
    marginBottom: 15,
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C04B78',
    marginBottom: 8,
  },

  cardEmail: {
    fontSize: 14,
    color: '#65505A',
    marginBottom: 8,
  },

  cardType: {
    fontSize: 13,
    color: '#8D6477',
    marginBottom: 10,
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

  pagination: {
    marginTop: 15,
    padding: 15,
    alignItems: 'center',
  },

  pageText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#703B55',
    marginBottom: 15,
  },

  paginationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },

  pageButton: {
    flex: 1,
    backgroundColor: '#C04B78',
    padding: 13,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
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
