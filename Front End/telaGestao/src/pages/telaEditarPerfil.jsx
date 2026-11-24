import React, { useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import "../styles/telaInicio.css";
import "../styles/telaPerfil.css";
import "../styles/telaEditarPerfil.css";

// IMAGENS
import logo from "../assets/logo-footer.png";
import perfilFooter from "../assets/perfil-footer.png";
import iconePerfil from "../assets/foto-cadastrar.png";

import casa from "../assets/casa-footer.png";
import casaAtivo from "../assets/casa-preenchido-footer.png";

import cadastrar from "../assets/cadastrar-footer.png";
import cadastrarAtivo from "../assets/cadastrar-preenchido-footer.png";

import turmas from "../assets/turmas-footer.png";
import turmasAtivo from "../assets/turmas-preenchido-footer.png";

import recorrencias from "../assets/recorrencias-footer.png";
import recorrenciasAtivo from "../assets/recorrencias-preenchido-footer.png";

// DADOS PADRÃO
const dadosPadrao = {
  nome: "Jucelino",
  email: "juacelino@senai.br",
  foto: ""
};

// BUSCAR DADOS SALVOS
function obterDadosPerfil() {
  const dadosSalvos = localStorage.getItem("azyraPerfil");

  if (dadosSalvos) {
    try {
      return {
        ...dadosPadrao,
        ...JSON.parse(dadosSalvos)
      };
    } catch {
      return dadosPadrao;
    }
  }

  return dadosPadrao;
}

function TelaEditarPerfil() {
  const navigate = useNavigate();
  const inputFoto = useRef(null);

  const dadosAtuais = obterDadosPerfil();

  const [nome, setNome] = useState(dadosAtuais.nome);
  const [email, setEmail] = useState(dadosAtuais.email);
  const [foto, setFoto] = useState(dadosAtuais.foto || "");

  // ALTERAR FOTO
  function alterarFoto(event) {
    const arquivo = event.target.files[0];

    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
      alert("Selecione um arquivo de imagem.");
      return;
    }

    const leitor = new FileReader();

    leitor.onloadend = () => {
      setFoto(leitor.result);
    };

    leitor.readAsDataURL(arquivo);
  }

  // SALVAR ALTERAÇÕES
  function salvarEdicao(event) {
    event.preventDefault();

    const novosDados = {
      nome,
      email,
      foto
    };

    localStorage.setItem(
      "azyraPerfil",
      JSON.stringify(novosDados)
    );

    navigate("/perfil");
  }

  // CANCELAR
  function cancelarEdicao() {
    navigate("/perfil");
  }

  return (
    <div className="gestao-layout">

      {/* SIDEBAR */}
      <aside className="gestao-sidebar">

        <div className="sidebar-logo">
          <img src={logo} alt="Logo Azyra" />
          <span>Azyra</span>
        </div>

        <nav className="sidebar-menu">

          <NavLink
            to="/inicio"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "ativo" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <img src={isActive ? casaAtivo : casa} alt="" />
                <span>Início</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/alunos"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "ativo" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={isActive ? cadastrarAtivo : cadastrar}
                  alt=""
                />
                <span>Cadastrar Alunos</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/turmas"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "ativo" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={isActive ? turmasAtivo : turmas}
                  alt=""
                />
                <span>Turmas</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/recorrencias"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "ativo" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={isActive ? recorrenciasAtivo : recorrencias}
                  alt=""
                />
                <span>Recorrências</span>
              </>
            )}
          </NavLink>

        </nav>

        {/* RODAPÉ */}
        <NavLink to="/perfil" className="sidebar-footer">

          <img
            src={perfilFooter}
            alt="Perfil"
            className="sidebar-footer-avatar"
          />

          <div className="sidebar-footer-text">
            <span>{dadosAtuais.nome}</span>
            <small>Coordenador</small>
          </div>

        </NavLink>

      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="pagina-editar-perfil">

        <header className="editar-perfil-header">
          <h1>Editar Perfil</h1>
        </header>

        <form
          id="form-editar-perfil"
          className="editar-perfil-card"
          onSubmit={salvarEdicao}
        >

          {/* FOTO */}
          <div className="editar-foto-container">

            <img
              src={foto || iconePerfil}
              alt="Foto do perfil"
              className="editar-foto"
            />

            <input
              type="file"
              accept="image/*"
              ref={inputFoto}
              onChange={alterarFoto}
              hidden
            />

            <button
              type="button"
              className="editar-perfil-alterar-foto"
              onClick={() => inputFoto.current.click()}
            >
              Alterar foto
            </button>

          </div>

          {/* NOME */}
          <div className="editar-campo">

            <label htmlFor="nomeCompleto">
              Nome Completo
            </label>

            <input
              type="text"
              id="nomeCompleto"
              placeholder="Digite seu nome completo"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              required
            />

          </div>

          {/* E-MAIL */}
          <div className="editar-campo">

            <label htmlFor="email">
              E-mail
            </label>

            <input
              type="email"
              id="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

          </div>

        </form>

        {/* BOTÕES */}
        <div className="editar-perfil-botoes">

          <button
            type="button"
            className="botao-cancelar-edicao"
            onClick={cancelarEdicao}
          >
            Cancelar
          </button>

          <button
            type="submit"
            form="form-editar-perfil"
            className="botao-salvar-edicao"
          >
            Salvar
          </button>

        </div>

      </main>

    </div>
  );
}

export default TelaEditarPerfil;