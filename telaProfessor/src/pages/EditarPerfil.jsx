import React, { useState } from 'react';
import '../styles/EditarPerfil.css';

import logo from '../assets/logo-footer.png';
import iconeTurmas from '../assets/minhasturmas-footer.png';
import iconeHistorico from '../assets/historico-footer.png';
import iconePerfilPreenchido from '../assets/perfil-footer-preenchido.png';
import perfilUsuario from '../assets/perfil-minhasturmas.png';
import iconeRodape from '../assets/perfil-footer.png';

export default function EditarPerfil({ aoNavegar, usuario, foto, aoSalvar }) {
  const [nome, setNome] = useState(usuario?.nome || 'Jucelino Pinheiro');
  const [email, setEmail] = useState(usuario?.email || 'jucelino@senai.br');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (novaSenha && novaSenha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }
    aoSalvar({ nome, email, foto });
  }

  return (
    <div className="editar-perfil-app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={logo} alt="Logo Azyra" className="sidebar-logo" />
          <span>Azyra</span>
        </div>

        <nav className="sidebar-nav" aria-label="Navegação principal">
          <button
            type="button"
            className="sidebar-link"
            onClick={() => aoNavegar('minhas-turmas')}
          >
            <img
              src={iconeTurmas}
              alt=""
              className="sidebar-icon sidebar-icon-turmas"
            />
            <span>Minhas Turmas</span>
          </button>

          <button
            type="button"
            className="sidebar-link"
            onClick={() => aoNavegar('historico')}
          >
            <img src={iconeHistorico} alt="" className="sidebar-icon" />
            <span>Histórico</span>
          </button>

          <button
            type="button"
            className="sidebar-link active"
            onClick={() => aoNavegar('perfil')}
            aria-current="page"
          >
            <img src={iconePerfilPreenchido} alt="" className="sidebar-icon" />
            <span>Perfil</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <img src={iconeRodape} alt="" className="sidebar-footer-icone" />
          <div className="sidebar-footer-text">
            <strong>{nome.split(' ')[0]}</strong>
            <span>coordenador</span>
          </div>
        </div>
      </aside>

      {/* Conteúdo */}
      <main className="editar-perfil-main" id="editar-perfil">
        <form onSubmit={handleSubmit} className="editar-perfil-form-wrapper">
          <section className="editar-perfil-content-card">
            <div className="editar-perfil-topo">
              <img
                src={foto || perfilUsuario}
                alt="Avatar do usuário"
                className="editar-perfil-avatar"
              />
              <button type="button" className="botao-alterar-foto">
                Alterar foto
              </button>
            </div>

            <div className="editar-perfil-campos">
              <div className="campo-grupo">
                <label htmlFor="nome">Nome Completo</label>
                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div className="campo-grupo">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="campo-grupo">
                <label htmlFor="nova-senha">Nova senha (opcional)</label>
                <input
                  id="nova-senha"
                  type="password"
                  placeholder="Digite sua nova senha"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                />
              </div>

              <div className="campo-grupo">
                <label htmlFor="confirmar-senha">Confirmar nova senha</label>
                <input
                  id="confirmar-senha"
                  type="password"
                  placeholder="Confirmar sua nova senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />
              </div>
            </div>
          </section>

          <div className="editar-perfil-acoes">
            <button
              type="button"
              className="botao-cancelar"
              onClick={() => aoNavegar('perfil')}
            >
              Cancelar
            </button>
            <button type="submit" className="botao-salvar">
              Salvar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}