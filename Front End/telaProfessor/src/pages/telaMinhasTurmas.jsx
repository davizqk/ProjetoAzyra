import React, { useMemo, useState } from "react";
import "../styles/telaMinhasTurmas.css";

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
      item.turma
        .toLowerCase()
        .includes(busca.trim().toLowerCase())
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

        {/* PERFIL */}
        <button
          type="button"
          className="sidebar-footer"
          onClick={() => aoNavegar?.("perfil")}
          aria-label="Abrir perfil"
        >
          <img
            src={perfilUsuario}
            alt=""
            className="sidebar-footer-avatar"
          />

          <div className="sidebar-footer-text">
            <strong>Jucelino</strong>
            <span>Coordenador</span>
          </div>
        </button>

      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main
        className="turmas-main pagina-turmas"
        id="minhas-turmas"
      >

        {/* CABEÇALHO */}
        <header className="turmas-header">
          <h1>Turmas</h1>
          <p>Acompanhe e gerencie suas turmas.</p>
        </header>

        {/* PESQUISA */}
        <section className="turmas-acoes">

          <label className="turmas-pesquisa">

            <img
              src={lupa}
              alt=""
              className="turmas-icone-pesquisa"
            />

            <input
              type="search"
              placeholder="Buscar por turma..."
              value={busca}
              onChange={(event) =>
                atualizarBusca(event.target.value)
              }
              aria-label="Buscar por turma"
            />

          </label>

        </section>

        {/* TABELA */}
        <section
          className="turmas-tabela-container"
          aria-label="Lista de turmas"
        >

          <div className="turmas-tabela-scroll">

            <table className="turmas-tabela">

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

                      <td className="turma-nome">
                        {item.turma}
                      </td>

                      <td>
                        <span
                          className={`turma-modelo ${
                            item.modelo === "SEDUC"
                              ? "modelo-seduc"
                              : "modelo-comunidade"
                          }`}
                        >
                          {item.modelo}
                        </span>
                      </td>

                      <td>{item.periodo}</td>

                      <td>{item.horario}</td>

                      <td>
                        <button
                          type="button"
                          className="btn-visualizar-turma"
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
                    <td
                      colSpan="5"
                      className="turmas-vazio"
                    >
                      Nenhuma turma encontrada.
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

          {/* PAGINAÇÃO */}
          <footer className="turmas-paginacao">

            <span>
              Mostrando {turmasExibidas.length} de{" "}
              {turmasFiltradas.length} turmas
            </span>

            <div
              className="turmas-paginacao-botoes"
              aria-label="Paginação"
            >

              <button
                type="button"
                onClick={() =>
                  setPagina((atual) =>
                    Math.max(1, atual - 1)
                  )
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
                      ? "pagina-atual"
                      : "pagina-numero"
                  }
                  onClick={() => setPagina(numero)}
                  aria-current={
                    numero === paginaAtual
                      ? "page"
                      : undefined
                  }
                >
                  {numero}
                </button>

              ))}

              <button
                type="button"
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