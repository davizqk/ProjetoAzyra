
import { useState } from "react";
import "../styles/telaCadastro.css";
import logoLogin from "../assets/logo-login.png";
import { Link, useNavigate } from "react-router-dom";

function Cadastro() {
  const navigate = useNavigate();
  const [mostrarSenha, setMostrarSenha] = useState(false);

  function cadastrar(e) {
    e.preventDefault();
    navigate("/inicio");
  }

  return (
    <main className="cadastro-page">
      <section className="cadastro-card">

        <div className="cadastro-logo-container">
          <img
            src={logoLogin}
            alt="Logo Azyra"
            className="cadastro-logo"
          />
        </div>

        <span className="cadastro-marca">AZYRA</span>

        <h1>Crie sua conta</h1>

        <p className="cadastro-subtitulo">
          Comece agora e faça parte da nossa comunidade.
        </p>

        <form
          className="cadastro-form"
          onSubmit={cadastrar}
        >

          {/* NOME COMPLETO */}

          <div className="cadastro-campo">
            <label htmlFor="nome">Nome completo</label>

            <div className="cadastro-input-container">
              <svg
                className="cadastro-icone"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
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

          <div className="cadastro-campo">
            <label htmlFor="email">E-mail</label>

            <div className="cadastro-input-container">
              <svg
                className="cadastro-icone"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
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

          <div className="cadastro-campo">
            <label htmlFor="senha">Senha</label>

            <div className="cadastro-input-container">
              <svg
                className="cadastro-icone"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="4" y="10" width="16" height="11" rx="2" />
                <path d="M8 10V6a4 4 0 0 1 8 0v4" />
                <path d="M12 14v3" />
              </svg>

              <input
                type={mostrarSenha ? "text" : "password"}
                id="senha"
                name="senha"
                placeholder="Crie uma senha"
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                className="cadastro-mostrar-senha"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                aria-label={
                  mostrarSenha ? "Ocultar senha" : "Mostrar senha"
                }
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />

                  {mostrarSenha && (
                    <path d="m3 3 18 18" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* BOTÃO CADASTRAR */}

          <button
            type="submit"
            className="cadastro-botao"
          >
            Criar minha conta

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>

        </form>

        <div className="cadastro-divisor"></div>

        <p className="cadastro-login">
          Já tem uma conta?{" "}
          <Link to="/login">Entrar</Link>
        </p>

      </section>
    </main>
  );
}

export default Cadastro;
