
import "../styles/telaCadastro.css";
import logoLogin from "../assets/logo-login.png";
import { Link, useNavigate } from "react-router-dom";

function Cadastro() {
  const navigate = useNavigate();

  function cadastrar(e) {
    e.preventDefault();
    navigate("/inicio");
  }

  return (
    <main className="cadastro-page">
      <section className="cadastro-card">

        <img
          src={logoLogin}
          alt="Logo Azyra"
          className="cadastro-logo"
        />

        <h1>Crie sua conta na Azyra</h1>

        <p className="cadastro-subtitulo">
          Comece agora e faça parte da nossa comunidade
        </p>

        <form
          className="cadastro-form"
          onSubmit={cadastrar}
        >
          <div className="cadastro-campo">
            <label htmlFor="nome">Nome completo</label>
            <input
              type="text"
              id="nome"
              name="nome"
              required
            />
          </div>

          <div className="cadastro-campo">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              required
            />
          </div>

          <div className="cadastro-campo">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              required
            />
          </div>

          <button
            type="submit"
            className="cadastro-botao"
          >
            Cadastrar
          </button>
        </form>

        <p className="cadastro-login">
          Já tem uma conta?{" "}
          <Link to="/login">
            Entrar
          </Link>
        </p>

      </section>
    </main>
  );
}

export default Cadastro;
