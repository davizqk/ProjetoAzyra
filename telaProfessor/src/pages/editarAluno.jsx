import React, { useState } from "react";
import "../styles/ptelaMinhasTurmas.css";
import "../styles/editarAluno.css";

import logo from "../assets/logo-footer.png";
import iconeTurmas from "../assets/minhasturmas-footer.png";
import iconeHistorico from "../assets/historico-footer.png";
import perfilUsuario from "../assets/perfil-minhasturmas.png";

const opcoesTurma = [
  "Desenvolvimento de Sistemas",
  "Rede de Computadores",
  "Multimídias",
  "Jogos digitais",
  "Programação Web",
  "Banco de Dados",
  "Design Digital",
  "Informática Básica",
  "Desenvolvimento Mobile",
  "Inteligência Artificial",
];

const opcoesPeriodo = ["Integral", "Manhã", "Tarde"];

const opcoesModelo = ["SEDUC", "Comunidade"];

const alunoPadrao = {
  nome: "Eloysa Marques dos Santos",
  cpf: "012.345.678.09",
  turma: "Desenvolvimento de Sistemas",
  periodo: "Integral",
  modelo: "SEDUC",
};

export default function EditarAluno({ aoNavegar, aluno, aoSalvar }) {
  const [dados, setDados] = useState({
    nome: aluno?.nome ?? alunoPadrao.nome,
    cpf: aluno?.cpf ?? alunoPadrao.cpf,
    turma: opcoesTurma.includes(aluno?.turma)
      ? aluno.turma
      : alunoPadrao.turma,
    periodo: opcoesPeriodo.includes(aluno?.periodo)
      ? aluno.periodo
      : alunoPadrao.periodo,
    modelo: opcoesModelo.includes(aluno?.modelo)
      ? aluno.modelo
      : alunoPadrao.modelo,
  });

  function atualizarCampo(campo, valor) {
    setDados((atual) => ({ ...atual, [campo]: valor }));
  }

  function salvar(event) {
    event.preventDefault();
    aoSalvar?.({ ...aluno, ...dados });
    aoNavegar?.("alunos");
  }

  function cancelar() {
    aoNavegar?.("alunos");
  }

  return (
    <div className="historico-app turmas-app editar-app">
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

      <main className="editar-main">
        <header className="editar-header">
          <h1>Editar Aluno</h1>
          <p>Atualize as informações do aluno</p>
        </header>

        <form className="editar-card" onSubmit={salvar}>
          <div className="editar-card-header">Dados do aluno</div>

          <div className="editar-card-body">
            <div className="editar-campo">
              <label htmlFor="nome-aluno">Nome do aluno</label>
              <input
                id="nome-aluno"
                type="text"
                value={dados.nome}
                onChange={(event) => atualizarCampo("nome", event.target.value)}
                required
              />
            </div>

            <div className="editar-campo">
              <label htmlFor="cpf-aluno">CPF</label>
              <input
                id="cpf-aluno"
                type="text"
                value={dados.cpf}
                maxLength={14}
                onChange={(event) => atualizarCampo("cpf", event.target.value)}
                required
              />
            </div>

            <div className="editar-campo">
              <label htmlFor="turma-aluno">Turma</label>
              <select
                id="turma-aluno"
                value={dados.turma}
                onChange={(event) => atualizarCampo("turma", event.target.value)}
              >
                {opcoesTurma.map((turma) => (
                  <option key={turma} value={turma}>
                    {turma}
                  </option>
                ))}
              </select>
            </div>

            <div className="editar-campo">
              <label htmlFor="periodo-aluno">Período</label>
              <select
                id="periodo-aluno"
                value={dados.periodo}
                onChange={(event) =>
                  atualizarCampo("periodo", event.target.value)
                }
              >
                {opcoesPeriodo.map((periodo) => (
                  <option key={periodo} value={periodo}>
                    {periodo}
                  </option>
                ))}
              </select>
            </div>

            <div
              className="editar-campo"
              role="radiogroup"
              aria-labelledby="modelo-aluno-titulo"
            >
              <span id="modelo-aluno-titulo" className="editar-rotulo">
                Modelo de Ensino
              </span>

              <div className="editar-opcoes">
                {opcoesModelo.map((modelo) => (
                  <label
                    key={modelo}
                    className={
                      dados.modelo === modelo
                        ? "editar-opcao selecionada"
                        : "editar-opcao"
                    }
                  >
                    <input
                      type="radio"
                      name="modelo-ensino"
                      value={modelo}
                      checked={dados.modelo === modelo}
                      onChange={() => atualizarCampo("modelo", modelo)}
                    />
                    <span>{modelo}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="editar-acoes">
              <button
                type="button"
                className="editar-cancelar"
                onClick={cancelar}
              >
                Cancelar
              </button>

              <button type="submit" className="editar-salvar">
                Salvar Alterações
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}