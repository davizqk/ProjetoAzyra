import React, { useMemo, useState } from 'react';
import '../styles/ptelaHistorico.css';

import logo from '../assets/logo-footer.png';
import iconeTurmas from '../assets/minhasturmas-footer.png';
import iconeHistorico from '../assets/historico-footer-preenchido.png';
import iconePerfil from '../assets/perfil-footer.png';
import perfilUsuario from '../assets/perfil-minhasturmas.png';
import setaBaixo from '../assets/setabaixo.png';
import lupa from '../assets/lupa-minhasturmas.png';
import setaEsquerda from '../assets/seta-esquerda.png';
import setaDireita from '../assets/seta-direita.png';

const registrosIniciais = [
  { id: 1, estudante: 'Pedro', modelo: 'Comunidade', turma: 'Jogos Digitais', data: '02/09/2026', horario: '08:15' },
  { id: 2, estudante: 'Pedro', modelo: 'Comunidade', turma: 'Jogos Digitais', data: '02/09/2026', horario: '08:40' },
  { id: 3, estudante: 'Pedro', modelo: 'Comunidade', turma: 'Jogos Digitais', data: '02/09/2026', horario: '08:23' },
  { id: 4, estudante: 'Pedro', modelo: 'Comunidade', turma: 'Jogos Digitais', data: '02/09/2026', horario: '08:10' },
  { id: 5, estudante: 'Pedro', modelo: 'Comunidade', turma: 'Jogos Digitais', data: '02/09/2026', horario: '08:35' },
  { id: 6, estudante: 'Pedro', modelo: 'Comunidade', turma: 'Jogos Digitais', data: '02/09/2026', horario: '08:25' },
  { id: 7, estudante: 'Pedro', modelo: 'Comunidade', turma: 'Jogos Digitais', data: '02/09/2026', horario: '08:10' },
  { id: 8, estudante: 'Pedro', modelo: 'Comunidade', turma: 'Jogos Digitais', data: '02/09/2026', horario: '08:20' },
];

export default function PtelaHistorico({ aoNavegar, telaAtual }) {
  const [busca, setBusca] = useState('');
  const [modeloSelecionado, setModeloSelecionado] = useState('Todos');
  const [periodoSelecionado, setPeriodoSelecionado] = useState('Todos');
  const [pagina, setPagina] = useState(1);
  const itensPorPagina = 8;

  const registrosFiltrados = useMemo(() => registrosIniciais.filter((registro) => {
    const correspondeBusca = `${registro.estudante} ${registro.turma} ${registro.modelo}`
      .toLowerCase().includes(busca.trim().toLowerCase());
    const correspondeModelo = modeloSelecionado === 'Todos' || registro.modelo === modeloSelecionado;
    const correspondePeriodo = periodoSelecionado === 'Todos' || registro.data === periodoSelecionado;
    return correspondeBusca && correspondeModelo && correspondePeriodo;
  }), [busca, modeloSelecionado, periodoSelecionado]);

  const totalPaginas = Math.max(1, Math.ceil(registrosFiltrados.length / itensPorPagina));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const registrosExibidos = registrosFiltrados.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina);

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
          <a href="#minhas-turmas" className="sidebar-link">
            <img src={iconeTurmas} alt="" className="sidebar-icon sidebar-icon-turmas" />
            <span>Minhas Turmas</span>
          </a>
          <a href="#historico" className="sidebar-link active" aria-current="page">
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

      <main className="turmas-main historico-main" id="historico">
        <header className="page-header">
          <div className="page-heading">
            <h1>Histórico</h1>
            <p>Confira as turmas que você ministra e seus horários</p>
          </div>
        </header>

        <section className="filters historico-filters" aria-label="Filtros do histórico">
          <label className="search-box history-search-box">
            <img src={lupa} alt="" />
            <input
              type="search"
              placeholder="Nome do estudante"
              value={busca}
              onChange={(event) => atualizarFiltro(setBusca, event.target.value)}
              aria-label="Buscar turma ou estudante"
            />
          </label>
        </section>

        <section className="table-card history-table-card" aria-label="Histórico de turmas">
          <div className="table-scroll">
            <table className="turmas-table historico-table">
              <thead>
                <tr>
                  <th>Estudante</th>
                  <th>Modelo de Ensino</th>
                  <th>Turma</th>
                  <th>Data</th>
                  <th>Horário de Entrada</th>
                </tr>
              </thead>
              <tbody>
                {registrosExibidos.length > 0 ? registrosExibidos.map((registro) => (
                  <tr key={registro.id}>
                    <td>{registro.estudante}</td>
                    <td>{registro.modelo}</td>
                    <td>{registro.turma}</td>
                    <td>{registro.data}</td>
                    <td>{registro.horario}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="empty-table">Nenhum registro encontrado para os filtros selecionados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <footer className="table-footer">
            <span>Mostrando {registrosExibidos.length} de {registrosFiltrados.length} turmas</span>
            <div className="pagination" aria-label="Paginação">
              <button type="button" className="pagination-arrow" onClick={() => setPagina((atual) => Math.max(1, atual - 1))} disabled={paginaAtual === 1} aria-label="Página anterior">
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
              <button type="button" className="pagination-arrow" onClick={() => setPagina((atual) => Math.min(totalPaginas, atual + 1))} disabled={paginaAtual === totalPaginas} aria-label="Próxima página">
                <img src={setaDireita} alt="" />
              </button>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}