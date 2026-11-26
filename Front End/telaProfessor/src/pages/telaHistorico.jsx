
import React, { useMemo, useState } from "react";

import "../styles/telaMinhasTurmas.css";
import "../styles/telaHistorico.css";

import logo from "../assets/logo-footer.png";
import iconeTurmas from "../assets/minhasturmas-footer.png";
import iconeHistorico from "../assets/historico-footer-preenchido.png";
import perfilUsuario from "../assets/perfil-minhasturmas.png";
import lupa from "../assets/lupa-minhasturmas.png";
import setaEsquerda from "../assets/seta-esquerda.png";
import setaDireita from "../assets/seta-direita.png";

const registrosIniciais = [
  {
    id: 1,
    estudante: "Pedro",
    turma: "Jogos Digitais",
    data: "02/09/2026",
    horario: "08:15",
  },
  {
    id: 2,
    estudante: "Pedro",
    turma: "Jogos Digitais",
    data: "02/09/2026",
    horario: "08:40",
  },
  {
    id: 3,
    estudante: "Pedro",
    turma: "Jogos Digitais",
    data: "02/09/2026",
    horario: "08:23",
  },
  {
    id: 4,
    estudante: "Pedro",
    turma: "Jogos Digitais",
    data: "02/09/2026",
    horario: "08:10",
  },
  {
    id: 5,
    estudante: "Pedro",
    turma: "Jogos Digitais",
    data: "02/09/2026",
    horario: "08:35",
  },
  {
    id: 6,
    estudante: "Pedro",
    turma: "Jogos Digitais",
    data: "02/09/2026",
    horario: "08:25",
  },
  {
    id: 7,
    estudante: "Pedro",
    turma: "Jogos Digitais",
    data: "02/09/2026",
    horario: "08:10",
  },
  {
    id: 8,
    estudante: "Pedro",
    turma: "Jogos Digitais",
    data: "02/09/2026",
    horario: "08:20",
  },
];

export default function PtelaHistorico({ aoNavegar }) {
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);

  const itensPorPagina = 8;

  const registrosFiltrados = useMemo(() => {
    return registrosIniciais.filter((registro) =>
      `${registro.estudante} ${registro.turma}`
        .toLowerCase()
        .includes(busca.trim().toLowerCase())
    );
  }, [busca]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(registrosFiltrados.length / itensPorPagina)
  );

  const paginaAtual = Math.min(pagina, totalPaginas);

  const registrosExibidos = registrosFiltrados.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  function atualizarBusca(valor) {
    setBusca(valor);
    setPagina(1);
  }

  return (
    <div className="historico-app turmas-app historico-professor-app">

      {/* SIDEBAR ORIGINAL */}

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
            className="sidebar-link"
            onClick={(event) => {
              event.preventDefault();
              aoNavegar?.("minhas-turmas");
            }}
          >
            <img
              src={iconeTurmas}
              alt=""
              className="sidebar-icon sidebar-icon-turmas"
            />

            <span>Turmas</span>
          </a>

          <a
            href="#historico"
            className="sidebar-link active"
            aria-current="page"
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

        {/* PERFIL ORIGINAL */}

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
            <span>Coordenador</span>
          </div>

        </button>

      </aside>

      {/* CONTEÚDO PRINCIPAL */}

      <main className="historico-professor-main">

        {/* CABEÇALHO */}

        <header className="historico-professor-header">

          <h1>Histórico</h1>

          <p>
            Acompanhe os registros de entrada dos alunos
            das suas turmas.
          </p>

        </header>

        {/* PESQUISA */}

        <section
          className="historico-professor-filtros"
          aria-label="Filtros do histórico"
        >

          <label className="historico-professor-pesquisa">

            <img src={lupa} alt="" />

            <input
              type="search"
              placeholder="Buscar por estudante..."
              value={busca}
              onChange={(event) =>
                atualizarBusca(event.target.value)
              }
              aria-label="Buscar estudante ou turma"
            />

          </label>

        </section>

        {/* TABELA */}

        <section
          className="historico-professor-card"
          aria-label="Histórico de entrada dos alunos"
        >

          <div className="historico-professor-scroll">

            <table className="historico-professor-tabela">

              <thead>
                <tr>
                  <th>Estudante</th>
                  <th>Turma</th>
                  <th>Data</th>
                  <th>Horário de Entrada</th>
                </tr>
              </thead>

              <tbody>

                {registrosExibidos.length > 0 ? (

                  registrosExibidos.map((registro) => (

                    <tr key={registro.id}>

                      <td className="historico-estudante">
                        {registro.estudante}
                      </td>

                      <td>{registro.turma}</td>

                      <td>{registro.data}</td>

                      <td className="historico-horario">
                        {registro.horario}
                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>
                    <td
                      colSpan={4}
                      className="historico-vazio"
                    >
                      Nenhum registro encontrado.
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

          {/* RODAPÉ DA TABELA */}

          <footer className="historico-professor-rodape">

            <span>
              Mostrando {registrosExibidos.length} de{" "}
              {registrosFiltrados.length} registros
            </span>

            <div
              className="historico-professor-paginacao"
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
                      ? "historico-pagina-atual"
                      : ""
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
