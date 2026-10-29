
import "../styles/ptelaHistorico.css";
import "../styles/ptelaPerfil.css";

import logo from "../assets/logo-footer.png";
import iconeTurmas from "../assets/minhasturmas-footer.png";
import iconeHistorico from "../assets/historico-footer.png";
import perfilUsuario from "../assets/perfil-minhasturmas.png";
import iconeChapeu from "../assets/icon-chapeu.png";
import iconeEditarPerfil from "../assets/icon-editarperfil.png";

export default function PtelaPerfil({ aoNavegar, telaAtual }) {
  const usuario = {
    nome: "Jucelino Pinheiro",
    cargo: "Coordenador",
    email: "jucelino@senai.br",
    telefone: "(11) 98765-4321",
    local: "Senai 134",
    turmas: 3,
    alunos: 40,
    semestre: "4º semestre",
  };

  const navegar = (tela) => {
    if (typeof aoNavegar === "function") {
      aoNavegar(tela);
    }
  };

  return (
    <div className="historico-app perfil-app">
      {/* Sidebar compartilhada com Histórico */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img
            src={logo}
            alt="Logo Azyra"
            className="sidebar-logo"
          />
          <span>Azyra</span>
        </div>

        <nav
          className="sidebar-nav"
          aria-label="Navegação principal"
        >
          <button
            type="button"
            className="sidebar-link"
            onClick={() => navegar("minhas-turmas")}
          >
            <img
              src={iconeTurmas}
              alt=""
              className="sidebar-icon"
            />
            <span>Minhas Turmas</span>
          </button>

          <button
            type="button"
            className="sidebar-link"
            onClick={() => navegar("historico")}
          >
            <img
              src={iconeHistorico}
              alt=""
              className="sidebar-icon"
            />
            <span>Histórico</span>
          </button>
        </nav>

        {/* Rodapé com as mesmas classes do Histórico */}
        <button
          type="button"
          className="sidebar-footer"
          onClick={() => navegar("perfil")}
          aria-label="Abrir perfil"
        >
          <img
            src={perfilUsuario}
            alt=""
            className="sidebar-footer-avatar"
          />

          <div className="sidebar-footer-text">
            <strong>Jucelino</strong>
            <span>coordenador</span>
          </div>
        </button>
      </aside>

      {/* Conteúdo do Perfil */}
      <main className="turmas-main historico-main perfil-main">
        <header className="page-header">
          <div className="page-heading">
            <h1>Perfil</h1>
            <p>Visualize e edite suas informações</p>
          </div>
        </header>

        <section className="perfil-card">
          <div className="perfil-info">
            <img
              src={perfilUsuario}
              alt="Foto de perfil"
              className="perfil-avatar"
            />

            <div className="perfil-dados">
              <h2>{usuario.nome}</h2>
              <p className="perfil-cargo">{usuario.cargo}</p>

              <p className="perfil-dado">
                <span aria-hidden="true">✉</span>
                {usuario.email}
              </p>

              <p className="perfil-dado">
                <span aria-hidden="true">♧</span>
                {usuario.telefone}
              </p>

              <p className="perfil-dado">
                <span aria-hidden="true">♧</span>
                {usuario.local}
              </p>
            </div>
          </div>

          <div className="perfil-estatisticas">
            <div className="perfil-stat">
              <strong>{usuario.turmas}</strong>
              <span>Turmas</span>
            </div>

            <div className="perfil-stat">
              <strong>{usuario.alunos}</strong>
              <span>Alunos</span>
            </div>

            <div className="perfil-stat">
              <img
                src={iconeChapeu}
                alt=""
                className="perfil-stat-icone"
              />
              <span>{usuario.semestre}</span>
            </div>
          </div>
        </section>

        <button
          type="button"
          className="perfil-botao"
          onClick={() => navegar("editar-perfil")}
        >
          <img src={iconeEditarPerfil} alt="" />
          <span>Editar Perfil</span>
        </button>
      </main>
    </div>
  );
}
