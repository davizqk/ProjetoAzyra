import React from "react";
import "../styles/telaPerfil.css";

// IMAGENS ORIGINAIS
import logo from "../assets/logo-footer.png";
import iconeHistorico from "../assets/historico-footer.png";
import perfilUsuario from "../assets/perfil-minhasturmas.png";
import iconeChapeu from "../assets/icon-chapeu.png";
import iconeMinhasTurmasWhite from "../assets/minhasturmaswhite-footer.png";

// ÍCONES DE CONTATO - PADRÃO GESTÃO
function Icone({ tipo }) {
  const propriedades = {
    width: 19,
    height: 19,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#4B75A5",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  return (
    <svg {...propriedades}>
      {tipo === "email" && (
        <>
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="2"
          />
          <path d="m3 7 9 6 9-6" />
        </>
      )}

      {tipo === "localizacao" && (
        <>
          <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </>
      )}
    </svg>
  );
}

export default function PtelaPerfil({
  aoNavegar,
  aoEditar,
  usuario,
  foto,
}) {
  const dados = {
    nome: usuario?.nome || "Jucelino Pinheiro",
    email: usuario?.email || "jucelino@senai.br",
    cargo: "Coordenador",
    local: "Senai 134",
    turmas: 3,
    alunos: 40,
    semestre: "4º semestre",
  };

  function navegar(tela) {
    aoNavegar?.(tela);
  }

  function editarPerfil() {
    if (aoEditar) {
      aoEditar();
    } else {
      navegar("editar-perfil");
    }
  }

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

          <button
            type="button"
            className="sidebar-link"
            onClick={() => navegar("minhas-turmas")}
          >
            <img
              src={iconeMinhasTurmasWhite}
              alt=""
              className="sidebar-icon"
            />

            <span>Turmas</span>
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

        {/* RODAPÉ DA SIDEBAR */}

        <button
          type="button"
          className="sidebar-footer"
          onClick={() => navegar("perfil")}
          aria-label="Abrir perfil"
          aria-current="page"
        >

          <img
            src={perfilUsuario}
            alt=""
            className="sidebar-footer-avatar"
          />

          <div className="sidebar-footer-text">
            <strong>{dados.nome.split(" ")[0]}</strong>
            <span>Coordenador</span>
          </div>

        </button>

      </aside>

      {/* CONTEÚDO PRINCIPAL */}

      <main className="pagina-perfil">

        {/* CABEÇALHO */}

        <header className="perfil-header">
          <h1>Perfil</h1>

          <p>Visualize e edite suas informações</p>
        </header>

        {/* CARD PRINCIPAL */}

        <section className="perfil-card">

          <div className="perfil-informacoes">

            {/* FOTO DO PERFIL */}

            <div className="perfil-foto-container">

              <img
                src={foto || perfilUsuario}
                alt="Foto do perfil"
                className="perfil-foto"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = perfilUsuario;
                }}
              />

            </div>

            {/* DADOS DO PERFIL */}

            <div className="perfil-dados">

              <div className="perfil-nome">

                <strong>{dados.nome}</strong>

                <span className="perfil-cargo">
                  {dados.cargo}
                </span>

              </div>

              {/* CONTATOS */}

              <div className="perfil-contato">

                <div className="perfil-contato-item">
                  <Icone tipo="email" />

                  <span>{dados.email}</span>
                </div>

                <div className="perfil-contato-item">
                  <Icone tipo="localizacao" />

                  <span>{dados.local}</span>
                </div>

              </div>

            </div>

          </div>

          {/* DIVISOR */}

          <div className="perfil-divisor"></div>

          {/* INDICADORES */}

          <div className="perfil-indicadores">

            <div className="perfil-indicador">

              <strong>{dados.turmas}</strong>

              <span>Turmas</span>

            </div>

            <div className="perfil-indicador">

              <strong>{dados.alunos}</strong>

              <span>Alunos</span>

            </div>

            <div className="perfil-indicador perfil-semestre">

              <img
                src={iconeChapeu}
                alt="Semestre"
              />

              <span>{dados.semestre}</span>

            </div>

          </div>

        </section>

        {/* BOTÃO EDITAR PERFIL */}

        <button
          type="button"
          className="botao-editar-perfil"
          onClick={editarPerfil}
        >
          Editar Perfil
        </button>

      </main>

    </div>
  );
}