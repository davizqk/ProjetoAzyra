
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import seta from '../../assets/seta.png';
import '../styles/telaHistorico.css';

export default function TelaHistorico() {
  const navigate = useNavigate();

  const [registros, setRegistros] = useState([]);

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

    const registrosAluno = historicoSalvo.filter(
      (registro) => registro.cpf === aluno.cpf
    );

    setRegistros(registrosAluno);
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
          aria-label="Últimos registros de chegada"
        >
          {registros.length === 0 && (
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
                  Sua turma
                </span>
              </div>

              <span className="horario-registro">
                {registro.horaChegada || '--:--'}
              </span>

              <span className="status-atraso">
                Registrado
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
