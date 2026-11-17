
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../../assets/logo (2).png';
import footerAlerta from '../../assets/icon-inicio-footer-alerta.png';
import footerPessoas from '../../assets/icon-inicio-footer-pessoas.png';

import '../styles/telaInicio.css';
import '../styles/telaTurmas.css';

const turmas = [
  {
    id: 1,
    nome: 'Desenvolvimento de Sistemas',
    modelo: 'SEDUC',
    periodo: 'Integral',
    horario: '08:00 - 17:00'
  }
];

export default function TelaTurmas() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');

  const turmasFiltradas = turmas.filter((turma) =>
    turma.nome.toLowerCase().includes(busca.toLowerCase())
  );

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
              <img src="/assets" alt="" />
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

      <main className="conteudo pagina-turmas">

        <header className="cabecalho cabecalho-turmas">
          <h1>Turmas</h1>
          <p>Gerencie as turmas da unidade</p>
        </header>

        <section className="barra-acoes">

          <div className="campo-busca">
            <svg viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>

            <input
              type="text"
              placeholder="Buscar por turma..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="botao-nova-turma"
            onClick={() => navigate('/turmas/nova')}
          >
            <span className="mais">+</span>
            Nova turma
          </button>

        </section>

        <section className="area-tabela">
          <div className="tabela-scroll">

            <table className="tabela-turmas">
              <thead>
                <tr>
                  <th>Turma</th>
                  <th>Modelo de Ensino</th>
                  <th>Período</th>
                  <th>Horário</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {turmasFiltradas.map((turma) => (
                  <tr key={turma.id}>
                    <td className="col-turma">{turma.nome}</td>
                    <td>{turma.modelo}</td>
                    <td>{turma.periodo}</td>
                    <td>{turma.horario}</td>

                    <td>
                      <div className="acoes">

                        {/* EDITAR */}
                        <button
                          type="button"
                          className="botao-acao"
                          title="Editar"
                          onClick={() =>
                            navigate(`/turmas/editar/${turma.id}`)
                          }
                        >
                          <svg viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <path d="M4 20l4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10z" />
                            <path d="M14 7l3 3" />
                          </svg>
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}

                {turmasFiltradas.length === 0 && (
                  <tr>
                    <td colSpan="5" className="sem-resultado">
                      Nenhuma turma encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="rodape-tabela">
            <span>
              Mostrando {turmasFiltradas.length} de {turmas.length} turmas
            </span>

            <div className="paginacao">
              <button type="button" className="botao-pagina">
                ‹
              </button>
              <button type="button" className="botao-pagina ativa">
                1
              </button>
              <button type="button" className="botao-pagina">
                ›
              </button>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}
