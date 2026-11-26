import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../styles/telaInicio.css";
import "../styles/telaCadastrarAluno.css";

import logoFooter from "../assets/logo-footer.png";
import casaIcon from "../assets/casa-footer.png";
import cadastrarIcon from "../assets/cadastrar-preenchido-footer.png";
import turmasIcon from "../assets/turmas-footer.png";
import recorrenciasIcon from "../assets/recorrencias-footer.png";
import perfilIcon from "../assets/perfil-footer.png";

import fotoCadastrar from "../assets/foto-cadastrar.png";

function TelaCadastrarAluno() {
  const navigate = useNavigate();
  const inputFotoRef = useRef(null);

  const [fotoSelecionada, setFotoSelecionada] =
    useState(fotoCadastrar);

  function alterarFoto(evento) {
    const arquivo = evento.target.files[0];

    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
      alert("Selecione um arquivo de imagem.");
      return;
    }

    const leitor = new FileReader();

    leitor.onload = () => {
      setFotoSelecionada(leitor.result);
    };

    leitor.onerror = () => {
      alert("Não foi possível carregar a imagem.");
    };

    leitor.readAsDataURL(arquivo);
  }

  function cadastrarAluno(evento) {
    evento.preventDefault();

    // A integração para salvar os dados será
    // adicionada posteriormente.
  }

  return (
    <div className="gestao-layout">

      {/* SIDEBAR */}

      <aside className="gestao-sidebar">

        <div className="sidebar-logo">
          <img src={logoFooter} alt="Logo Azyra" />
          <span>Azyra</span>
        </div>

        {/* MENU LATERAL */}

        <nav className="sidebar-menu">

          <Link to="/inicio" className="sidebar-link">
            <img src={casaIcon} alt="" />
            <span>Início</span>
          </Link>

          <Link to="/alunos" className="sidebar-link ativo">
            <img src={cadastrarIcon} alt="" />
            <span>Cadastrar Alunos</span>
          </Link>

          <Link to="/turmas" className="sidebar-link">
            <img src={turmasIcon} alt="" />
            <span>Turmas</span>
          </Link>

          <Link to="/recorrencias" className="sidebar-link">
            <img src={recorrenciasIcon} alt="" />
            <span>Recorrências</span>
          </Link>

        </nav>

        {/* FOOTER CLICÁVEL */}

        <Link to="/perfil" className="sidebar-footer">

          <img
            src={perfilIcon}
            alt="Perfil"
            className="sidebar-footer-avatar"
          />

          <div className="sidebar-footer-text">
            <span>Jucelino</span>
            <small>Coordenador</small>
          </div>

        </Link>

      </aside>

      {/* CONTEÚDO PRINCIPAL */}

      <main className="cadastrar-aluno-main">

        <header className="cadastrar-aluno-header">

          <h1>Cadastrar Aluno</h1>

          <p>Preencha as informações do estudante</p>

        </header>

        <form
          className="form-cadastrar-aluno"
          onSubmit={cadastrarAluno}
        >

          <section className="cadastrar-aluno-card">

            {/* FOTO DO ALUNO */}

            <div className="foto-aluno-area">

              <div className="foto-aluno-moldura">

                <img
                  src={fotoSelecionada}
                  alt="Foto do aluno"
                  className="foto-aluno-preview"
                />

              </div>

              <div className="foto-aluno-informacoes">

                <h2>Foto do aluno</h2>

                <p>
                  Adicione uma foto para identificar o estudante.
                </p>

                <input
                  ref={inputFotoRef}
                  type="file"
                  accept="image/*"
                  className="input-foto-escondido"
                  onChange={alterarFoto}
                  hidden
                />

                <button
                  type="button"
                  className="botao-alterar-foto"
                  onClick={() => inputFotoRef.current.click()}
                >
                  Alterar foto
                </button>

              </div>

            </div>

            {/* DIVISOR */}

            <div className="cadastrar-aluno-divisor"></div>

            {/* NOME COMPLETO */}

            <div className="campo-cadastrar-aluno">

              <label htmlFor="nome-aluno">
                Nome completo
              </label>

              <input
                type="text"
                id="nome-aluno"
                name="nome"
                placeholder="Digite o nome completo"
                required
              />

            </div>

            {/* CPF */}

            <div className="campo-cadastrar-aluno">

              <label htmlFor="cpf-aluno">
                CPF
              </label>

              <input
                type="text"
                id="cpf-aluno"
                name="cpf"
                inputMode="numeric"
                placeholder="Digite o CPF"
                required
              />

            </div>

            {/* TURMA */}

            <div className="campo-cadastrar-aluno">

              <label htmlFor="turma-aluno">
                Turma
              </label>

              <select
                id="turma-aluno"
                name="turma"
                defaultValue=""
                required
              >

                <option value="" disabled>
                  Selecione a turma
                </option>

              </select>

            </div>

          </section>

          {/* BOTÕES INFERIORES */}

          <div className="botoes-cadastrar-aluno">

            <button
              type="button"
              className="botao-cancelar-aluno"
              onClick={() => navigate("/inicio")}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="botao-cadastrar-aluno"
            >
              Cadastrar
            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

export default TelaCadastrarAluno;