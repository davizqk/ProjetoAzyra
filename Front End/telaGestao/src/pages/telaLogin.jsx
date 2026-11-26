import { useState } from "react";
import { useNavigate } from "react-router-dom";

import logoLogin from "../assets/logo-login.png";

import "../styles/telaLogin.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  function entrar(evento) {
    evento.preventDefault();

    navigate("/inicio");
  }

  return (
    <div className="pagina-login">

      {/* ELEMENTOS DECORATIVOS */}
      <div className="detalhe-login detalhe-login-um" />
      <div className="detalhe-login detalhe-login-dois" />

      {/* CARTÃO DE LOGIN */}
      <div className="cartao-login">

        {/* LOGO */}
        <div className="marca-login">
          <img src={logoLogin} alt="Logo Azyra" />
        </div>

        <span className="nome-marca-login">
          AZYRA
        </span>

        {/* CABEÇALHO */}
        <header className="cabecalho-login">
          <h1>Bem-vindo de volta!</h1>
          <p>Entre na sua conta para acessar o sistema.</p>
        </header>

        {/* FORMULÁRIO */}
        <form
          className="formulario-login"
          onSubmit={entrar}
        >

          {/* E-MAIL */}
          <div className="campo-login">

            <label htmlFor="email">
              E-mail
            </label>

            <div className="caixa-input-login">

              <svg
                className="icone-input-login"
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
                id="email"
                name="email"
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />

            </div>

          </div>

          {/* SENHA */}
          <div className="campo-login">

            <label htmlFor="senha">
              Senha
            </label>

            <div className="caixa-input-login">

              <svg
                className="icone-input-login"
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
                id="senha"
                name="senha"
                type={mostrarSenha ? "text" : "password"}
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="current-password"
                required
              />

              {/* MOSTRAR E OCULTAR SENHA */}
              <button
                type="button"
                className="mostrar-senha"
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

          {/* BOTÃO ENTRAR */}
          <button
            type="submit"
            className="botao-entrar-login"
          >
            Entrar

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

          {/* ESQUECEU SUA SENHA */}
          <button
            type="button"
            className="esqueceu-senha"
            onClick={() =>
              alert("A recuperação de senha será disponibilizada em breve.")
            }
          >
            Esqueceu sua senha?
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;