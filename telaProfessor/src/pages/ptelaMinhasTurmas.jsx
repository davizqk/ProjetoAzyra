import React, { useState } from 'react';
import '../styles/ptelaMinhasTurmas.css';

import logo from '../assets/logo-footer.png';
import iconeTurmas from '../assets/minhasturmas-footer.png';
import iconeHistorico from '../assets/historico-footer.png';
import iconePerfil from '../assets/perfil-footer.png';

import sino from '../assets/sino-minhasturmas.png';
import perfilUsuario from '../assets/perfil-minhasturmas.png';
import setaBaixo from '../assets/setabaixo.png';
import lupa from '../assets/lupa-minhasturmas.png';
import quadrado from '../assets/quadrado.png';
import setaEsquerda from '../assets/seta-esquerda.png';
import setaDireita from '../assets/seta-direita.png';

const turmasIniciais = [
  { turma: '1º ano C', modelo: 'Comunidade', data: '02/09/2026', periodo: 'Manhã', horario: '08:15' },
  { turma: '1º ano C', modelo: 'Comunidade', data: '02/09/2026', periodo: 'Manhã', horario: '08:40' },
  { turma: '1º ano C', modelo: 'Comunidade', data: '11/09/2026', periodo: 'Manhã', horario: '08:23' },
  { turma: '3º ano A', modelo: 'Comunidade', data: '19/09/2026', periodo: 'Integral', horario: '08:10' },
  { turma: '2º ano B', modelo: 'Comunidade', data: '21/09/2026', periodo: 'Tarde', horario: '08:35' },
  { turma: '2º ano A', modelo: 'Comunidade', data: '22/09/2026', periodo: 'Integral', horario: '08:25' },
  { turma: '1º ano A', modelo: 'Comunidade', data: '26/09/2026', periodo: 'Tarde', horario: '08:10' },
  { turma: '1º ano C', modelo: 'Comunidade', data: '29/09/2026', periodo: 'Tarde', horario: '08:20' },
];

export default function PtelaMinhasTurmas() {
  const [busca, setBusca] = useState('');
  const [modelo, setModelo] = useState('Todos');
  const [periodo, setPeriodo] = useState('Todos');
  const [pagina, setPagina] = useState(1);

  const itensPorPagina = 6;

  const turmasFiltradas = turmasIniciais.filter((item) => {
    const correspondeBusca = item.turma.toLowerCase().includes(busca.toLowerCase());
    const correspondeModelo = modelo === 'Todos' || item.modelo === modelo;
    const correspondePeriodo = periodo === 'Todos' || item.periodo === periodo;

    return correspondeBusca && correspondeModelo && correspondePeriodo;
  });

  const totalPaginas = Math.max(1, Math.ceil(turmasFiltradas.length / itensPorPagina));

  const paginaAtual = Math.min(pagina, totalPaginas);

  const turmasExibidas = turmasFiltradas.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  function alterarBusca(valor) {
    setBusca(valor);
    setPagina(1);
  }

  function alterarModelo(valor) {
    setModelo(valor);
    setPagina(1);
  }

  function alterarPeriodo(valor) {
    setPeriodo(valor);
    setPagina(1);
  }

  return (
    <div className="turmas-app">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={logo} alt="Logo Azyra" className="sidebar-logo" />
          <span>Azyra</span>
        </div>

        <nav className="sidebar-nav">
          <a href="#minhas-turmas" className="sidebar-link active">
            <img src={iconeTurmas} alt="" className="sidebar-icon" />
            <span>Minhas Turmas</span>
          </a>

          <a href="#historico" className="sidebar-link">
            <img src={iconeHistorico} alt="" className="sidebar-icon" />
            <span>Histórico</span>
          </a>

          <a href="#perfil" className="sidebar-link">
            <img src={iconePerfil} alt="" className="sidebar-icon" />
            <span>Perfil</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <img src={iconePerfil} alt="Usuário" className="sidebar-footer-avatar" />
          <div className="sidebar-footer-text">
            <strong>Jucelino</strong>
            <span>coordenador</span>
          </div>
        </div>
      </aside>

      <main className="turmas-main" id="minhas-turmas">
        <header className="page-header">
          <div className="page-heading">
            <h1>Minhas Turmas</h1>
            <p>Confira as turmas que você ministra e seus horários</p>
          </div>

          <div className="user-actions">
            <button type="button" className="notification-button" aria-label="Notificações">
              <img src={sino} alt="" />
            </button>

            <div className="user-profile">
              <img src={perfilUsuario} alt="Foto de perfil" className="user-avatar" />

              <div className="user-details">
                <strong>Jucelino Pinheiro</strong>
                <span>Professor</span>
              </div>

              <button type="button" className="profile-dropdown" aria-label="Abrir menu do perfil">
           
              </button>
            </div>
          </div>
        </header>

        <section className="filters" aria-label="Filtros das turmas">
          <label className="search-box">
            <img src={lupa} alt="" />
            <input
              type="search"
              placeholder="Todas as turmas"
              value={busca}
              onChange={(event) => alterarBusca(event.target.value)}
              aria-label="Pesquisar turma"
            />
          </label>

          <label className="filter-field">
            <span>Modelo de ensino</span>
            <div className="select-wrapper">
              <select value={modelo} onChange={(event) => alterarModelo(event.target.value)}>
                <option value="Todos">Todos</option>
                <option value="Comunidade">Comunidade</option>
              </select>
              <img src={setaBaixo} alt="" />
            </div>
          </label>

          <label className="filter-field">
            <span>Período</span>
            <div className="select-wrapper">
              <select value={periodo} onChange={(event) => alterarPeriodo(event.target.value)}>
                <option value="Todos">Todos</option>
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
                <option value="Integral">Integral</option>
              </select>
              <img src={setaBaixo} alt="" />
            </div>
          </label>
        </section>

        <section className="table-card" aria-label="Lista de turmas">
          <div className="table-scroll">
            <table className="turmas-table">
              <thead>
                <tr>
                  <th>Turma</th>
                  <th>Modelo de Ensino</th>
                  <th>Data</th>
                  <th>Período</th>
                  <th>Horário de Entrada</th>
                </tr>
              </thead>

              <tbody>
                {turmasExibidas.length > 0 ? (
                  turmasExibidas.map((item, index) => (
                    <tr key={`${item.turma}-${item.data}-${index}`}>
                      <td>{item.turma}</td>
                      <td>{item.modelo}</td>
                      <td>{item.data}</td>
                      <td>{item.periodo}</td>
                      <td>{item.horario}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-table">
                      Nenhuma turma encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <footer className="table-footer">
            <span>
              Mostrando {turmasExibidas.length} de {turmasFiltradas.length} turmas
            </span>

            <div className="pagination">
              <button
                type="button"
                className="pagination-arrow"
                onClick={() => setPagina((atual) => Math.max(1, atual - 1))}
                disabled={paginaAtual === 1}
                aria-label="Página anterior"
              >
                <img src={setaEsquerda} alt="" />
              </button>

              <button type="button" className="pagination-current" aria-current="page">
                {paginaAtual}
              </button>

              <button
                type="button"
                className="pagination-arrow"
                onClick={() => setPagina((atual) => Math.min(totalPaginas, atual + 1))}
                disabled={paginaAtual === totalPaginas}
                aria-label="Próxima página"
              >
                <img src={setaDireita} alt="" />
              </button>

              <img src={quadrado} alt="" className="pagination-decoration" />
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}