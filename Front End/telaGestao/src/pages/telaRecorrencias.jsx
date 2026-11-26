import { Link } from "react-router-dom";

import logo from "../assets/logo-footer.png";
import perfil from "../assets/perfil-footer.png";

import casa from "../assets/casa-footer.png";
import cadastrar from "../assets/cadastrar-footer.png";
import turmas from "../assets/turmas-footer.png";
import recorrenciasAtivo from "../assets/recorrencias-preenchido-footer.png";

import alertaVermelho from "../assets/alerta-vermelho.png";
import alertaAmarelo from "../assets/alerta-amarelo.png";

import "../styles/telaInicio.css";
import "../styles/telaRecorrencias.css";

export default function TelaRecorrencias() {

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

  return (
    <div className="gestao-layout">

      {/* SIDEBAR */}

      <aside className="gestao-sidebar">

        <div className="sidebar-logo">
          <img src={logo} alt="Logo Azyra" />
          <span>Azyra</span>
        </div>

        <nav className="sidebar-menu">

          <Link to="/inicio" className="sidebar-link">
            <img src={casa} alt="" />
            <span>Início</span>
          </Link>

          <Link to="/alunos" className="sidebar-link">
            <img src={cadastrar} alt="" />
            <span>Cadastrar Alunos</span>
          </Link>

          <Link to="/turmas" className="sidebar-link">
            <img src={turmas} alt="" />
            <span>Turmas</span>
          </Link>

          <Link
            to="/recorrencias"
            className="sidebar-link ativo"
          >
            <img src={recorrenciasAtivo} alt="" />
            <span>Recorrências</span>
          </Link>

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

        {/* CABEÇALHO */}

        <header className="recorrencias-header">
          <h1>Recorrências</h1>

          <p>
            Acompanhe os atrasos e suas recorrências.
          </p>
        </header>

        {/* PAINÉIS */}

        <section className="recorrencias-paineis">

          {/* ALUNOS COM RECORRÊNCIA */}

          <div className="recorrencias-card">

            <div className="recorrencias-card-header">

              <h2>Alunos com Recorrência</h2>

              <p>
                Estudantes com atrasos recorrentes
              </p>

            </div>

            <div className="lista-alunos-recorrencia">

              {alunos.map((aluno, index) => (

                <div
                  className="aluno-recorrencia"
                  key={index}
                >

                  {/* AVATAR ORIGINAL */}

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

                  {/* INFORMAÇÕES DO ALUNO */}

                  <div className="aluno-recorrencia-info">

                    <strong>
                      {aluno.nome}
                    </strong>

                    <span>
                      {aluno.atrasos}
                    </span>

                  </div>

                  {/* ÍCONE ORIGINAL DE ALERTA */}

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

              <h2>Relatórios</h2>

              <p>Resumo semanal de atrasos</p>

            </div>

            <div className="lista-relatorios">

              {relatorios.map((relatorio, index) => (

                <div
                  className="relatorio-item"
                  key={index}
                >

                  <strong>
                    {relatorio.dia}
                  </strong>

                  <span>
                    {relatorio.atrasos}
                  </span>

                </div>

              ))}

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}