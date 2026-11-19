
import { Link, useNavigate } from "react-router-dom";

import logo from "../assets/logo-footer.png";
import perfil from "../assets/perfil-footer.png";

import casa from "../assets/casa-footer.png";
import cadastrar from "../assets/cadastrar-footer.png";
import turmas from "../assets/turmas-footer.png";
import recorrenciasAtivo from "../assets/recorrencias-preenchido-footer.png";

import alertaVermelho from "../assets/alerta-vermelho.png";
import alertaAmarelo from "../assets/alerta-amarelo.png";
import baixar from "../assets/baixar.png";

import "../styles/telaInicio.css";
import "../styles/telaRecorrencias.css";

export default function TelaRecorrencias() {
  const navigate = useNavigate();

  const alunos = [
    {
      nome: "Amy Lee",
      atrasos: "3 atrasos (Comunidade)",
      alerta: alertaVermelho
    },
    {
      nome: "Eloysa Marques",
      atrasos: "3 atrasos (SEDUC)",
      alerta: alertaVermelho
    },
    {
      nome: "Livia Caires",
      atrasos: "2 atrasos (Comunidade)",
      alerta: alertaAmarelo
    }
  ];

  const relatorios = [
    { dia: "Segunda-feira", atrasos: "9 atrasos" },
    { dia: "Terça-feira", atrasos: "9 atrasos" },
    { dia: "Quarta-feira", atrasos: "10 atrasos" },
    { dia: "Quinta-feira", atrasos: "12 atrasos" },
    { dia: "Sexta-feira", atrasos: "14 atrasos" },
    { dia: "Sábado", atrasos: "8 atrasos" }
  ];

  function gerarRelatorio() {
    alert("Relatório gerado com sucesso!");
  }

  return (
    <div className="gestao-layout">
      {/* MENU LATERAL */}
      <aside className="gestao-sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="Logo Azyra" />
          <span>Azyra</span>
        </div>

        <nav className="sidebar-menu">
          <button
            type="button"
            className="sidebar-link"
            onClick={() => navigate("/inicio")}
          >
            <img src={casa} alt="" />
            <span>Início</span>
          </button>

          <button
            type="button"
            className="sidebar-link"
            onClick={() => navigate("/alunos")}
          >
            <img src={cadastrar} alt="" />
            <span>Cadastrar Alunos</span>
          </button>

          <button
            type="button"
            className="sidebar-link"
            onClick={() => navigate("/turmas")}
          >
            <img src={turmas} alt="" />
            <span>Turmas</span>
          </button>

          <button
            type="button"
            className="sidebar-link ativo"
            onClick={() => navigate("/recorrencias")}
          >
            <img src={recorrenciasAtivo} alt="" />
            <span>Recorrências</span>
          </button>
        </nav>

        {/* RODAPÉ CLICÁVEL */}
        <Link to="/perfil" className="sidebar-footer">
          <img
            src={perfil}
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
      <main className="gestao-main pagina-recorrencias">
        <header className="recorrencias-header">
          <h1>Recorrências</h1>
          <p>Acompanhe os atrasos e suas recorrências.</p>
        </header>

        <section className="recorrencias-paineis">
          {/* ALUNOS COM RECORRÊNCIA */}
          <div className="recorrencias-card">
            <div className="recorrencias-card-header">
              <h2>Alunos com Recorrência</h2>

              <button
                type="button"
                onClick={() => alert("Lista completa de alunos.")}
              >
                Ver todos
                <span>→</span>
              </button>
            </div>

            <div className="lista-alunos-recorrencia">
              {alunos.map((aluno, index) => (
                <div className="aluno-recorrencia" key={index}>
                  <div className="aluno-avatar">
                    <svg viewBox="0 0 40 40">
                      <circle
                        cx="20"
                        cy="20"
                        r="20"
                        fill="#E3F0F5"
                      />
                      <circle
                        cx="20"
                        cy="14"
                        r="7"
                        fill="#FFFFFF"
                      />
                      <path
                        d="M7 34c1.5-7 6-11 13-11s11.5 4 13 11"
                        fill="#FFFFFF"
                      />
                    </svg>
                  </div>

                  <div className="aluno-recorrencia-info">
                    <strong>{aluno.nome}</strong>
                    <span>{aluno.atrasos}</span>
                  </div>

                  <img
                    src={aluno.alerta}
                    alt="Alerta de recorrência"
                    className="aluno-alerta"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RELATÓRIOS */}
          <div className="relatorios-card">
            <div className="relatorios-header">
              <div>
                <h2>Relatórios</h2>
                <p>Resumo semanal de atrasos</p>
              </div>

              <button
                type="button"
                onClick={() => alert("Todos os relatórios.")}
              >
                Ver todos
                <span>→</span>
              </button>
            </div>

            <div className="lista-relatorios">
              {relatorios.map((relatorio, index) => (
                <div className="relatorio-item" key={index}>
                  <strong>{relatorio.dia}</strong>
                  <span>{relatorio.atrasos}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="botao-gerar-relatorio"
              onClick={gerarRelatorio}
            >
              <img src={baixar} alt="" />
              <span>Gerar Relatório</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
