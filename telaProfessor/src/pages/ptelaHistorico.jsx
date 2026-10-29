import React, { useMemo, useState } from 'react';
import '../styles/ptelaHistorico.css';

import logo from '../assets/logo-footer.png';
import iconeTurmas from '../assets/minhasturmas-footer.png';
import iconeHistorico from '../assets/historico-footer-preenchido.png';
import iconePerfil from '../assets/perfil-footer.png';

import sino from '../assets/sino-minhasturmas.png';
import perfilUsuario from '../assets/perfil-minhasturmas.png';
import setaBaixo from '../assets/setabaixo.png';
import lupa from '../assets/lupa-minhasturmas.png';
import calendario from '../assets/calendar.png';
import setaEsquerda from '../assets/seta-esquerda.png';
import setaDireita from '../assets/seta-direita.png';

const registrosIniciais = [
  { id: 1, data: '02/09/2026', estudante: 'Justino', turma: '1º ano C', modelo: 'Comunidade', horario: '08:15' },
  { id: 2, data: '08/09/2026', estudante: 'James', turma: '3º ano A', modelo: 'SEDUC', horario: '08:40' },
  { id: 3, data: '11/09/2026', estudante: 'Rafael', turma: '3º ano A', modelo: 'SEDUC', horario: '08:23' },
  { id: 4, data: '19/09/2026', estudante: 'Pablo', turma: '3º ano A', modelo: 'SEDUC', horario: '08:10' },
  { id: 5, data: '21/09/2026', estudante: 'Lucas', turma: '2º ano B', modelo: 'SEDUC', horario: '08:35' },
  { id: 6, data: '22/09/2026', estudante: 'Eduardo', turma: '2º ano A', modelo: 'Comunidade', horario: '08:25' },
  { id: 7, data: '26/09/2026', estudante: 'Lucas', turma: '1º ano A', modelo: 'SEDUC', horario: '08:10' },
  { id: 8, data: '29/09/2026', estudante: 'Guilherme', turma: '1º ano C', modelo: 'Comunidade', horario: '08:20' },
  { id: 9, data: '01/10/2026', estudante: 'Mariana', turma: '2º ano A', modelo: 'Comunidade', horario: '08:12' },
  { id: 10, data: '03/10/2026', estudante: 'Pedro', turma: '3º ano A', modelo: 'SEDUC', horario: '08:30' },
  { id: 11, data: '05/10/2026', estudante: 'Ana Clara', turma: '1º ano B', modelo: 'Comunidade', horario: '08:18' },
  { id: 12, data: '09/10/2026', estudante: 'Mateus', turma: '2º ano B', modelo: 'SEDUC', horario: '08:45' },
  { id: 13, data: '12/10/2026', estudante: 'Beatriz', turma: '1º ano C', modelo: 'Comunidade', horario: '08:22' },
  { id: 14, data: '17/10/2026', estudante: 'Gabriel', turma: '3º ano A', modelo: 'SEDUC', horario: '08:38' },
  { id: 15, data: '22/10/2026', estudante: 'Laura', turma: '2º ano A', modelo: 'Comunidade', horario: '08:17' },
  { id: 16, data: '29/10/2026', estudante: 'Felipe', turma: '1º ano A', modelo: 'SEDUC', horario: '08:28' },
];

function converterData(data) {
  const [dia, mes, ano] = data.split('/');
  return new Date(Number(ano), Number(mes) - 1, Number(dia));
}

function dataParaISO(data) {
  const [dia, mes, ano] = data.split('/');
  return `${ano}-${mes}-${dia}`;
}

function isoParaData(data) {
  if (!data) return '';

  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

export default function PtelaHistorico() {
  const [dataInicial, setDataInicial] = useState('2026-09-01');
  const [dataFinal, setDataFinal] = useState('2026-10-31');
  const [turmaSelecionada, setTurmaSelecionada] = useState('Todas as turmas');
  const [buscaEstudante, setBuscaEstudante] = useState('');
  const [pagina, setPagina] = useState(1);

  const itensPorPagina = 8;

  const turmas = useMemo(
    () => [...new Set(registrosIniciais.map((registro) => registro.turma))].sort(),
    []
  );

  const registrosFiltrados = useMemo(() => {
    return registrosIniciais.filter((registro) => {
      const dataRegistro = converterData(registro.data);

      const inicio = dataInicial
        ? converterData(isoParaData(dataInicial))
        : null;

      const fim = dataFinal
        ? converterData(isoParaData(dataFinal))
        : null;

      const correspondeData =
        (!inicio || dataRegistro >= inicio) &&
        (!fim || dataRegistro <= fim);

      const correspondeTurma =
        turmaSelecionada === 'Todas as turmas' ||
        registro.turma === turmaSelecionada;

      const correspondeEstudante = registro.estudante
        .toLowerCase()
        .includes(buscaEstudante.trim().toLowerCase());

      return correspondeData && correspondeTurma && correspondeEstudante;
    });
  }, [dataInicial, dataFinal, turmaSelecionada, buscaEstudante]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(registrosFiltrados.length / itensPorPagina)
  );

  const paginaAtual = Math.min(pagina, totalPaginas);

  const registrosExibidos = registrosFiltrados.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  function alterarDataInicial(valor) {
    setDataInicial(valor);
    setPagina(1);
  }

  function alterarDataFinal(valor) {
    setDataFinal(valor);
    setPagina(1);
  }

  function alterarTurma(valor) {
    setTurmaSelecionada(valor);
    setPagina(1);
  }

  function alterarBusca(valor) {
    setBuscaEstudante(valor);
    setPagina(1);
  }

  return (
    <div className="historico-app">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img
            src={logo}
            alt="Logo Azyra"
            className="sidebar-logo"
          />
          <span>Azyra</span>
        </div>

        <nav className="sidebar-nav" aria-label="Navegação principal">
          <a
            href="#minhas-turmas"
            className="sidebar-link"
          >
            <img
              src={iconeTurmas}
              alt=""
              className="sidebar-icon sidebar-icon-turmas"
            />
            <span>Minhas Turmas</span>
          </a>

          <a
            href="#historico"
            className="sidebar-link active"
            aria-current="page"
          >
            <img
              src={iconeHistorico}
              alt=""
              className="sidebar-icon"
            />
            <span>Histórico</span>
          </a>

          <a
            href="#perfil"
            className="sidebar-link"
          >
            <img
              src={iconePerfil}
              alt=""
              className="sidebar-icon"
            />
            <span>Perfil</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <img
            src={iconePerfil}
            alt="Usuário"
            className="sidebar-footer-avatar"
          />

          <div className="sidebar-footer-text">
            <strong>Jucelino</strong>
            <span>coordenador</span>
          </div>
        </div>
      </aside>

      <main className="turmas-main historico-main" id="historico">
        <header className="page-header">
          <div className="page-heading">
            <h1>Histórico</h1>
            <p>Visualize o histórico de atrasos dos estudantes</p>
          </div>

          <div className="user-actions">
            <button
              type="button"
              className="notification-button"
              aria-label="Notificações"
            >
              <img src={sino} alt="" />
            </button>

            <div className="user-profile">
              <img
                src={perfilUsuario}
                alt="Foto de perfil"
                className="user-avatar"
              />

              <div className="user-details">
                <strong>Jucelino Pinheiro</strong>
                <span>Professor</span>
              </div>

              <button
                type="button"
                className="profile-dropdown"
                aria-label="Abrir menu do perfil"
              >
                <img src={setaBaixo} alt="" />
              </button>
            </div>
          </div>
        </header>

        <section
          className="filters historico-filters"
          aria-label="Filtros do histórico"
        >
          <div className="date-range">
            <label className="date-input-group">
              <img src={calendario} alt="" className="date-calendar-icon" />
              <input
                type="date"
                value={dataInicial}
                onChange={(event) => alterarDataInicial(event.target.value)}
                aria-label="Data inicial"
              />
            </label>

            <span className="date-separator">•</span>

            <label className="date-input-group">
              <input
                type="date"
                value={dataFinal}
                min={dataInicial || undefined}
                onChange={(event) => alterarDataFinal(event.target.value)}
                aria-label="Data final"
              />
            </label>
          </div>

          <label className="history-select-field">
            <span className="visually-hidden">Filtrar por turma</span>

            <div className="select-wrapper">
              <select
                value={turmaSelecionada}
                onChange={(event) => alterarTurma(event.target.value)}
                aria-label="Filtrar por turma"
              >
                <option value="Todas as turmas">Todas as turmas</option>

                {turmas.map((turma) => (
                  <option key={turma} value={turma}>
                    {turma}
                  </option>
                ))}
              </select>

              <img src={setaBaixo} alt="" />
            </div>
          </label>

          <label className="search-box history-search-box">
            <img src={lupa} alt="" />

            <input
              type="search"
              placeholder="Buscar estudante..."
              value={buscaEstudante}
              onChange={(event) => alterarBusca(event.target.value)}
              aria-label="Buscar estudante"
            />
          </label>
        </section>

        <section
          className="table-card history-table-card"
          aria-label="Histórico de atrasos dos estudantes"
        >
          <div className="table-scroll">
            <table className="turmas-table historico-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Estudante</th>
                  <th>Turma</th>
                  <th>Modelo de Ensino</th>
                  <th>Horário de Entrada</th>
                </tr>
              </thead>

              <tbody>
                {registrosExibidos.length > 0 ? (
                  registrosExibidos.map((registro) => (
                    <tr key={registro.id}>
                      <td>{registro.data}</td>
                      <td>{registro.estudante}</td>
                      <td>{registro.turma}</td>
                      <td>{registro.modelo}</td>
                      <td>{registro.horario}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-table">
                      Nenhum registro encontrado para os filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <footer className="table-footer">
            <span>
              Mostrando {registrosExibidos.length} de {registrosFiltrados.length} registros
            </span>

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

              {Array.from({ length: totalPaginas }, (_, indice) => indice + 1)
                .filter((numero) => {
                  return (
                    numero === 1 ||
                    numero === totalPaginas ||
                    Math.abs(numero - paginaAtual) <= 1
                  );
                })
                .map((numero) => (
                  <button
                    key={numero}
                    type="button"
                    className={
                      numero === paginaAtual
                        ? 'pagination-current'
                        : 'pagination-number'
                    }
                    onClick={() => setPagina(numero)}
                    aria-current={numero === paginaAtual ? 'page' : undefined}
                  >
                    {numero}
                  </button>
                ))}

              <button
                type="button"
                className="pagination-arrow"
                onClick={() =>
                  setPagina((atual) => Math.min(totalPaginas, atual + 1))
                }
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