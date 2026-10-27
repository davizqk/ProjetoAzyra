import { useState } from "react";
import logoAzyra from "../assets/logo-footer.png";
import "../styles/Login.css";

function Login({ aoEntrar }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  function entrar(evento) {
    evento.preventDefault();

    // Abre o perfil para testar as telas.
    aoEntrar();
  }

  return (
    <main className="pagina-login">
      <div className="detalhe-login detalhe-login-um"></div>
      <div className="detalhe-login detalhe-login-dois"></div>

      <div className="cartao-login">
        <div className="marca-login">
          <img src={logoAzyra} alt="Logo da Azyra" />
          
        </div>

        <div className="cabecalho-login">
          <h1>Bem-vindo à Azyra</h1>
          <p>Acesse sua conta para acompanhar suas turmas.</p>
        </div>

        <form className="formulario-login" onSubmit={entrar}>
          <div className="campo-login">
            <label htmlFor="email-login">E-mail</label>

            <div className="caixa-input-login">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="14" rx="1" />
                <path d="m4 7 8 6 8-6" />
              </svg>

              <input
                id="email-login"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="campo-login">
            <label htmlFor="senha-login">Senha</label>

            <div className="caixa-input-login">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <rect x="5" y="10" width="14" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>

              <input
                id="senha-login"
                type={mostrarSenha ? "text" : "password"}
                placeholder="Digite sua senha"
                value={senha}
                onChange={(evento) => setSenha(evento.target.value)}
                autoComplete="current-password"
                required
              />

              <button
                className="mostrar-senha"
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
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

                  {mostrarSenha && <path d="M4 4l16 16" />}
                </svg>
              </button>
            </div>
          </div>

          <button className="botao-entrar-login" type="submit">
            Entrar
          </button>

          <button className="esqueceu-senha" type="button">
            Esqueceu sua senha?
          </button>
        </form>

      </div>
    </main>
  );
}

export default Login;