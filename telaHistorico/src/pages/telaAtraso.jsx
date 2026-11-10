
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/telaAtraso.css';

import alerta from '../../assets/icone-alerta.png';
import aviso from '../../assets/icone-aviso.png';
import relogio from '../../assets/icone-relogio.png';

export default function TelaAtraso() {
  const navigate = useNavigate();
  const [aluno, setAluno] = useState(null);

  useEffect(() => {
    const alunoSalvo = sessionStorage.getItem('azyraAluno');

    if (!alunoSalvo) {
      navigate('/dados', { replace: true });
      return;
    }

    try {
      setAluno(JSON.parse(alunoSalvo));
    } catch {
      navigate('/dados', { replace: true });
    }
  }, [navigate]);

  function voltar() {
    navigate('/dados');
  }

  if (!aluno) {
    return null;
  }

  const agora = new Date();

  const horaChegada = agora.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const dataChegada = agora.toLocaleDateString('pt-BR');

  const cpf = aluno.cpf || aluno.CPF || 'Não informado';

  const turma =
    aluno.nomeTurma ||
    aluno.turma ||
    'Não informada';

  return (
    <main className="tela-atraso">

      <section className="conteudo-atraso">

        <header className="cabecalho-atraso">
          <img
            className="icone-alerta"
            src={aviso}
            alt="Alerta de atraso"
          />

          <h1>Você chegou atrasado(a)!</h1>

          <p className="subtitulo-atraso">
            Seu registro foi salvo, mas o horário
            <br className="quebra-desktop" />
            {' '}da sua turma já havia sido encerrado.
          </p>
        </header>

        <section className="card-chegada">

          <img
            className="icone-relogio"
            src={relogio}
            alt="Relógio"
          />

          <div className="texto-chegada">
            <span className="label-chegada">
              Horário da chegada
            </span>

            <strong className="hora-chegada">
              {horaChegada}
            </strong>

            <span className="data-chegada">
              {dataChegada}
            </span>
          </div>

        </section>

        <section className="card-turma">

          <img
            className="icone-aviso"
            src={alerta}
            alt="Informação"
          />

          <div className="texto-turma">

            <p>
              <strong>Turma:</strong>
              <span>{turma}</span>
            </p>

            <p>
              <strong>CPF:</strong>
              <span>{cpf}</span>
            </p>

          </div>

        </section>

      </section>

      <footer className="rodape-atraso">
        <button
          className="botao-voltar"
          type="button"
          onClick={voltar}
        >
          Voltar
        </button>
      </footer>

    </main>
  );
}
