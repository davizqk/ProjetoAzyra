
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import iconeUsuarios from '../../assets/icone-usuarios.svg';
import '../styles/Recorrencias.css';

export default function Recorrencias() {
  const navigate = useNavigate();

  const [atrasosSemana, setAtrasosSemana] = useState([]);

  useEffect(() => {
    const alunoSalvo = sessionStorage.getItem('azyraAluno');

    if (!alunoSalvo) {
      navigate('/dados', { replace: true });
      return;
    }

    const aluno = JSON.parse(alunoSalvo);

    const historicoSalvo = JSON.parse(
      localStorage.getItem('azyraHistorico') || '[]'
    );

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const limite = new Date(hoje);
    limite.setDate(limite.getDate() - 6);

    const atrasos = historicoSalvo.filter((registro) => {
      const dataRegistro = new Date(registro.data);
      dataRegistro.setHours(0, 0, 0, 0);

      return (
        registro.cpf === aluno.cpf &&
        registro.atrasado === true &&
        dataRegistro >= limite &&
        dataRegistro <= hoje
      );
    });

    setAtrasosSemana(atrasos);
  }, [navigate]);

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

          <p className="rec-card-destaque">
            {atrasosSemana.length}{' '}
            {atrasosSemana.length === 1 ? 'atraso' : 'atrasos'}
          </p>

          <p className="rec-card-texto">
            nos últimos 7 dias
          </p>
        </div>
      </section>

      <h2 className="rec-subtitulo">
        Seus atrasos da semana
      </h2>

      {atrasosSemana.length === 0 ? (
        <p>Você não possui atrasos nos últimos 7 dias.</p>
      ) : (
        <ul className="rec-lista">
          {atrasosSemana.map((registro) => (
            <li
              key={registro.idHistorico}
              className="rec-lista-item"
            >
              {new Date(registro.data).toLocaleDateString('pt-BR')}
              {' - '}
              {registro.horaChegada || '--:--'}
            </li>
          ))}
        </ul>
      )}

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
