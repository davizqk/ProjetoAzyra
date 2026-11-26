import "../styles/telaInicio.css";

import { Link } from "react-router-dom";

import logoFooter from "../assets/logo-footer.png";
import casaIcon from "../assets/casa-preenchido-footer.png";
import cadastrarIcon from "../assets/cadastrar-footer.png";
import turmasIcon from "../assets/turmas-footer.png";
import recorrenciasIcon from "../assets/recorrencias-footer.png";
import perfilIcon from "../assets/perfil-footer.png";

import alunosIcon from "../assets/alunos-inicio.png";
import relogioIcon from "../assets/relogio-inicio.png";
import alertaIcon from "../assets/alerta-inicio.png";

function TelaInicio() {
  return (
    <div className="gestao-layout">

      {/* SIDEBAR */}
      <aside className="gestao-sidebar">

        <div className="sidebar-logo">
          <img src={logoFooter} alt="Logo Azyra" />
          <span>Azyra</span>
        </div>

        {/* MENU LATERAL */}
        <nav className="sidebar-menu">

          <Link to="/inicio" className="sidebar-link ativo">
            <img src={casaIcon} alt="" />
            <span>Início</span>
          </Link>

          <Link to="/alunos" className="sidebar-link">
            <img src={cadastrarIcon} alt="" />
            <span>Cadastrar Alunos</span>
          </Link>

          <Link to="/turmas" className="sidebar-link">
            <img src={turmasIcon} alt="" />
            <span>Turmas</span>
          </Link>

          <Link to="/recorrencias" className="sidebar-link">
            <img src={recorrenciasIcon} alt="" />
            <span>Recorrências</span>
          </Link>

        </nav>

        {/* FOOTER CLICÁVEL */}
        <Link to="/perfil" className="sidebar-footer">

          <img
            src={perfilIcon}
            alt="Perfil"
            className="sidebar-footer-avatar"
          />

          <div className="sidebar-footer-text">
            <span>Jucelino</span>
            <small>Coordenador</small>
          </div>

        </Link>

      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="gestao-main">

        <header className="inicio-header">
          <h1>Início</h1>
          <p>Visão geral de frequência e atrasos</p>
        </header>

        {/* INDICADORES */}
        <section className="inicio-indicadores">

          <article className="indicador-card">
            <img src={alunosIcon} alt="" />

            <div className="indicador-info">
              <strong>248</strong>
              <span>Alunos</span>
            </div>
          </article>

          <article className="indicador-card">
            <img src={relogioIcon} alt="" />

            <div className="indicador-info">
              <strong>32</strong>
              <span>Atrasos hoje</span>
            </div>
          </article>

          <article className="indicador-card">
            <img src={alertaIcon} alt="" />

            <div className="indicador-info">
              <strong>12</strong>
              <span>Recorrências</span>
            </div>
          </article>

        </section>

        {/* ALERTAS RECENTES */}
        <section className="alertas-card">

          <div className="alertas-titulo">

            <svg
              viewBox="0 0 40 40"
              className="alertas-sino"
              aria-hidden="true"
            >
              <path
                d="M20 3.5c-2.3 0-4.1 1.8-4.1 4.1v1.1c-4.8 1.8-7.8 6.3-7.8 11.7v7.1l-3.2 3.2v2h30.2v-2l-3.2-3.2v-7.1c0-5.4-3-9.9-7.8-11.7V7.6c0-2.3-1.8-4.1-4.1-4.1Z"
                fill="currentColor"
              />

              <path
                d="M15.5 35.2c.7 2 2.4 3.2 4.5 3.2s3.8-1.2 4.5-3.2h-9Z"
                fill="currentColor"
              />
            </svg>

            <h2>Alertas Recentes</h2>

          </div>

          <div className="alerta-item">
            <img src={alertaIcon} alt="" />

            <p>
              Aluno(a) <strong>Ana Torres</strong> atingiu 3 atrasos consecutivos.
            </p>

            <time>Hoje, 09:30</time>
          </div>

          <div className="alerta-item">
            <img src={alertaIcon} alt="" />

            <p>
              Aluno(a) <strong>Carlos Souza</strong> atingiu 5 atrasos consecutivos.
            </p>

            <time>Hoje, 09:30</time>
          </div>

          <div className="alerta-item">
            <img src={alertaIcon} alt="" />

            <p>
              Aluno(a) <strong>Fernanda Silva</strong> atingiu 2 atrasos consecutivos.
            </p>

            <time>Hoje, 09:30</time>
          </div>

        </section>

      </main>

    </div>
  );
}

export default TelaInicio;
