import { useNavigate } from 'react-router-dom';
import iconeUsuarios from '../assets/icone-usuarios.svg';
import '../styles/Recorrencias.css';

const atrasosSemana = [
  '20/10/2026 - 08:04',
  '18/10/2026 - 08:17',
  '16/10/2026 - 08:34',
];

export default function Recorrencias() {
  const navigate = useNavigate();

  return (
    <main className="recorrencias">
      <h1 className="rec-titulo">Recorrências</h1>

      <div className="rec-abas" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected="false"
          className="rec-aba"
          onClick={() => navigate('/historico')}
        >
          Últimos registros
        </button>

        <button
          type="button"
          role="tab"
          aria-selected="true"
          className="rec-aba rec-aba-ativa"
          onClick={() => navigate('/recorrencias')}
        >
          Recorrências
        </button>
      </div>

      <section className="rec-card">
        <img
          src={iconeUsuarios}
          alt=""
          className="rec-card-icone"
        />

        <div>
          <p className="rec-card-texto">Você possui</p>
          <p className="rec-card-destaque">3 atrasos</p>
          <p className="rec-card-texto">
            nos últimos 7 dias
          </p>
        </div>
      </section>

      <h2 className="rec-subtitulo">
        Seus atrasos da semana
      </h2>

      <ul className="rec-lista">
        {atrasosSemana.map((atraso) => (
          <li key={atraso} className="rec-lista-item">
            {atraso}
          </li>
        ))}
      </ul>

      <div className="rec-aviso">
        <span className="rec-aviso-icone">i</span>

        <p>
          <strong>Atenção:</strong> alerte seu professor ou
          coordenação em caso de atrasos errados.
        </p>
      </div>
    </main>
  );
}