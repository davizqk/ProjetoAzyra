
import { useNavigate } from 'react-router-dom';

import logo from '../../assets/logo (2).png';

import alerta from '../../assets/icon-inicio-alerta.png';
import notificacao from '../../assets/icon-inicio-notificacao.png';
import pessoas from '../../assets/icon-inicio-pessoas.png';
import relogio from '../../assets/icon-inicio-relogio.png';

import footerAlerta from '../../assets/icon-inicio-footer-alerta.png';
import footerPessoas from '../../assets/icon-inicio-footer-pessoas.png';
import footerTurmas from '../../assets/icon-inicio-footer-turmas.png';

import '../styles/telaInicio.css';

export default function TelaInicio() {
  const navigate = useNavigate();

  const alertas = [
    {
      nome: 'Ana Torres',
      mensagem: 'atingiu 3 atrasos consecutivos.',
      horario: 'Hoje, 09:30'
    },
    {
      nome: 'Carlos Souza',
      mensagem: 'atingiu 5 atrasos consecutivos.',
      horario: 'Hoje, 09:30'
    },
    {
      nome: 'Fernanda Silva',
      mensagem: 'atingiu 2 atrasos consecutivos.',
      horario: 'Hoje, 09:30'
    }
  ];

  return (
    <div className="dashboard">

      {/* MENU LATERAL */}
      <aside className="sidebar">

        <div className="logo">
          <img src={logo} alt="Logo Azyra" />
          <span>Azyra</span>
        </div>

        <nav className="menu">

          {/* INÍCIO */}
          <button
            type="button"
            className="menu-item ativo"
            onClick={() => navigate('/inicio')}
          >
            <span className="icone-home">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 10.5L12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-5v-6h-5v6h-5A1.5 1.5 0 0 1 3 19.5z" />
              </svg>
            </span>
            <span>Início</span>
          </button>

          {/* CADASTRAR ALUNOS */}
          <button
            type="button"
            className="menu-item"
            onClick={() => navigate('/alunos')}
          >
            <img
              src={pessoas}
              alt=""
              className="icone-menu"
            />
            <span>Cadastrar Alunos</span>
          </button>

          {/* TURMAS */}
          <button
            type="button"
            className="menu-item"
            onClick={() => alert('A tela Turmas ainda não foi criada.')}
          >
            <img
              src={footerTurmas}
              alt=""
              className="icone-menu"
            />
            <span>Turmas</span>
          </button>

          {/* RECORRÊNCIAS */}
          <button
            type="button"
            className="menu-item"
            onClick={() => alert('A tela Recorrências ainda não foi criada.')}
          >
            <img
              src={footerAlerta}
              alt=""
              className="icone-menu"
            />
            <span>Recorrências</span>
          </button>

        </nav>

        {/* PERFIL NO RODAPÉ */}
        <footer className="footer-sidebar">

          <div className="perfil-icon">
            <img src={footerPessoas} alt="Perfil" />
          </div>

          <div className="perfil-info">
            <strong>Juacelino</strong>
            <span>Coordenador</span>
          </div>

        </footer>

      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="conteudo">

        <header className="cabecalho">
          <h1>Início</h1>
          <p>Visão geral de frequência e atrasos</p>
        </header>

        {/* INDICADORES */}
        <section className="indicadores">

          <div className="card-indicador">
            <img src={pessoas} alt="Alunos" />

            <div className="info-indicador">
              <strong>248</strong>
              <span>Alunos</span>
            </div>
          </div>

          <div className="card-indicador">
            <img src={relogio} alt="Atrasos" />

            <div className="info-indicador">
              <strong>32</strong>
              <span>Atrasos hoje</span>
            </div>
          </div>

          <div className="card-indicador">
            <img src={alerta} alt="Recorrências" />

            <div className="info-indicador">
              <strong>12</strong>
              <span>Recorrências</span>
            </div>
          </div>

        </section>

        {/* ALERTAS RECENTES */}
        <section className="area-alertas">

          <div className="titulo-alertas">
            <img src={notificacao} alt="Notificações" />
            <h2>Alertas Recentes</h2>
          </div>

          <div className="lista-alertas">

            {alertas.map((item, index) => (
              <div className="item-alerta" key={index}>

                <img
                  src={alerta}
                  alt="Alerta"
                  className="icone-alerta"
                />

                <p>
                  Aluno(a) <strong>{item.nome}</strong> {item.mensagem}
                </p>

                <span className="horario">
                  {item.horario}
                </span>

              </div>
            ))}

          </div>

        </section>

      </main>

    </div>
  );
}
