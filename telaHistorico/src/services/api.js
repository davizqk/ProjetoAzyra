
const API_URL = 'http://localhost:7100/api';

export async function apiRequest(endpoint, options = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      'Não foi possível conectar à API. Verifique se ela está em execução.'
    );
  }

  const texto = await response.text();

  let dados = null;

  try {
    dados = texto ? JSON.parse(texto) : null;
  } catch {
    dados = texto;
  }

  if (!response.ok) {
    throw new Error(
      dados?.mensagem ||
      dados?.title ||
      'Ocorreu um erro ao consultar a API.'
    );
  }

  return dados;
}
