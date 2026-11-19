
import "../styles/cadastro.css";
import logoFooter from "../assets/logo-footer.png";

function Cadastro({ aoCadastrar, aoEntrar }) {
  return (
    <div className="cadastro-page">
      <div className="cadastro-card">

        <img
          src={logoFooter}
          alt="Logo Azyra"
          className="cadastro-logo"
        />

        <h1>Crie sua conta na Azyra</h1>

        <p className="cadastro-subtitulo">
          Comece agora e faça parte da nossa comunidade
        </p>

        <form
          className="cadastro-form"
          onSubmit={(e) => {
            e.preventDefault();

            if (aoCadastrar) {
              aoCadastrar();
            }
          }}
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
          <a
            href="#login"
            onClick={(e) => {
              e.preventDefault();

              if (aoEntrar) {
                aoEntrar();
              }
            }}
          >
            Entrar
          </a>
        </p>

      </div>
    </div>
  );
}

export default Cadastro;
