
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../../assets/logo (2).png';
import footerAlerta from '../../assets/icon-inicio-footer-alerta.png';
import footerPessoas from '../../assets/icon-inicio-footer-pessoas.png';

import '../styles/telaInicio.css';
import '../styles/telaNovaTurma.css';

export default function TelaNovaTurma() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [professor, setProfessor] = useState('');
  const [modelo, setModelo] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [inicio, setInicio] = useState('08:00');
  const [termino, setTermino] = useState('17:00');

  function salvar(event) {
    event.preventDefault();

    if (
      !nome.trim() ||
      !professor ||
      !modelo ||
      !periodo ||
      !inicio ||
      !termino
    ) {
      alert('Preencha todos os campos.');
      return;
    }

    alert('Turma cadastrada com sucesso!');
    navigate('/turmas');
  }

  return (
    <div className="dashboard">

      <aside className="sidebar">
        <div className="logo">
          <img src={logo} alt="Logo Azyra" />
          <span>Azyra</span>
        </div>

        <nav className="menu">

          <button
            type="button"
            className="menu-item"
            onClick={() => navigate('/inicio')}
          >
            <span className="icone-home">
              <svg viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8">
                <path d="M3 10.5L12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-5v-6h-5v6h-5A1.5 1.5 0 0 1 3 19.5z" />
              </svg>
            </span>
            <span>Início</span>
          </button>

          <button
            type="button"
            className="menu-item"
            onClick={() => navigate('/alunos')}
          >
            <img src={footerPessoas} alt="" className="icone-menu" />
            <span>Cadastrar Alunos</span>
          </button>

          <button
            type="button"
            className="menu-item ativo"
            onClick={() => navigate('/turmas')}
          >
            <span className="icone-home">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <circle cx="9" cy="8" r="3.5" />
                <path d="M2 19c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5v1H2z" />
                <circle cx="17" cy="9" r="2.7" />
                <path d="M17.5 13.6c2.9.2 4.8 1.9 4.8 4.4v1.5h-4.3v-1.5c0-1.7-.2-3-.5-4.4z" />
              </svg>
            </span>
            <span>Turmas</span>
          </button>

          <button
            type="button"
            className="menu-item"
            onClick={() => alert('A tela Recorrências ainda não foi criada.')}
          >
            <img src={footerAlerta} alt="" className="icone-menu" />
            <span>Recorrências</span>
          </button>

        </nav>

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

      <main className="conteudo pagina-nova-turma">

        <header className="cabecalho cabecalho-nova-turma">
          <h1>Nova Turma</h1>
          <p>Preencha as informações da turma</p>
        </header>

        <section className="card-nova-turma">

          <div className="titulo-card-nova">
            Dados da turma
          </div>

          <form className="form-nova-turma" onSubmit={salvar}>

            <div className="campo-nova">
              <label htmlFor="nome-turma">Nome da Turma</label>
              <input
                type="text"
                id="nome-turma"
                placeholder="Digite o nome da turma"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="campo-nova">
  <label htmlFor="professor-turma">
    Professor Responsável
  </label>

  <input
    type="text"
    id="professor-turma"
    placeholder="Digite o nome do professor"
    value={professor}
    onChange={(e) => setProfessor(e.target.value)}
  />
</div>

            <div className="campo-nova">
              <label htmlFor="modelo-turma">Modelo de Ensino</label>
              <select
                id="modelo-turma"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
              >
                <option value="">Selecione o modelo</option>
                <option value="SEDUC">SEDUC</option>
                <option value="Comunidade">Comunidade</option>
              </select>
            </div>

            <div className="campo-nova">
              <label htmlFor="periodo-turma">Período</label>
              <select
                id="periodo-turma"
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
              >
                <option value="">Selecione o período</option>
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
                <option value="Noite">Noite</option>
                <option value="Integral">Integral</option>
              </select>
            </div>

            <div className="horarios-nova">

              <div className="campo-nova">
                <label htmlFor="horario-inicio">
                  Horário de Início
                </label>
                <input
                  type="time"
                  id="horario-inicio"
                  value={inicio}
                  onChange={(e) => setInicio(e.target.value)}
                />
              </div>

              <div className="campo-nova">
                <label htmlFor="horario-termino">
                  Horário de Término
                </label>
                <input
                  type="time"
                  id="horario-termino"
                  value={termino}
                  onChange={(e) => setTermino(e.target.value)}
                />
              </div>

            </div>

            <div className="botoes-nova">

              <button
                type="button"
                className="cancelar-nova"
                onClick={() => navigate('/turmas')}
              >
                Cancelar
              </button>

              <button type="submit" className="salvar-nova">
                Salvar Turma
              </button>

            </div>

          </form>
        </section>
      </main>
    </div>
  );
}
