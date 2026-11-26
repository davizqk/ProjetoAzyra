import { useState } from "react";
import "../styles/telaCadastro.css";

import logoFooter from "../assets/logo-footer.png";

function Cadastro({ aoCadastrar, aoEntrar }) {
  const [mostrarSenha, setMostrarSenha] = useState(false);

  function cadastrar(e) {
    e.preventDefault();

    if (aoCadastrar) {
      aoCadastrar();
    }
  }

  return (
    <div className="pagina-cadastro">

      {/* ELEMENTOS DECORATIVOS */}
      <div className="detalhe-cadastro detalhe-cadastro-um" />
      <div className="detalhe-cadastro detalhe-cadastro-dois" />

      {/* CARTÃO PRINCIPAL */}
      <div className="cartao-cadastro">

        {/* LOGO */}
        <div className="marca-cadastro">
          <img src={logoFooter} alt="Logo Azyra" />
        </div>

        <span className="nome-marca-cadastro">
          AZYRA
        </span>

        {/* CABEÇALHO */}
        <header className="cabecalho-cadastro">

          <h1>Crie sua conta na Azyra</h1>

          <p>
            Comece agora e faça parte da nossa comunidade.
          </p>

        </header>

        {/* FORMULÁRIO */}
        <form
          className="formulario-cadastro"
          onSubmit={cadastrar}
        >

          {/* NOME COMPLETO */}
          <div className="campo-cadastro">

            <label htmlFor="nome">
              Nome completo
            </label>

            <div className="caixa-input-cadastro">

              <svg
                className="icone-input-cadastro"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
              </svg>

              <input
                type="text"
                id="nome"
                name="nome"
                placeholder="Digite seu nome completo"
                autoComplete="name"
                required
              />

            </div>

          </div>

          {/* E-MAIL */}
          <div className="campo-cadastro">

            <label htmlFor="email">
              E-mail
            </label>

            <div className="caixa-input-cadastro">

              <svg
                className="icone-input-cadastro"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                />

                <path d="m3 7 9 6 9-6" />
              </svg>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="Digite seu e-mail"
                autoComplete="email"
                required
              />

            </div>

          </div>

          {/* SENHA */}
          <div className="campo-cadastro">

            <label htmlFor="senha">
              Senha
            </label>

            <div className="caixa-input-cadastro">

              <svg
                className="icone-input-cadastro"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect
                  x="4"
                  y="10"
                  width="16"
                  height="11"
                  rx="2"
                />

                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                <path d="M12 14v3" />
              </svg>

              <input
                type={mostrarSenha ? "text" : "password"}
                id="senha"
                name="senha"
                placeholder="Crie sua senha"
                autoComplete="new-password"
                required
              />

              {/* MOSTRAR E OCULTAR SENHA */}
              <button
                type="button"
                className="mostrar-senha-cadastro"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                aria-label={
                  mostrarSenha
                    ? "Ocultar senha"
                    : "Mostrar senha"
                }
              >

                {mostrarSenha ? (

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 3l18 18" />

                    <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" />

                    <path d="M9.9 5.2A11 11 0 0 1 12 5c6 0 10 7 10 7a16 16 0 0 1-3 3.8" />

                    <path d="M6.2 6.2C3.5 8.2 2 12 2 12s4 7 10 7a10 10 0 0 0 5.8-1.8" />
                  </svg>

                ) : (

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />

                    <circle cx="12" cy="12" r="3" />
                  </svg>

                )}

              </button>

            </div>

          </div>

          {/* BOTÃO CADASTRAR */}
          <button
            type="submit"
            className="botao-cadastrar"
          >

            Criar minha conta

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>

          </button>

        </form>

        {/* LINK PARA LOGIN */}
        <p className="cadastro-login">

          Já tem uma conta?{" "}

          <button
            type="button"
            onClick={() => {
              if (aoEntrar) {
                aoEntrar();
              }
            }}
          >
            Entrar
          </button>

        </p>

      </div>

    </div>
  );
}

export default Cadastro;