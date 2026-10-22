import { useNavigate } from 'react-router-dom';
import seta from '../assets/seta.png';
import '../styles/telaHistorico.css';

const registros = [
  {
    id: 1,
    data: '03/10/2026',
    horario: '8:05',
    turma: '1º ano A (Manhã)',
  },
  {
    id: 2,
    data: '23/09/2026',
    horario: '8:30',
    turma: '1º ano A (Manhã)',
  },
  {
    id: 3,
    data: '11/09/2026',
    horario: '8:15',
    turma: '1º ano A (Manhã)',
  },
  {
    id: 4,
    data: '22/08/2026',
    horario: '8:45',
    turma: '1º ano A (Manhã)',
  },
  {
    id: 5,
    data: '02/08/2026',
    horario: '8:10',
    turma: '1º ano A (Manhã)',
  },
];

export default function TelaHistorico() {
  const navigate = useNavigate();

  return (
    <main className="pagina-historico">
      <section className="tela-historico">
        <header className="cabecalho-historico">
          <h1 className="titulo-historico">
            Meu histórico
          </h1>
        </header>

        <div
          className="abas-historico"
          role="tablist"
          aria-label="Histórico"
        >
          <button
            type="button"
            role="tab"
            aria-selected="true"
            className="aba-historico aba-ativa"
            onClick={() => navigate('/historico')}
          >
            Últimos registros
          </button>

          <button
            type="button"
            role="tab"
            aria-selected="false"
            className="aba-historico"
            onClick={() => navigate('/recorrencias')}
          >
            Recorrências
          </button>
        </div>

        <section
          className="lista-registros"
          aria-label="Últimos registros de atraso"
        >
          {registros.map((registro) => (
            <article
              className="card-registro"
              key={registro.id}
            >
              <div className="info-registro">
                <span className="data-registro">
                  {registro.data}
                </span>

                <span className="turma-registro">
                  {registro.turma}
                </span>
              </div>

              <span className="horario-registro">
                {registro.horario}
              </span>

              <span className="status-atraso">
                Atraso
              </span>

              <img
                src={seta}
                alt=""
                className="seta-registro"
              />
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}