
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/telaPerfil.css";

// IMAGENS
import logo from "../assets/logo-footer.png";
import perfilFooter from "../assets/perfil-footer.png";
import iconePerfil from "../assets/foto-cadastrar.png";
import semestreIcon from "../assets/semestre.png";

import casa from "../assets/casa-footer.png";
import casaAtivo from "../assets/casa-preenchido-footer.png";

import cadastrar from "../assets/cadastrar-footer.png";
import cadastrarAtivo from "../assets/cadastrar-preenchido-footer.png";

import turmas from "../assets/turmas-footer.png";
import turmasAtivo from "../assets/turmas-preenchido-footer.png";

import recorrencias from "../assets/recorrencias-footer.png";
import recorrenciasAtivo from "../assets/recorrencias-preenchido-footer.png";

// ÍCONES ORIGINAIS DE CONTATO
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
    "aria-hidden": true
  };

  return (
    <svg {...propriedades}>

      {tipo === "email" && (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
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

// DADOS PADRÃO
const dadosPadrao = {
  nome: "Jucelino",
  email: "juacelino@senai.br",
  foto: ""
};

function TelaPerfil() {
  const navigate = useNavigate();

  const [dados] = useState(() => {
    const salvos = localStorage.getItem("azyraPerfil");

    if (salvos) {
      try {
        return {
          ...dadosPadrao,
          ...JSON.parse(salvos)
        };
      } catch {
        return dadosPadrao;
      }
    }

    return dadosPadrao;
  });

  return (
    <div className="gestao-layout">

      {/* SIDEBAR */}

      <aside className="gestao-sidebar">

        <div className="sidebar-logo">
          <img src={logo} alt="Logo Azyra" />
          <span>Azyra</span>
        </div>

        <nav className="sidebar-menu">

          <NavLink to="/inicio" className="sidebar-link">
            {({ isActive }) => (
              <>
                <img src={isActive ? casaAtivo : casa} alt="" />
                <span>Início</span>
              </>
            )}
          </NavLink>

          <NavLink to="/alunos" className="sidebar-link">
            {({ isActive }) => (
              <>
                <img
                  src={isActive ? cadastrarAtivo : cadastrar}
                  alt=""
                />
                <span>Cadastrar Alunos</span>
              </>
            )}
          </NavLink>

          <NavLink to="/turmas" className="sidebar-link">
            {({ isActive }) => (
              <>
                <img
                  src={isActive ? turmasAtivo : turmas}
                  alt=""
                />
                <span>Turmas</span>
              </>
            )}
          </NavLink>

          <NavLink to="/recorrencias" className="sidebar-link">
            {({ isActive }) => (
              <>
                <img
                  src={isActive ? recorrenciasAtivo : recorrencias}
                  alt=""
                />
                <span>Recorrências</span>
              </>
            )}
          </NavLink>

        </nav>

        {/* RODAPÉ DA SIDEBAR */}

        <NavLink to="/perfil" className="sidebar-footer">

          <img
            src={perfilFooter}
            alt="Perfil"
            className="sidebar-footer-avatar"
          />

          <div className="sidebar-footer-text">
            <span>{dados.nome}</span>
            <small>Coordenador</small>
          </div>

        </NavLink>

      </aside>

      {/* CONTEÚDO PRINCIPAL */}

      <main className="pagina-perfil">

        <header className="perfil-header">
          <h1>Perfil</h1>
          <p>Visualize e edite suas informações</p>
        </header>

        {/* CARD DO PERFIL */}

        <section className="perfil-card">

          <div className="perfil-informacoes">

            <div className="perfil-foto-container">

              <img
                src={dados.foto || iconePerfil}
                alt="Foto do perfil"
                className="perfil-foto"
              />

            </div>

            <div className="perfil-dados">

              <div className="perfil-nome">

                <strong>{dados.nome}</strong>

                <span className="perfil-cargo">
                  Coordenador
                </span>

              </div>

              <div className="perfil-contato">

                <div className="perfil-contato-item">
                  <Icone tipo="email" />
                  <span>{dados.email}</span>
                </div>

                <div className="perfil-contato-item">
                  <Icone tipo="localizacao" />
                  <span>Senai 134</span>
                </div>

              </div>

            </div>

          </div>

          {/* DIVISOR */}

          <div className="perfil-divisor"></div>

          {/* INDICADORES */}

          <div className="perfil-indicadores">

            <div className="perfil-indicador">
              <strong>3</strong>
              <span>Turmas</span>
            </div>

            <div className="perfil-indicador">
              <strong>40</strong>
              <span>Alunos</span>
            </div>

            <div className="perfil-indicador perfil-semestre">
              <img src={semestreIcon} alt="Semestre" />
              <span>4º semestre</span>
            </div>

          </div>

        </section>

        {/* BOTÃO EDITAR PERFIL */}

        <button
          type="button"
          className="botao-editar-perfil"
          onClick={() => navigate("/editar-perfil")}
        >
          Editar Perfil
        </button>

      </main>

    </div>
  );
}

export default TelaPerfil;
