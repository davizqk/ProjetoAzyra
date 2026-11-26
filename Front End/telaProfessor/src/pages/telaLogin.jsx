import { useState } from "react";
import logoAzyra from "../assets/logo-footer.png";
import "../styles/telaLogin.css";

function Login({ aoEntrar }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  function entrar(evento) {
    evento.preventDefault();

    if (aoEntrar) {
      aoEntrar();
    }
  }

  return (
    <main className="pagina-login">

      {/* ELEMENTOS DECORATIVOS */}
      <div className="detalhe-login detalhe-login-um" />
      <div className="detalhe-login detalhe-login-dois" />

      {/* CARTÃO PRINCIPAL */}
      <div className="cartao-login">

        {/* LOGO */}
        <div className="marca-login">
          <img src={logoAzyra} alt="Logo da Azyra" />
        </div>

        <span className="nome-marca-login">
          AZYRA
        </span>

        {/* CABEÇALHO */}
        <header className="cabecalho-login">

          <h1>Bem-vindo de volta!</h1>

          <p>
            Acesse sua conta para acompanhar suas turmas.
          </p>

        </header>

        {/* FORMULÁRIO */}
        <form
          className="formulario-login"
          onSubmit={entrar}
        >

          {/* E-MAIL */}
          <div className="campo-login">

            <label htmlFor="email-login">
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
                id="email-login"
                name="email"
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(evento) =>
                  setEmail(evento.target.value)
                }
                autoComplete="email"
                required
              />

            </div>

          </div>

          {/* SENHA */}
          <div className="campo-login">

            <label htmlFor="senha-login">
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
                id="senha-login"
                name="senha"
                type={mostrarSenha ? "text" : "password"}
                placeholder="Digite sua senha"
                value={senha}
                onChange={(evento) =>
                  setSenha(evento.target.value)
                }
                autoComplete="current-password"
                required
              />

              {/* MOSTRAR E OCULTAR SENHA */}
              <button
                className="mostrar-senha"
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                aria-label={
                  mostrarSenha
                    ? "Ocultar senha"
                    : "Mostrar senha"
                }
              >

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />

                  <circle cx="12" cy="12" r="3" />

                  {mostrarSenha && (
                    <path d="M4 4l16 16" />
                  )}

                </svg>

              </button>

            </div>

          </div>

          {/* BOTÃO ENTRAR */}
          <button
            className="botao-entrar-login"
            type="submit"
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
            className="esqueceu-senha"
            type="button"
          >
            Esqueceu sua senha?
          </button>

        </form>

      </div>

    </main>
  );
}

export default Login;