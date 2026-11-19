
import React, { useMemo, useState } from "react";
import "../styles/ptelaMinhasTurmas.css";

import logo from "../assets/logo-footer.png";
import iconeTurmas from "../assets/minhasturmas-footer.png";
import iconeHistorico from "../assets/historico-footer.png";
import perfilUsuario from "../assets/perfil-minhasturmas.png";
import lupa from "../assets/lupa-minhasturmas.png";
import setaEsquerda from "../assets/seta-esquerda.png";
import setaDireita from "../assets/seta-direita.png";
import iconeVisualizar from "../assets/visualizar.png";

const turmasIniciais = [
  {
    id: 1,
    turma: "Desenvolvimento de Sistemas",
    modelo: "SEDUC",
    periodo: "Integral",
    horario: "08:00",
  },
  {
    id: 2,
    turma: "Rede de Computadores",
    modelo: "Comunidade",
    periodo: "Manhã",
    horario: "07:45",
  },
  {
    id: 3,
    turma: "Multimídias",
    modelo: "SEDUC",
    periodo: "Integral",
    horario: "08:00",
  },
  {
    id: 4,
    turma: "Jogos digitais",
    modelo: "Comunidade",
    periodo: "Tarde",
    horario: "14:15",
  },
  {
    id: 5,
    turma: "Programação Web",
    modelo: "SEDUC",
    periodo: "Manhã",
    horario: "08:30",
  },
  {
    id: 6,
    turma: "Banco de Dados",
    modelo: "Comunidade",
    periodo: "Tarde",
    horario: "13:30",
  },
  {
    id: 7,
    turma: "Design Digital",
    modelo: "SEDUC",
    periodo: "Integral",
    horario: "09:00",
  },
  {
    id: 8,
    turma: "Informática Básica",
    modelo: "Comunidade",
    periodo: "Manhã",
    horario: "07:45",
  },
  {
    id: 9,
    turma: "Desenvolvimento Mobile",
    modelo: "SEDUC",
    periodo: "Tarde",
    horario: "14:00",
  },
  {
    id: 10,
    turma: "Inteligência Artificial",
    modelo: "Comunidade",
    periodo: "Integral",
    horario: "08:00",
  },
];

export default function PtelaMinhasTurmas({ aoNavegar }) {
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);

  const itensPorPagina = 4;

  const turmasFiltradas = useMemo(() => {
    return turmasIniciais.filter((item) =>
      item.turma.toLowerCase().includes(busca.trim().toLowerCase())
    );
  }, [busca]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(turmasFiltradas.length / itensPorPagina)
  );

  const paginaAtual = Math.min(pagina, totalPaginas);

  const turmasExibidas = turmasFiltradas.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  function atualizarBusca(valor) {
    setBusca(valor);
    setPagina(1);
  }

 function visualizarTurma(turma) {
  aoNavegar?.("alunos", turma);
}

  return (
    <div className="historico-app turmas-app">
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
            className="sidebar-link active"
            aria-current="page"
          >
            <img
              src={iconeTurmas}
              alt=""
              className="sidebar-icon"
            />
            <span>Turmas</span>
          </a>

          <a
            href="#historico"
            className="sidebar-link"
            onClick={(event) => {
              event.preventDefault();
              aoNavegar?.("historico");
            }}
          >
            <img
              src={iconeHistorico}
              alt=""
              className="sidebar-icon"
            />
            <span>Histórico</span>
          </a>
        </nav>

        <button
          type="button"
          className="sidebar-footer"
          onClick={() => aoNavegar?.("perfil")}
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

      <main className="turmas-main" id="minhas-turmas">
        <header className="page-header">
          <div className="page-heading">
            <h1>Turmas</h1>
            <p>Gerencie as turmas da unidade</p>
          </div>
        </header>

        <section className="turmas-search-section">
          <label className="search-box turmas-search-box">
            <img src={lupa} alt="" />

            <input
              type="search"
              placeholder="Buscar por turma..."
              value={busca}
              onChange={(event) => atualizarBusca(event.target.value)}
              aria-label="Buscar por turma"
            />
          </label>
        </section>

        <section
          className="table-card turmas-table-card"
          aria-label="Lista de turmas"
        >
          <div className="table-scroll">
            <table className="turmas-table">
              <thead>
                <tr>
                  <th>Turma</th>
                  <th>Modelo de Ensino</th>
                  <th>Período</th>
                  <th>Horário</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {turmasExibidas.length > 0 ? (
                  turmasExibidas.map((item) => (
                    <tr key={item.id}>
                      <td>{item.turma}</td>
                      <td>{item.modelo}</td>
                      <td>{item.periodo}</td>
                      <td>{item.horario}</td>
                      <td>
                        <button
                          type="button"
                          className="visualizar-turma"
                          onClick={() => visualizarTurma(item)}
                          aria-label={`Visualizar ${item.turma}`}
                          title={`Visualizar ${item.turma}`}
                        >
                          <img
                            src={iconeVisualizar}
                            alt=""
                          />
                        </button>
                      </td>
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
              Mostrando {turmasExibidas.length} de{" "}
              {turmasFiltradas.length} turmas
            </span>

            <div className="pagination" aria-label="Paginação">
              <button
                type="button"
                className="pagination-arrow"
                onClick={() =>
                  setPagina((atual) => Math.max(1, atual - 1))
                }
                disabled={paginaAtual === 1}
                aria-label="Página anterior"
              >
                <img src={setaEsquerda} alt="" />
              </button>

              {Array.from(
                { length: totalPaginas },
                (_, indice) => indice + 1
              ).map((numero) => (
                <button
                  key={numero}
                  type="button"
                  className={
                    numero === paginaAtual
                      ? "pagination-current"
                      : "pagination-number"
                  }
                  onClick={() => setPagina(numero)}
                  aria-current={
                    numero === paginaAtual ? "page" : undefined
                  }
                >
                  {numero}
                </button>
              ))}

              <button
                type="button"
                className="pagination-arrow"
                onClick={() =>
                  setPagina((atual) =>
                    Math.min(totalPaginas, atual + 1)
                  )
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
