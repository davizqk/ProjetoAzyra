import React, { useMemo, useState } from "react";
import "../styles/ptelaMinhasTurmas.css";
import "../styles/ptelaAlunos.css";

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
  { id: 1, nome: "Eloysa Marques dos Santos", cpf: "012.345.678.09", turma: "Dev - SEDUC" },
  { id: 2, nome: "Livia Caires Lançoni", cpf: "012.345.678.09", turma: "Dev - SEDUC" },
  { id: 3, nome: "Amy Lee Rebeka De Souza Santos", cpf: "012.345.678.09", turma: "Dev - SEDUC" },
  { id: 4, nome: "Davi Muniz", cpf: "012.345.678.09", turma: "Dev - SEDUC" },
];

export default function PtelaAlunos({ aoNavegar }) {
  const [alunos, setAlunos] = useState(alunosIniciais);
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);

  const itensPorPagina = 4;

  const alunosFiltrados = useMemo(() => {
    return alunos.filter((item) =>
      item.nome.toLowerCase().includes(busca.trim().toLowerCase())
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
    setAlunos((atual) => atual.filter((item) => item.id !== id));
  }

  function editarAluno(aluno) {
    aoNavegar?.("editar-aluno", aluno);
  }

  return (
    <div className="historico-app turmas-app alunos-app">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={logo} alt="Logo Azyra" className="sidebar-logo" />
          <span>Azyra</span>
        </div>

        <nav className="sidebar-nav" aria-label="Navegação principal">
          <a
            href="#minhas-turmas"
            className="sidebar-link active"
            aria-current="page"
            onClick={(event) => {
              event.preventDefault();
              aoNavegar?.("minhas-turmas");
            }}
          >
            <img src={iconeTurmas} alt="" className="sidebar-icon" />
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
            <img src={iconeHistorico} alt="" className="sidebar-icon" />
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

      <main className="alunos-main">
        <header className="alunos-header">
          <button
            type="button"
            className="alunos-voltar"
            onClick={() => aoNavegar?.("minhas-turmas")}
            aria-label="Voltar para turmas"
          >
            ‹
          </button>

          <div className="alunos-titulo">
            <h1>Alunos</h1>
            <p>Gerencie os alunos da turma</p>
          </div>
        </header>

        <section className="alunos-resumo">
          <div className="alunos-resumo-card">
            <img src={iconeAlunos} alt="" />
            <strong>25 Alunos</strong>
          </div>

          <div className="alunos-resumo-card">
            <img src={iconeRelogio} alt="" />
            <div className="alunos-horario">
              <span>8:00</span>
              <strong>Horário Entrada</strong>
            </div>
          </div>
        </section>

        <section className="alunos-search-section">
          <label className="alunos-search-box">
            <img src={lupa} alt="" />
            <input
              type="search"
              placeholder="Buscar por aluno..."
              value={busca}
              onChange={(event) => atualizarBusca(event.target.value)}
              aria-label="Buscar por aluno"
            />
          </label>
        </section>

        <section className="alunos-table-card" aria-label="Lista de alunos">
          <div className="table-scroll">
            <table className="alunos-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Turma</th>
                  <th colSpan="2">Ações</th>
                </tr>
              </thead>

              <tbody>
                {alunosExibidos.length > 0 ? (
                  alunosExibidos.map((item) => (
                    <tr key={item.id}>
                      <td className="aluno-nome">{item.nome}</td>
                      <td>{item.cpf}</td>
                      <td>{item.turma}</td>
                      <td className="aluno-acao">
                        <button
                          type="button"
                          className="aluno-editar"
                          onClick={() => editarAluno(item)}
                          aria-label={`Editar ${item.nome}`}
                        >
                          <img src={iconeEditar} alt="" />
                        </button>
                      </td>
                      <td className="aluno-acao">
                        <button
                          type="button"
                          className="aluno-excluir"
                          onClick={() => excluirAluno(item.id)}
                          aria-label={`Excluir ${item.nome}`}
                        >
                          <img src={iconeExcluir} alt="" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-table">
                      Nenhum aluno encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <footer className="table-footer">
            <span>
              Mostrando {alunosExibidos.length} de {alunosFiltrados.length} alunos
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

              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                (numero) => (
                  <button
                    key={numero}
                    type="button"
                    className={
                      numero === paginaAtual
                        ? "pagination-current"
                        : "pagination-number"
                    }
                    onClick={() => setPagina(numero)}
                    aria-current={numero === paginaAtual ? "page" : undefined}
                  >
                    {numero}
                  </button>
                )
              )}

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