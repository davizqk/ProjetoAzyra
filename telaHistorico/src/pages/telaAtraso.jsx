
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/telaAtraso.css';

import alerta from '../../assets/icone-alerta.png';
import aviso from '../../assets/icone-aviso.png';
import relogio from '../../assets/icone-relogio.png';

import { apiRequest } from '../services/api';

export default function TelaAtraso() {
  const navigate = useNavigate();

  const [registro, setRegistro] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const alunoSalvo = sessionStorage.getItem('azyraAluno');

    if (!alunoSalvo) {
      navigate('/dados', { replace: true });
      return;
    }

    const aluno = JSON.parse(alunoSalvo);

    if (!aluno.idAluno) {
      navigate('/dados', { replace: true });
      return;
    }

    async function registrarChegada() {
      try {
        const dados = await apiRequest(
          '/HistoricoAtraso/registrar-chegada',
          {
            method: 'POST',
            body: JSON.stringify({
              idAluno: aluno.idAluno,
            }),
          }
        );

        setRegistro(dados);

        sessionStorage.setItem(
          'azyraUltimaChegada',
          JSON.stringify(dados)
        );
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    }

    registrarChegada();
  }, [navigate]);

  function voltar() {
    navigate('/historico');
  }

  const aluno = JSON.parse(
    sessionStorage.getItem('azyraAluno') || 'null'
  );

  const horaChegada = registro?.horaChegada
    ? String(registro.horaChegada).substring(0, 5)
    : '--:--';

  const dataChegada = registro?.data
    ? new Date(registro.data).toLocaleDateString('pt-BR')
    : '--/--/----';

  if (carregando) {
    return (
      <main className="tela-atraso">
        <section className="conteudo-atraso">
          <p>Registrando sua chegada...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="tela-atraso">
      <section className="conteudo-atraso">
        <header className="cabecalho-atraso">
          <img
            className="icone-alerta"
            src={aviso}
            alt="Aviso"
          />

          <h1>
            {erro
              ? 'Não foi possível registrar sua chegada.'
              : registro?.atrasado
                ? 'Você chegou atrasado(a)!'
                : 'Sua chegada foi registrada!'}
          </h1>

          <p className="subtitulo-atraso">
            {erro ||
              (registro?.atrasado
                ? 'Seu registro foi salvo, mas o horário da sua turma já passou.'
                : 'Seu registro foi salvo dentro do horário da sua turma.')}
          </p>
        </header>

        {!erro && registro && (
          <>
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
                  <span>
                    {registro.nomeTurma || aluno?.nomeTurma || 'Não informada'}
                  </span>
                </p>

                <p>
                  <strong>Horário de início:</strong>
                  <span>
                    {aluno?.horaInicio || 'Não informado'}
                  </span>
                </p>
              </div>
            </section>
          </>
        )}
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
