import React, { useMemo, useState } from 'react';
import '../styles/ptelaMinhasTurmas.css';

import logo from '../assets/logo-footer.png';
import iconeTurmas from '../assets/minhasturmas-footer.png';
import iconeHistorico from '../assets/historico-footer.png';
import iconePerfil from '../assets/perfil-footer.png';
import perfilUsuario from '../assets/perfil-minhasturmas.png';
import setaBaixo from '../assets/setabaixo.png';
import lupa from '../assets/lupa-minhasturmas.png';
import setaEsquerda from '../assets/seta-esquerda.png';
import setaDireita from '../assets/seta-direita.png';

const turmasIniciais = [
  { turma: 'Jogos Digitais', modelo: 'Comunidade', data: '02/09/2026', periodo: 'Manhã', horario: '08:15' },
  { turma: '1º ano C', modelo: 'Comunidade', data: '02/09/2026', periodo: 'Manhã', horario: '08:40' },
  { turma: '1º ano C', modelo: 'Comunidade', data: '11/09/2026', periodo: 'Manhã', horario: '08:23' },
  { turma: '3º ano A', modelo: 'Comunidade', data: '19/09/2026', periodo: 'Integral', horario: '08:10' },
  { turma: '2º ano B', modelo: 'Comunidade', data: '21/09/2026', periodo: 'Tarde', horario: '08:35' },
  { turma: '2º ano A', modelo: 'Comunidade', data: '22/09/2026', periodo: 'Integral', horario: '08:25' },
  { turma: '1º ano A', modelo: 'Comunidade', data: '26/09/2026', periodo: 'Tarde', horario: '08:10' },
  { turma: '1º ano C', modelo: 'Comunidade', data: '29/09/2026', periodo: 'Tarde', horario: '08:20' },
];

export default function PtelaMinhasTurmas({ aoNavegar, telaAtual }) {
  const [busca, setBusca] = useState('');
  const [modelo, setModelo] = useState('Todos');
  const [periodo, setPeriodo] = useState('Todos');
  const [pagina, setPagina] = useState(1);
  const itensPorPagina = 6;

  const turmasFiltradas = useMemo(
    () =>
      turmasIniciais.filter((item) => {
        const correspondeBusca = item.turma.toLowerCase().includes(busca.trim().toLowerCase());
        const correspondeModelo = modelo === 'Todos' || item.modelo === modelo;
        const correspondePeriodo = periodo === 'Todos' || item.periodo === periodo;
        return correspondeBusca && correspondeModelo && correspondePeriodo;
      }),
    [busca, modelo, periodo]
  );

  const totalPaginas = Math.max(1, Math.ceil(turmasFiltradas.length / itensPorPagina));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const turmasExibidas = turmasFiltradas.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  function atualizarFiltro(setter, valor) {
    setter(valor);
    setPagina(1);
  }

  return (
    <div className="historico-app">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={logo} alt="Logo Azyra" className="sidebar-logo" />
          <span>Azyra</span>
        </div>

        <nav className="sidebar-nav" aria-label="Navegação principal">
          <a href="#minhas-turmas" className="sidebar-link active" aria-current="page">
            <img src={iconeTurmas} alt="" className="sidebar-icon" />
            <span>Minhas Turmas</span>
          </a>
          <a href="#historico" className="sidebar-link">
            <img src={iconeHistorico} alt="" className="sidebar-icon" />
            <span>Histórico</span>
          </a>
        </nav>

        <button
  type="button"
  className="sidebar-footer"
  onClick={() => aoNavegar("perfil")}
  aria-label="Abrir perfil do coordenador"
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

      <main className="turmas-main historico-main" id="minhas-turmas">
        <header className="page-header">
          <div className="page-heading">
            <h1>Minhas Turmas</h1>
            <p>Confira as turmas que você ministra e seus horários</p>
          </div>
        </header>

        <section className="filters historico-filters" aria-label="Filtros das turmas">
          <label className="search-box history-search-box">
            <img src={lupa} alt="" />
            <input
              type="search"
              placeholder="Insira a turma"
              value={busca}
              onChange={(event) => atualizarFiltro(setBusca, event.target.value)}
              aria-label="Pesquisar turma"
            />
          </label>

          <label className="history-select-field">
            <span>Modelo de ensino</span>
            <div className="select-wrapper">
              <select
                value={modelo}
                onChange={(event) => atualizarFiltro(setModelo, event.target.value)}
                aria-label="Filtrar por modelo de ensino"
              >
                <option value="Todos">Todos</option>
                <option value="Comunidade">Comunidade</option>
                <option value="Comunidade">SEDUC</option> 
              </select>
              <img src={setaBaixo} alt="" />
            </div>
          </label>

          <label className="history-select-field">
            <span>Período</span>
            <div className="select-wrapper">
              <select
                value={periodo}
                onChange={(event) => atualizarFiltro(setPeriodo, event.target.value)}
                aria-label="Filtrar por período"
              >
                <option value="Todos">Todos</option>
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
                <option value="Integral">Integral</option>
              </select>
              <img src={setaBaixo} alt="" />
            </div>
          </label>
        </section>

        <section className="table-card history-table-card" aria-label="Lista de turmas">
          <div className="table-scroll">
            <table className="turmas-table historico-table">
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
                    <tr key={`${item.turma}-${item.data}-${item.horario}-${index}`}>
                      <td>{item.turma}</td>
                      <td>{item.modelo}</td>
                      <td>{item.data}</td>
                      <td>{item.periodo}</td>
                      <td>{item.horario}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-table">Nenhuma turma encontrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <footer className="table-footer">
            <span>Mostrando {turmasExibidas.length} de {turmasFiltradas.length} turmas</span>

            <div className="pagination" aria-label="Paginação">
              <button
                type="button"
                className="pagination-arrow"
                onClick={() => setPagina((atual) => Math.max(1, atual - 1))}
                disabled={paginaAtual === 1}
                aria-label="Página anterior"
              >
                <img src={setaEsquerda} alt="" />
              </button>

              {Array.from({ length: totalPaginas }, (_, indice) => indice + 1).map((numero) => (
                <button
                  key={numero}
                  type="button"
                  className={numero === paginaAtual ? 'pagination-current' : 'pagination-number'}
                  onClick={() => setPagina(numero)}
                  aria-current={numero === paginaAtual ? 'page' : undefined}
                >
                  {numero}
                </button>
              ))}

              <button
                type="button"
                className="pagination-arrow"
                onClick={() => setPagina((atual) => Math.min(totalPaginas, atual + 1))}
                disabled={paginaAtual === totalPaginas}
                aria-label="Próxima página"
              >
                <img src={setaDireita} alt="" />
              </button>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}