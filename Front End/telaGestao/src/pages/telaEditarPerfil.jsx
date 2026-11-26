
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

  const [dadosAtuais] = useState(obterDadosPerfil);

  const [nome, setNome] = useState(dadosAtuais.nome);
  const [email, setEmail] = useState(dadosAtuais.email);
  const [foto, setFoto] = useState(dadosAtuais.foto || "");
  const [carregandoFoto, setCarregandoFoto] = useState(false);

  // ALTERAR FOTO
  function alterarFoto(event) {
    const arquivo = event.target.files[0];

    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
      alert("Selecione um arquivo de imagem.");
      return;
    }

    const leitor = new FileReader();

    setCarregandoFoto(true);

    leitor.onload = () => {
      setFoto(leitor.result);
      setCarregandoFoto(false);
    };

    leitor.onerror = () => {
      setCarregandoFoto(false);
      alert("Não foi possível carregar a imagem.");
    };

    leitor.readAsDataURL(arquivo);
  }

  // SALVAR ALTERAÇÕES
  function salvarEdicao(event) {
    event.preventDefault();

    if (!nome.trim()) {
      alert("Informe seu nome completo.");
      return;
    }

    if (carregandoFoto) return;

    const novosDados = {
      ...dadosAtuais,
      nome: nome.trim(),
      email: email.trim(),
      foto
    };

    try {
      localStorage.setItem(
        "azyraPerfil",
        JSON.stringify(novosDados)
      );

      navigate("/perfil");
    } catch {
      alert(
        "Não foi possível salvar as alterações. Tente utilizar uma imagem menor."
      );
    }
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

        {/* RODAPÉ DA SIDEBAR */}

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

          <p>
            Atualize suas informações pessoais.
          </p>

        </header>

        {/* CARD DE EDIÇÃO */}

        <form
          id="form-editar-perfil"
          className="editar-perfil-card"
          onSubmit={salvarEdicao}
        >

          {/* FOTO DO PERFIL */}

          <div className="editar-foto-container">

            <div className="editar-foto-moldura">

              <img
                src={foto || iconePerfil}
                alt="Foto do perfil"
                className="editar-foto"
              />

            </div>

            <div className="editar-foto-informacoes">

              <h2>Foto de perfil</h2>

              <p>Personalize sua foto de perfil.</p>

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
                disabled={carregandoFoto}
              >
                {carregandoFoto
                  ? "Carregando..."
                  : "Alterar foto"}
              </button>

            </div>

          </div>

          {/* DIVISOR */}

          <div className="editar-perfil-divisor"></div>

          {/* NOME COMPLETO */}

          <div className="editar-campo">

            <label htmlFor="nomeCompleto">
              Nome completo
            </label>

            <input
              type="text"
              id="nomeCompleto"
              name="nome"
              placeholder="Digite seu nome completo"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              autoComplete="name"
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
              name="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />

          </div>

        </form>

        {/* BOTÕES INFERIORES */}

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
            disabled={carregandoFoto}
          >
            Salvar
          </button>

        </div>

      </main>

    </div>
  );
}

export default TelaEditarPerfil;
