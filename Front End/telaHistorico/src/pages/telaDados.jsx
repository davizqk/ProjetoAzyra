
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import iconPerfil from '../../assets/icone-perfil.png';
import '../styles/telaDados.css';

export default function TelaDados() {
  const [cpf, setCpf] = useState('');
  const [justificativa, setJustificativa] = useState('');
  const [erro, setErro] = useState('');

  const navigate = useNavigate();

  function formatarCPF(valor) {
    const numeros = valor.replace(/\D/g, '').slice(0, 11);

    return numeros
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1-$2');
  }

  function continuar(event) {
    event.preventDefault();

    const cpfNumeros = cpf.replace(/\D/g, '');

    if (cpfNumeros.length !== 11) {
      setErro('Digite um CPF com 11 números.');
      return;
    }

    setErro('');

    sessionStorage.setItem(
      'azyraAluno',
      JSON.stringify({ cpf })
    );

    sessionStorage.setItem('azyraJustificativa', justificativa);

    navigate('/atraso');
  }

  return (
    <main className="tela-dados">
      <header className="cabecalho-dados">
        <h1>Seus dados</h1>
      </header>

      <section className="conteudo-dados">
        <h2 className="instrucao-dados">
          Confirme suas informações para
          registrar sua chegada.
        </h2>

        <form onSubmit={continuar}>
          <div className="cartao-perfil">
            <img
              className="icone-perfil"
              src={iconPerfil}
              alt="Perfil"
            />

            <label className="label-cpf" htmlFor="cpf">
              CPF
            </label>

            <input
              id="cpf"
              className="campo-cpf"
              type="text"
              inputMode="numeric"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(event) =>
                setCpf(formatarCPF(event.target.value))
              }
            />
          </div>

          {erro && (
            <p className="erro-api">{erro}</p>
          )}

          <textarea
            className="campo-justificativa"
            placeholder="Justifique seu atraso"
            value={justificativa}
            onChange={(event) =>
              setJustificativa(event.target.value)
            }
          />

          <button
            className="botao-continuar"
            type="submit"
          >
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}
