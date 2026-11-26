import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import logoFooter from "../assets/logo-footer.png";
import casaIcon from "../assets/casa-footer.png";
import cadastrarIcon from "../assets/cadastrar-footer.png";
import turmasIcon from "../assets/turmas-preenchido-footer.png";
import recorrenciasIcon from "../assets/recorrencias-footer.png";
import perfilIcon from "../assets/perfil-footer.png";
import lapisIcon from "../assets/lapis-turmas.png";

import "../styles/telaInicio.css";
import "../styles/telaTurmas.css";

function TelaTurmas() {
  const navigate = useNavigate();

  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  const itensPorPagina = 4;

  const [turmas] = useState([
    {
      id: 1,
      nome: "Desenvolvimento de Sistemas",
      modelo: "SEDUC",
      periodo: "Integral",
      horario: "08:00",
    },
    {
      id: 2,
      nome: "Rede de Computadores",
      modelo: "Comunidade",
      periodo: "Manhã",
      horario: "07:45",
    },
    {
      id: 3,
      nome: "Multimídias",
      modelo: "SEDUC",
      periodo: "Integral",
      horario: "08:00",
    },
    {
      id: 4,
      nome: "Jogos digitais",
      modelo: "Comunidade",
      periodo: "Tarde",
      horario: "14:15",
    },
  ]);

  // PESQUISA

  const turmasFiltradas = turmas.filter((turma) =>
    turma.nome.toLowerCase().includes(busca.toLowerCase())
  );

  // PAGINAÇÃO

  const totalPaginas = Math.ceil(
    turmasFiltradas.length / itensPorPagina
  );

  const inicio = (paginaAtual - 1) * itensPorPagina;

  const turmasExibidas = turmasFiltradas.slice(
    inicio,
    inicio + itensPorPagina
  );

  function editarTurma(id) {
    navigate(`/turmas/editar/${id}`);
  }

  return (
    <div className="gestao-layout">

      {/* SIDEBAR */}

      <aside className="gestao-sidebar">

        <div className="sidebar-logo">
          <img src={logoFooter} alt="Logo Azyra" />
          <span>Azyra</span>
        </div>

        <nav className="sidebar-menu">

          <Link to="/inicio" className="sidebar-link">
            <img src={casaIcon} alt="" />
            <span>Início</span>
          </Link>

          <Link to="/alunos" className="sidebar-link">
            <img src={cadastrarIcon} alt="" />
            <span>Cadastrar Alunos</span>
          </Link>

          <Link to="/turmas" className="sidebar-link ativo">
            <img src={turmasIcon} alt="" />
            <span>Turmas</span>
          </Link>

          <Link to="/recorrencias" className="sidebar-link">
            <img src={recorrenciasIcon} alt="" />
            <span>Recorrências</span>
          </Link>

        </nav>

        {/* RODAPÉ */}

        <Link to="/perfil" className="sidebar-footer">

          <img
            src={perfilIcon}
            alt="Perfil"
            className="sidebar-footer-avatar"
          />

          <div className="sidebar-footer-text">
            <span>Jucelino</span>
            <small>Coordenador</small>
          </div>

        </Link>

      </aside>

      {/* CONTEÚDO PRINCIPAL */}

      <main className="gestao-main pagina-turmas">

        {/* CABEÇALHO */}

        <header className="turmas-header">
          <h1>Turmas</h1>
          <p>Gerencie as turmas da unidade</p>
        </header>

        {/* PESQUISA E CADASTRO */}

        <section className="turmas-acoes">

          <div className="turmas-pesquisa">

            <svg
              viewBox="0 0 24 24"
              className="turmas-icone-pesquisa"
              aria-hidden="true"
            >
              <circle
                cx="10.8"
                cy="10.8"
                r="6.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              />

              <path
                d="M16 16l4.2 4.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>

            <input
              type="text"
              placeholder="Buscar por turma..."
              aria-label="Buscar por turma"
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setPaginaAtual(1);
              }}
            />

          </div>

          <button
            type="button"
            className="btn-nova-turma"
            onClick={() => navigate("/turmas/cadastrar")}
          >
            <span>+</span>
            Nova turma
          </button>

        </section>

        {/* TABELA */}

        <section className="turmas-tabela-container">

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

                  turmasExibidas.map((turma) => (

                    <tr key={turma.id}>

                      <td className="turma-nome">
                        {turma.nome}
                      </td>

                      <td>
                        <span
                          className={`turma-modelo ${
                            turma.modelo === "SEDUC"
                              ? "modelo-seduc"
                              : "modelo-comunidade"
                          }`}
                        >
                          {turma.modelo}
                        </span>
                      </td>

                      <td>{turma.periodo}</td>

                      <td>{turma.horario}</td>

                      <td>

                        <button
                          type="button"
                          className="btn-editar-turma"
                          title="Editar turma"
                          aria-label={`Editar ${turma.nome}`}
                          onClick={() => editarTurma(turma.id)}
                        >
                          <img src={lapisIcon} alt="" />
                        </button>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>
                    <td colSpan="5" className="turmas-vazio">
                      Nenhuma turma encontrada.
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

          {/* PAGINAÇÃO */}

          <div className="turmas-paginacao">

            <span>
              Mostrando{" "}
              {turmasFiltradas.length > 0 ? inicio + 1 : 0}
              {" - "}
              {Math.min(
                inicio + itensPorPagina,
                turmasFiltradas.length
              )}
              {" de "}
              {turmasFiltradas.length} turmas
            </span>

            <div className="turmas-paginacao-botoes">

              <button
                type="button"
                disabled={paginaAtual <= 1}
                onClick={() => setPaginaAtual(paginaAtual - 1)}
                title="Página anterior"
                aria-label="Página anterior"
              >
                ‹
              </button>

              <span className="pagina-atual">
                {paginaAtual}
              </span>

              <button
                type="button"
                disabled={
                  totalPaginas === 0 ||
                  paginaAtual >= totalPaginas
                }
                onClick={() => setPaginaAtual(paginaAtual + 1)}
                title="Próxima página"
                aria-label="Próxima página"
              >
                ›
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default TelaTurmas;