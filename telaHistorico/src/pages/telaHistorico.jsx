
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import seta from '../../assets/seta.png';
import '../styles/telaHistorico.css';

import { apiRequest } from '../services/api';

export default function TelaHistorico() {
  const navigate = useNavigate();

  const [registros, setRegistros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const alunoSalvo = sessionStorage.getItem('azyraAluno');

    if (!alunoSalvo) {
      navigate('/dados', { replace: true });
      return;
    }

    const aluno = JSON.parse(alunoSalvo);

    async function buscarHistorico() {
      try {
        const dados = await apiRequest(
          `/HistoricoAtraso/aluno/${aluno.idAluno}`
        );

        setRegistros(dados);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    }

    buscarHistorico();
  }, [navigate]);

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
          {carregando && <p>Carregando registros...</p>}

          {erro && <p role="alert">{erro}</p>}

          {!carregando && !erro && registros.length === 0 && (
            <p>Você ainda não possui registros.</p>
          )}

          {registros.map((registro) => (
            <article
              className="card-registro"
              key={registro.idHistorico}
            >
              <div className="info-registro">
                <span className="data-registro">
                  {new Date(registro.data).toLocaleDateString('pt-BR')}
                </span>

                <span className="turma-registro">
                  {registro.nomeTurma || 'Sua turma'}
                </span>
              </div>

              <span className="horario-registro">
                {registro.horaChegada
                  ? String(registro.horaChegada).substring(0, 5)
                  : '--:--'}
              </span>

              <span className="status-atraso">
                {registro.atrasado ? 'Atraso' : 'No horário'}
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
