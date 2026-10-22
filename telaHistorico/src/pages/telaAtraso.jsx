import { useNavigate } from 'react-router-dom';
import '../styles/telaAtraso.css';

import alerta from '../assets/icone-alerta.png';
import aviso from '../assets/icone-aviso.png';
import relogio from '../assets/icone-relogio.png';

export default function TelaAtraso() {
  const navigate = useNavigate();

  const horaChegada = '07:32';
  const dataChegada = '03/10/2026';
  const turma = '3º ano A (Integral)';
  const horarioInicio = '08:00';

  function voltar() {
    navigate('/historico');
  }

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
              <strong>Horário de início:</strong>
              <span>{horarioInicio}</span>
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