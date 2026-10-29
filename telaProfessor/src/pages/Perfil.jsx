import React from 'react';
import '../styles/Perfil.css';

import logo from '../assets/logo-footer.png';
import iconeTurmas from '../assets/minhasturmas-footer.png';
import iconeHistorico from '../assets/historico-footer.png';
import iconePerfilPreenchido from '../assets/perfil-footer-preenchido.png';
import perfilUsuario from '../assets/perfil-minhasturmas.png';
import iconeCapelo from '../assets/icon-chapeu.png';

export default function Perfil({ aoNavegar, usuario, foto }) {
  return (
    <div className="perfil-app">
      {/* Sidebar Lateral */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={logo} alt="Logo Azyra" className="sidebar-logo" />
          <span>Azyra</span>
        </div>

        <nav className="sidebar-nav" aria-label="Navegação principal">
          <button 
            type="button" 
            className="sidebar-link" 
            onClick={() => aoNavegar("minhas-turmas")}
            style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}
          >
            <img src={iconeTurmas} alt="" className="sidebar-icon sidebar-icon-turmas" />
            <span>Minhas Turmas</span>
          </button>

          <button 
            type="button" 
            className="sidebar-link" 
            onClick={() => aoNavegar("historico")}
            style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}
          >
            <img src={iconeHistorico} alt="" className="sidebar-icon" />
            <span>Histórico</span>
          </button>

          <button 
            type="button" 
            className="sidebar-link active" 
            onClick={() => aoNavegar("perfil")}
            aria-current="page"
            style={{ background: '#ffffff', color: '#4871A0', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}
          >
            <img src={iconePerfilPreenchido} alt="" className="sidebar-icon" />
            <span>Perfil</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <img src={foto || perfilUsuario} alt="Usuário" className="sidebar-footer-avatar" />
          <div className="sidebar-footer-text">
            <strong>{usuario?.nome ? usuario.nome.split(" ")[0] : "Jucelino"}</strong>
            <span>coordenador</span>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="turmas-main perfil-main" id="perfil">
        <header className="page-header">
          <div className="page-heading">
            <h1>Perfil</h1>
            <p>Visualize e edite suas informações</p>
          </div>
        </header>

        {/* Card de Informações do Perfil */}
        <section className="perfil-content-card">
          <div className="perfil-info-topo">
            <div className="perfil-avatar-container">
              <img src={foto || perfilUsuario} alt="Foto de Perfil Grande" className="perfil-avatar-grande" />
              <button 
                className="perfil-botao-camera" 
                aria-label="Alterar foto de perfil"
                onClick={() => aoNavegar("editar-perfil")}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </button>
            </div>

            <div className="perfil-dados-texto">
              <h2>{usuario?.nome || "Jucelino Pinheiro"}</h2>
              <span className="perfil-cargo">Coordenador</span>

              <ul className="perfil-lista-contato">
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  {usuario?.email || "jucelino@senai.br"}
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  (11) 98765-4321
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  Senai 134
                </li>
              </ul>
            </div>
          </div>

          {/* Cards de Estatísticas */}
          <div className="perfil-estatisticas">
            <div className="perfil-stat-card">
              <span className="stat-numero">3</span>
              <span className="stat-titulo">Turmas</span>
            </div>

            <div className="perfil-stat-card">
              <span className="stat-numero">40</span>
              <span className="stat-titulo">Alunos</span>
            </div>

            <div className="perfil-stat-card">
              <div className="stat-icone-wrapper">
                <img src={iconeCapelo} alt="Chapéu de formatura" className="stat-icone-figma" />
              </div>
              <span className="stat-titulo">4º semestre</span>
            </div>
          </div>
        </section>

        {/* Botão Inferior de Editar Perfil */}
        <div className="perfil-footer-acao">
          <button 
            type="button" 
            className="botao-editar-perfil" 
            onClick={() => aoNavegar("editar-perfil")}
          >
            Editar Perfil
          </button>
        </div>
      </main>
    </div>
  );
}