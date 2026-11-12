
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import footerAlerta from '../../assets/icon-inicio-footer-alerta.png';
import footerPessoas from '../../assets/icon-inicio-footer-pessoas.png';
import footerTurmas from '../../assets/icon-inicio-footer-turmas.png';
import pessoas from '../../assets/icon-inicio-pessoas.png';
import logo from '../../assets/logo (2).png';

import '../styles/telaCadastrarAluno.css';

export default function TelaCadastrarAluno() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [turma, setTurma] = useState('');
  const [foto, setFoto] = useState(null);

  function formatarCPF(valor) {
    const numeros = valor.replace(/\D/g, '').slice(0, 11);

    return numeros
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  function selecionarFoto(event) {
    const arquivo = event.target.files[0];

    if (arquivo) {
      setFoto(URL.createObjectURL(arquivo));
    }
  }

  function cadastrar(event) {
    event.preventDefault();

    if (
      !nome.trim() ||
      cpf.replace(/\D/g, '').length !== 11 ||
      !turma
    ) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    alert('Aluno cadastrado com sucesso!');
  }

  function cancelar() {
    setNome('');
    setCpf('');
    setTurma('');
    setFoto(null);
  }

  return (
    <div className="dashboard-cadastro">

      {/* MENU LATERAL */}
      <aside className="sidebar-cadastro">

        <div className="logo-cadastro">
          <img src={logo} alt="Logo Azyra" />
          <span>Azyra</span>
        </div>

        <nav className="menu-cadastro">

          <button
            type="button"
            className="menu-item-cadastro"
            onClick={() => navigate('/inicio')}
          >
            <span className="icone-inicio">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 10.5L12 3L21 10.5V20H14V14H10V20H3V10.5Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>Início</span>
          </button>

          <button
            type="button"
            className="menu-item-cadastro ativo"
            onClick={() => navigate('/alunos')}
          >
            <img src={pessoas} alt="" />
            <span>Cadastrar Alunos</span>
          </button>

          <button
            type="button"
            className="menu-item-cadastro"
            onClick={() => alert('A tela Turmas ainda não foi criada.')}
          >
            <img src={footerTurmas} alt="" />
            <span>Turmas</span>
          </button>

          <button
            type="button"
            className="menu-item-cadastro"
            onClick={() => alert('A tela Recorrências ainda não foi criada.')}
          >
            <img src={footerAlerta} alt="" />
            <span>Recorrências</span>
          </button>

        </nav>

        {/* PERFIL NO RODAPÉ */}
        <footer className="footer-cadastro">
          <div className="foto-perfil-cadastro">
            <img src={footerPessoas} alt="Perfil" />
          </div>

          <div className="info-perfil-cadastro">
            <strong>Juacelino</strong>
            <span>Coordenador</span>
          </div>
        </footer>

      </aside>

      {/* CONTEÚDO */}
      <main className="conteudo-cadastro">

        <header className="cabecalho-cadastro">
          <h1>Cadastrar Aluno</h1>
          <p>Preencha as informações do estudante</p>
        </header>

        <form onSubmit={cadastrar}>

          <section className="formulario-cadastro">

            {/* FOTO */}
            <div className="area-foto-aluno">

              <div className="foto-aluno">
                {foto ? (
                  <img src={foto} alt="Foto do aluno" />
                ) : (
                  <svg viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="40" fill="#91A5BF" />
                    <circle cx="40" cy="29" r="12" fill="white" />
                    <path
                      d="M17 65C20 52 29 46 40 46C51 46 60 52 63 65C51 77 29 77 17 65Z"
                      fill="white"
                    />
                  </svg>
                )}
              </div>

              <label htmlFor="foto-aluno" className="botao-foto">
                Alterar foto
              </label>

              <input
                type="file"
                id="foto-aluno"
                accept="image/*"
                onChange={selecionarFoto}
                hidden
              />

            </div>

            {/* NOME */}
            <div className="campo-cadastro">
              <label htmlFor="nome">Nome Completo</label>

              <input
                type="text"
                id="nome"
                placeholder="Digite o nome"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
              />
            </div>

            {/* CPF */}
            <div className="campo-cadastro">
              <label htmlFor="cpf">CPF</label>

              <input
                type="text"
                id="cpf"
                placeholder="Digite o CPF"
                value={cpf}
                onChange={(event) => setCpf(formatarCPF(event.target.value))}
                maxLength={14}
              />
            </div>

            {/* TURMA */}
            <div className="campo-cadastro">
              <label htmlFor="turma">Turma</label>

              <select
                id="turma"
                value={turma}
                onChange={(event) => setTurma(event.target.value)}
              >
                <option value="">Selecione a turma</option>
                <option value="1º ano A">1º ano A</option>
                <option value="1º ano B">1º ano B</option>
                <option value="2º ano A">2º ano A</option>
                <option value="2º ano B">2º ano B</option>
                <option value="3º ano A">3º ano A</option>
                <option value="3º ano B">3º ano B</option>
              </select>
            </div>

          </section>

          {/* BOTÕES */}
          <div className="botoes-cadastro">

            <button
              type="button"
              className="botao-cancelar"
              onClick={cancelar}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="botao-cadastrar"
            >
              Cadastrar
            </button>

          </div>

        </form>

      </main>
    </div>
  );
}
