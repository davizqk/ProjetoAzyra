
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import iconPerfil from '../../assets/icone-perfil.png';
import '../styles/telaDados.css';
import { apiRequest } from '../services/api';

export default function TelaDados() {
  const [cpf, setCpf] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const navigate = useNavigate();

  function formatarCPF(valor) {
    const numeros = valor.replace(/\D/g, '').slice(0, 11);

    return numeros
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1-$2');
  }

  async function continuar(event) {
    event.preventDefault();

    const cpfNumeros = cpf.replace(/\D/g, '');

    if (cpfNumeros.length !== 11) {
      setErro('Digite um CPF com 11 números.');
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      const aluno = await apiRequest(`/Aluno/cpf/${cpfNumeros}`);

      sessionStorage.setItem('azyraAluno', JSON.stringify(aluno));

      navigate('/atraso');
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="tela-dados">
      <header className="cabecalho-dados">
        <h1>Seus dados</h1>
      </header>

      <section className="conteudo-dados">
        <h2 className="instrucao-dados">
          Confirme suas informações para
          <br className="quebra-dados" />
          {' '}registrar sua chegada.
        </h2>

        <form onSubmit={continuar}>
          <section className="cartao-perfil">
            <img
              className="icone-perfil"
              src={iconPerfil}
              alt="Ícone de perfil"
            />

            <label className="label-cpf" htmlFor="cpf">
              CPF
            </label>

            <input
              id="cpf"
              className="campo-cpf"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(event) =>
                setCpf(formatarCPF(event.target.value))
              }
            />

            {erro && (
              <p role="alert" className="erro-api">
                {erro}
              </p>
            )}

            <button
              className="botao-continuar"
              type="submit"
              disabled={carregando}
            >
              {carregando
                ? 'Consultando...'
                : 'Confirmar e continuar'}
            </button>
          </section>
        </form>
      </section>
    </main>
  );
}
