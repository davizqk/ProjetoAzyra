import React, { useState } from "react";

import "../styles/telaMinhasTurmas.css";
import "../styles/telaEditarAluno.css";

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

export default function EditarAluno({
  aoNavegar,
  aluno,
  aoSalvar,
}) {
  const [dados, setDados] = useState({
    nome: aluno?.nome ?? "",
    cpf: aluno?.cpf ?? "",
    turma:
      aluno?.turma === "Dev - SEDUC"
        ? "Desenvolvimento de Sistemas"
        : aluno?.turma ?? "",
    periodo: aluno?.periodo ?? "Integral",
    modelo: aluno?.modelo ?? "SEDUC",
  });

  function atualizarCampo(campo, valor) {
    setDados((atual) => ({
      ...atual,
      [campo]: valor,
    }));
  }

  function salvar(event) {
    event.preventDefault();

    aoSalvar?.({
      ...aluno,
      ...dados,
    });

    aoNavegar?.("alunos");
  }

  function cancelar() {
    aoNavegar?.("alunos");
  }

  return (
    <div className="historico-app turmas-app editar-aluno-app">

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
            className="sidebar-link active"
            aria-current="page"
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

      <main className="editar-aluno-main">

        <form
          className="editar-aluno-form"
          onSubmit={salvar}
        >

          {/* CARD BRANCO */}

          <section className="editar-aluno-card">

            {/* TÍTULO DENTRO DO CARD */}

            <div className="editar-aluno-cabecalho">

              <h1>Editar Aluno</h1>

              <p>Atualize as informações do aluno.</p>

            </div>

            {/* CAMPOS */}

            <div className="editar-aluno-grid">

              <div className="editar-aluno-campo">

                <label htmlFor="nome-aluno">
                  Nome do Aluno
                </label>

                <input
                  id="nome-aluno"
                  type="text"
                  value={dados.nome}
                  onChange={(event) =>
                    atualizarCampo(
                      "nome",
                      event.target.value
                    )
                  }
                  required
                />

              </div>

              <div className="editar-aluno-campo">

                <label htmlFor="cpf-aluno">
                  CPF
                </label>

                <input
                  id="cpf-aluno"
                  type="text"
                  maxLength={14}
                  value={dados.cpf}
                  onChange={(event) =>
                    atualizarCampo(
                      "cpf",
                      event.target.value
                    )
                  }
                  required
                />

              </div>

              <div className="editar-aluno-campo">

                <label htmlFor="turma-aluno">
                  Turma
                </label>

                <select
                  id="turma-aluno"
                  value={dados.turma}
                  onChange={(event) =>
                    atualizarCampo(
                      "turma",
                      event.target.value
                    )
                  }
                  required
                >

                  <option value="" disabled>
                    Selecione a turma
                  </option>

                  {opcoesTurma.map((turma) => (
                    <option key={turma} value={turma}>
                      {turma}
                    </option>
                  ))}

                </select>

              </div>

              <div className="editar-aluno-campo">

                <label htmlFor="periodo-aluno">
                  Período
                </label>

                <select
                  id="periodo-aluno"
                  value={dados.periodo}
                  onChange={(event) =>
                    atualizarCampo(
                      "periodo",
                      event.target.value
                    )
                  }
                >

                  {opcoesPeriodo.map((periodo) => (
                    <option
                      key={periodo}
                      value={periodo}
                    >
                      {periodo}
                    </option>
                  ))}

                </select>

              </div>

              {/* MODELO DE ENSINO */}

              <div className="editar-aluno-modelo">

                <span
                  className="editar-aluno-rotulo"
                  id="modelo-aluno-titulo"
                >
                  Modelo de Ensino
                </span>

                <div
                  className="editar-aluno-opcoes"
                  role="radiogroup"
                  aria-labelledby="modelo-aluno-titulo"
                >

                  {opcoesModelo.map((modelo) => (

                    <label
                      key={modelo}
                      className={`editar-aluno-opcao ${
                        dados.modelo === modelo
                          ? "selecionada"
                          : ""
                      }`}
                    >

                      <input
                        type="radio"
                        name="modelo-ensino"
                        value={modelo}
                        checked={dados.modelo === modelo}
                        onChange={() =>
                          atualizarCampo("modelo", modelo)
                        }
                      />

                      <span>{modelo}</span>

                    </label>

                  ))}

                </div>

              </div>

            </div>

          </section>

          {/* BOTÕES FORA DO CARD */}

          <div className="editar-aluno-acoes">

            <button
              type="button"
              className="editar-aluno-cancelar"
              onClick={cancelar}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="editar-aluno-salvar"
            >
              Salvar Alterações
            </button>

          </div>

        </form>

      </main>

    </div>
  );
}