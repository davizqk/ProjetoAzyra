import React, { useMemo, useState } from "react";
import "../styles/telaMinhasTurmas.css";
import "../styles/telaAlunos.css";

import logo from "../assets/logo-footer.png";
import iconeTurmas from "../assets/minhasturmas-footer.png";
import iconeHistorico from "../assets/historico-footer.png";
import perfilUsuario from "../assets/perfil-minhasturmas.png";
import lupa from "../assets/lupa-minhasturmas.png";
import setaEsquerda from "../assets/seta-esquerda.png";
import setaDireita from "../assets/seta-direita.png";

import iconeAlunos from "../assets/turmaazul.png";
import iconeRelogio from "../assets/relogioazul.png";
import iconeEditar from "../assets/lapis-editar.png";
import iconeExcluir from "../assets/lixeira-aluno.png";

const alunosIniciais = [
  {
    id: 1,
    nome: "Eloysa Marques dos Santos",
    cpf: "012.345.678.09",
    turma: "Dev - SEDUC",
  },
  {
    id: 2,
    nome: "Livia Caires Lançoni",
    cpf: "012.345.678.09",
    turma: "Dev - SEDUC",
  },
  {
    id: 3,
    nome: "Amy Lee Rebeka De Souza Santos",
    cpf: "012.345.678.09",
    turma: "Dev - SEDUC",
  },
  {
    id: 4,
    nome: "Davi Muniz",
    cpf: "012.345.678.09",
    turma: "Dev - SEDUC",
  },
];

export default function PtelaAlunos({ aoNavegar }) {
  const [alunos, setAlunos] = useState(alunosIniciais);
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);

  const itensPorPagina = 4;

  const alunosFiltrados = useMemo(() => {
    return alunos.filter((item) =>
      item.nome
        .toLowerCase()
        .includes(busca.trim().toLowerCase())
    );
  }, [alunos, busca]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(alunosFiltrados.length / itensPorPagina)
  );

  const paginaAtual = Math.min(pagina, totalPaginas);

  const alunosExibidos = alunosFiltrados.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  function atualizarBusca(valor) {
    setBusca(valor);
    setPagina(1);
  }

  function excluirAluno(id) {
    const confirmar = window.confirm(
      "Deseja realmente excluir este aluno?"
    );

    if (confirmar) {
      setAlunos((atual) =>
        atual.filter((item) => item.id !== id)
      );
      setPagina(1);
    }
  }

  function editarAluno(aluno) {
    aoNavegar?.("editar-aluno", aluno);
  }

  return (
    <div className="historico-app turmas-app alunos-app">

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
            onClick={(event) => {
              event.preventDefault();
              aoNavegar?.("minhas-turmas");
            }}
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

      <main className="alunos-main pagina-turmas">

        {/* CABEÇALHO */}

        <header className="alunos-header">

          <button
            type="button"
            className="alunos-voltar"
            onClick={() => aoNavegar?.("minhas-turmas")}
            aria-label="Voltar para turmas"
            title="Voltar para turmas"
          >
            <img src={setaEsquerda} alt="" />
          </button>

          <div className="alunos-titulo">
            <h1>Alunos</h1>
            <p>Gerencie os alunos da turma.</p>
          </div>

        </header>

        {/* CARDS DE RESUMO */}

        <section className="alunos-resumo">

          <div className="alunos-resumo-card">

            <div className="alunos-resumo-icone">
              <img src={iconeAlunos} alt="" />
            </div>

            <div className="alunos-resumo-info">
              <span>Total de alunos</span>
              <strong>{alunos.length} Alunos</strong>
            </div>

          </div>

          <div className="alunos-resumo-card">

            <div className="alunos-resumo-icone">
              <img src={iconeRelogio} alt="" />
            </div>

            <div className="alunos-resumo-info">
              <span>Horário de entrada</span>
              <strong>08:00</strong>
            </div>

          </div>

        </section>

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
              placeholder="Buscar por aluno..."
              value={busca}
              onChange={(event) =>
                atualizarBusca(event.target.value)
              }
              aria-label="Buscar por aluno"
            />

          </label>

        </section>

        {/* TABELA */}

        <section
          className="turmas-tabela-container alunos-table-card"
          aria-label="Lista de alunos"
        >

          <div className="turmas-tabela-scroll">

            <table className="alunos-table">

              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Turma</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>

                {alunosExibidos.length > 0 ? (

                  alunosExibidos.map((item) => (

                    <tr key={item.id}>

                      <td className="aluno-nome">
                        {item.nome}
                      </td>

                      <td className="aluno-cpf">
                        {item.cpf}
                      </td>

                      <td>
                        <span
                          className={`turma-modelo ${
                            item.turma.includes("SEDUC")
                              ? "modelo-seduc"
                              : "modelo-comunidade"
                          }`}
                        >
                          {item.turma}
                        </span>
                      </td>

                      <td>

                        <div className="aluno-acoes">

                          <button
                            type="button"
                            className="aluno-editar"
                            onClick={() => editarAluno(item)}
                            aria-label={`Editar ${item.nome}`}
                            title="Editar aluno"
                          >
                            <img src={iconeEditar} alt="" />
                          </button>

                          <button
                            type="button"
                            className="aluno-excluir"
                            onClick={() => excluirAluno(item.id)}
                            aria-label={`Excluir ${item.nome}`}
                            title="Excluir aluno"
                          >
                            <img src={iconeExcluir} alt="" />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>
                    <td
                      colSpan="4"
                      className="alunos-vazio"
                    >
                      Nenhum aluno encontrado.
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

          {/* PAGINAÇÃO */}

          <footer className="turmas-paginacao">

            <span>
              Mostrando {alunosExibidos.length} de{" "}
              {alunosFiltrados.length} alunos
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