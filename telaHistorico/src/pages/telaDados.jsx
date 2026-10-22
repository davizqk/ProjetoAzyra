import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import iconPerfil from '../assets/icone-perfil.png';
import '../styles/telaDados.css';

export default function TelaDados() {
  const [cpf, setCpf] = useState('');
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

    const numeros = cpf.replace(/\D/g, '');

    if (numeros.length !== 11) {
      alert('Digite um CPF com 11 números.');
      return;
    }

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
              aria-describedby="ajuda-cpf"
            />

            <span id="ajuda-cpf" className="sr-only">
              Digite seu CPF com onze números.
            </span>

            <button className="botao-continuar" type="submit">
              Confirmar e continuar
            </button>
          </section>
        </form>
      </section>
    </main>
  );
}