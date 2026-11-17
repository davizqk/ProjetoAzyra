
import { useNavigate } from 'react-router-dom';

import logo from '../../assets/logo (2).png';
import footerAlerta from '../../assets/icon-inicio-footer-alerta.png';
import footerPessoas from '../../assets/icon-inicio-footer-pessoas.png';

import '../styles/telaInicio.css';
import '../styles/telaEditarTurma.css';

export default function TelaEditarTurma() {
  const navigate = useNavigate();

  function salvarAlteracoes(event) {
    event.preventDefault();
    alert('Alterações salvas com sucesso!');
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

      <main className="conteudo pagina-editar-turma">

        <header className="cabecalho cabecalho-editar">
          <h1>Editar Turma</h1>
          <p>Atualize as informações da turma</p>
        </header>

        <section className="card-editar-turma">

          <div className="titulo-card-editar">
            Dados da turma
          </div>

          <form
            className="form-editar-turma"
            onSubmit={salvarAlteracoes}
          >

            <div className="campo-editar">
              <label htmlFor="nomeTurma">Nome da Turma</label>
              <input
                type="text"
                id="nomeTurma"
                defaultValue="Desenvolvimento de Sistemas"
              />
            </div>

            
<div className="campo-editar">
  <label htmlFor="professor">
    Professor Responsável
  </label>

  <input
    type="text"
    id="professor"
    placeholder="Digite o nome do professor"
    defaultValue="Eduardo Costa"
  />
</div>


            <div className="campo-editar">
              <label htmlFor="modelo">Modelo de Ensino</label>
              <select id="modelo" defaultValue="SEDUC">
                <option value="SEDUC">SEDUC</option>
                <option value="Comunidade">Comunidade</option>
              </select>
            </div>

            <div className="campo-editar">
              <label htmlFor="periodo">Período</label>
              <select id="periodo" defaultValue="Integral">
                <option value="Integral">Integral</option>
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
                <option value="Noite">Noite</option>
              </select>
            </div>

            <div className="campos-horarios-editar">

              <div className="campo-editar">
                <label htmlFor="inicio">Horário de Início</label>
                <input
                  type="time"
                  id="inicio"
                  defaultValue="08:00"
                />
              </div>

              <div className="campo-editar">
                <label htmlFor="termino">Horário de Término</label>
                <input
                  type="time"
                  id="termino"
                  defaultValue="17:00"
                />
              </div>

            </div>

            <div className="botoes-editar-turma">

              <button
                type="button"
                className="botao-cancelar-editar"
                onClick={() => navigate('/turmas')}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="botao-salvar-editar"
              >
                Salvar Alterações
              </button>

            </div>

          </form>
        </section>
      </main>
    </div>
  );
}
