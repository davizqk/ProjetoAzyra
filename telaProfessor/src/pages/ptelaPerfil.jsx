
import "../styles/ptelaHistorico.css";
import "../styles/ptelaPerfil.css";

import logo from "../assets/logo-footer.png";
import iconeHistorico from "../assets/historico-footer.png";
import perfilUsuario from "../assets/perfil-minhasturmas.png";
import iconeChapeu from "../assets/icon-chapeu.png";
import iconeMinhasTurmasWhite from "../assets/minhasturmaswhite-footer.png";

// Ícones dos dados do perfil
import iconeEmail from "../assets/iconeemail.png";
import iconeTelefone from "../assets/iconetelefone.png";
import iconeLocalizacao from "../assets/iconelocalizacao.png";

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

      {/* SIDEBAR */}
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

          {/* MINHAS TURMAS */}
          <button
            type="button"
            className={`sidebar-link ${
              telaAtual === "minhas-turmas" ? "active" : ""
            }`}
            onClick={() => navegar("minhas-turmas")}
          >
            <img
              src={iconeMinhasTurmasWhite}
              alt=""
              className="sidebar-icon"
            />
            <span>Turmas</span>
          </button>

          {/* HISTÓRICO */}
          <button
            type="button"
            className={`sidebar-link ${
              telaAtual === "historico" ? "active" : ""
            }`}
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

        {/* RODAPÉ DA SIDEBAR */}
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

      {/* CONTEÚDO PRINCIPAL */}
      <main className="turmas-main historico-main perfil-main">

        {/* CABEÇALHO */}
        <header className="page-header">
          <div className="page-heading">
            <h1>Perfil</h1>
            <p>Visualize e edite suas informações</p>
          </div>
        </header>

        {/* CARD DE PERFIL */}
        <section className="perfil-card">

          {/* INFORMAÇÕES DO USUÁRIO */}
          <div className="perfil-info">

            <img
              src={perfilUsuario}
              alt="Foto de perfil"
              className="perfil-avatar"
            />

            <div className="perfil-dados">

              <h2>{usuario.nome}</h2>

              <p className="perfil-cargo">
                {usuario.cargo}
              </p>

              {/* EMAIL */}
              <p className="perfil-dado">
                <img src={iconeEmail} alt="" />
                {usuario.email}
              </p>

              {/* TELEFONE */}
              <p className="perfil-dado">
                <img src={iconeTelefone} alt="" />
                {usuario.telefone}
              </p>

              {/* LOCALIZAÇÃO */}
              <p className="perfil-dado">
                <img src={iconeLocalizacao} alt="" />
                {usuario.local}
              </p>

            </div>
          </div>

          {/* ESTATÍSTICAS */}
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

        {/* BOTÃO EDITAR PERFIL */}
        <button
          type="button"
          className="perfil-botao"
          onClick={() => navegar("editar-perfil")}
        >
          <span>Editar Perfil</span>
        </button>

      </main>
    </div>
  );
}
