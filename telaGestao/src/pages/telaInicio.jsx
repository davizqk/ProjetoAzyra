
import '../style/telaInicio.css';

import alerta from '../../assets/icon-inicio-alerta.png';
import notificacao from '../../assets/icon-inicio-notificacao.png';
import pessoas from '../../assets/icon-inicio-pessoas.png';
import relogio from '../../assets/icon-inicio-relogio.png';

export default function TelaInicio() {

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

  const menu = [
    'Início',
    'Cadastrar Alunos',
    'Turmas',
    'Recorrências'
  ];

  return (
    <div className="dashboard">

      {/* MENU LATERAL */}
      <aside className="sidebar">

        <div className="logo">
          <div className="logo-icon">A</div>
          <span>Azyra</span>
        </div>

        <nav className="menu">

          {menu.map((item, index) => (
            <button
              key={item}
              className={`menu-item ${index === 0 ? 'ativo' : ''}`}
            >
              {index === 0 && <span className="icone-home">⌂</span>}

              {index === 1 && (
                <img src={pessoas} alt="" />
              )}

              {index === 2 && (
                <img src={pessoas} alt="" />
              )}

              {index === 3 && (
                <img src={alerta} alt="" />
              )}

              <span>{item}</span>
            </button>
          ))}

        </nav>

        {/* PERFIL */}
        <div className="perfil">

          <div className="perfil-icon">
            J
          </div>

          <div className="perfil-info">
            <strong>Juacelino</strong>
            <span>Coordenador</span>
          </div>

        </div>

      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="conteudo">

        {/* CABEÇALHO */}
        <header className="cabecalho">
          <h1>Início</h1>
          <p>Visão geral de frequência e atrasos</p>
        </header>

        {/* INDICADORES */}
        <section className="indicadores">

          <div className="card-indicador">

            <img src={pessoas} alt="Alunos" />

            <div>
              <strong>248</strong>
              <span>Alunos</span>
            </div>

          </div>

          <div className="card-indicador">

            <img src={relogio} alt="Relógio" />

            <div>
              <strong>32</strong>
              <span>Atrasos hoje</span>
            </div>

          </div>

          <div className="card-indicador">

            <img src={alerta} alt="Recorrências" />

            <div>
              <strong>12</strong>
              <span>Recorrências</span>
            </div>

          </div>

        </section>

        {/* ALERTAS RECENTES */}
        <section className="area-alertas">

          <div className="titulo-alertas">

            <img
              src={notificacao}
              alt="Notificações"
            />

            <h2>Alertas Recentes</h2>

          </div>

          <div className="lista-alertas">

            {alertas.map((item, index) => (

              <div className="item-alerta" key={index}>

                <img
                  src={alerta}
                  alt="Alerta"
                />

                <p>
                  Aluno(a) <strong>{item.nome}</strong>{' '}
                  {item.mensagem}
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
