
import { Platform } from 'react-native';

const API_URL =
  Platform.OS === 'web'
    ? 'http://localhost:3000'
    : 'http://192.168.15.35:3000';

export async function listarPosts() {
  const resposta = await fetch(`${API_URL}/posts?pagina=1&limite=20`);

  if (!resposta.ok) {
    throw new Error('Não foi possível carregar as aulas.');
  }

  const dados = await resposta.json();

  return dados.posts;
}

export async function buscarPost(id) {
  const resposta = await fetch(
    `${API_URL}/posts/${encodeURIComponent(id)}`
  );

  if (!resposta.ok) {
    throw new Error('Não foi possível carregar a aula.');
  }

  return await resposta.json();
}

export async function fazerLogin(email, senha) {
  const resposta = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      senha,
    }),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.mensagem || 'E-mail ou senha incorretos.');
  }

  if (!dados.token) {
    throw new Error('O servidor não retornou um token de acesso.');
  }

  return dados;
}

export async function criarPost(titulo, conteudo, autor, token) {
  const resposta = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      titulo,
      conteudo,
      autor,
    }),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      dados.mensagem || 'Não foi possível criar a postagem.'
    );
  }

  return dados;
}

export async function atualizarPost(id, titulo, conteudo, autor, token) {
  const resposta = await fetch(
    `${API_URL}/posts/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        titulo,
        conteudo,
        autor,
      }),
    }
  );

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      dados.mensagem || 'Não foi possível atualizar a aula.'
    );
  }

  return dados;
}

export async function excluirPost(id, token) {
  const resposta = await fetch(
    `${API_URL}/posts/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!resposta.ok) {
    const dados = await resposta.json().catch(() => ({}));

    throw new Error(
      dados.mensagem || 'Não foi possível excluir a aula.'
    );
  }

  return true;
}

export async function listarUsuarios(tipo, token, pagina = 1) {
  const resposta = await fetch(
    `${API_URL}/api/usuarios?tipo=${encodeURIComponent(tipo)}&pagina=${pagina}&limite=20`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      dados.mensagem || 'Erro ao listar usuários.'
    );
  }

  return dados;
}

export async function cadastrarUsuario(
  tipo,
  nome,
  email,
  senha,
  token
) {
  const resposta = await fetch(
    `${API_URL}/api/usuarios/${encodeURIComponent(tipo)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nome,
        email,
        senha,
      }),
    }
  );

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      dados.mensagem || 'Erro ao cadastrar usuário.'
    );
  }

  return dados;
}

export async function atualizarUsuario(
  tipo,
  id,
  nome,
  email,
  senha,
  token
) {
  const dadosAtualizados = {
    nome,
    email,
  };

  if (senha && senha.trim() !== '') {
    dadosAtualizados.senha = senha;
  }

  const resposta = await fetch(
    `${API_URL}/api/usuarios/${encodeURIComponent(tipo)}/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dadosAtualizados),
    }
  );

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      dados.mensagem || 'Erro ao atualizar usuário.'
    );
  }

  return dados;
}

export async function excluirUsuario(tipo, id, token) {
  const resposta = await fetch(
    `${API_URL}/api/usuarios/${encodeURIComponent(tipo)}/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      dados.mensagem || 'Erro ao excluir usuário.'
    );
  }

  return dados;
}
