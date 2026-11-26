import React, { useState, useRef } from "react";

import "../styles/telaHistorico.css";
import "../styles/telaEditarPerfil.css";

import logo from "../assets/logo-footer.png";
import iconeTurmas from "../assets/minhasturmaswhite-footer.png";
import iconeHistorico from "../assets/historico-footer.png";
import perfilUsuario from "../assets/perfil-minhasturmas.png";

export default function EditarPerfil({
  usuario,
  foto,
  aoNavegar,
  aoCancelar,
  aoSalvar,
}) {
  const [nome, setNome] = useState(
    usuario?.nome ?? "Jucelino Pinheiro"
  );

  const [email, setEmail] = useState(
    usuario?.email ?? "jucelino@senai.br"
  );

  const [fotoPerfil, setFotoPerfil] = useState(foto || "");

  const inputFoto = useRef(null);

  function alterarFoto(event) {
    const arquivo = event.target.files?.[0];

    if (!arquivo || !arquivo.type.startsWith("image/")) {
      return;
    }

    const leitor = new FileReader();

    leitor.onload = () => {
      setFotoPerfil(leitor.result);
    };

    leitor.readAsDataURL(arquivo);
  }

  function salvar(event) {
    event.preventDefault();

    aoSalvar?.({
      nome: nome.trim(),
      email: email.trim(),
      foto: fotoPerfil,
    });
  }

  function cancelar() {
    if (aoCancelar) {
      aoCancelar();
    } else {
      aoNavegar?.("perfil");
    }
  }

  return (
    <div className="historico-app editar-perfil-app">

      {/* SIDEBAR ORIGINAL */}

      <aside className="sidebar">

        <div className="sidebar-brand">
          <img
            src={logo}
            alt="Logo Azyra"
            className="sidebar-logo"
          />

          <span>Azyra</span>
        </div>

        <nav className="sidebar-nav">

          <button
            type="button"
            className="sidebar-link"
            onClick={() => aoNavegar?.("minhas-turmas")}
          >
            <img
              src={iconeTurmas}
              alt=""
              className="sidebar-icon"
            />

            <span>Turmas</span>
          </button>

          <button
            type="button"
            className="sidebar-link"
            onClick={() => aoNavegar?.("historico")}
          >
            <img
              src={iconeHistorico}
              alt=""
              className="sidebar-icon"
            />

            <span>Histórico</span>
          </button>

        </nav>

        <button
          type="button"
          className="sidebar-footer"
          onClick={() => aoNavegar?.("perfil")}
          aria-label="Abrir perfil"
        >
          <img
            src={perfilUsuario}
            alt=""
            className="sidebar-footer-avatar"
          />

          <div className="sidebar-footer-text">
            <strong>Jucelino</strong>
            <span>Coordenador</span>
          </div>
        </button>

      </aside>

      {/* CONTEÚDO PRINCIPAL */}

      <main className="ep-professor-main">

        {/* CABEÇALHO FORA DO CARD */}

        <header className="ep-professor-header">
          <h1>Editar Perfil</h1>

          <p>Atualize suas informações pessoais.</p>
        </header>

        <form
          className="ep-professor-form"
          onSubmit={salvar}
        >

          {/* CARD PRINCIPAL */}

          <section className="ep-professor-card">

            {/* FOTO DO PERFIL */}

            <div className="ep-professor-foto-area">

              <div className="ep-professor-foto-container">

                <img
                  src={fotoPerfil || perfilUsuario}
                  alt="Foto do perfil"
                  className="ep-professor-avatar"
                />

              </div>

              <div className="ep-professor-foto-info">

                <h2>Foto de perfil</h2>

                <p>Personalize sua foto de perfil.</p>

                <input
                  ref={inputFoto}
                  type="file"
                  accept="image/*"
                  className="ep-professor-file"
                  onChange={alterarFoto}
                  hidden
                />

                <button
                  type="button"
                  className="ep-professor-alterar-foto"
                  onClick={() => inputFoto.current?.click()}
                >
                  Alterar foto
                </button>

              </div>

            </div>

            {/* DIVISÓRIA */}

            <div className="ep-professor-divisor"></div>

            {/* CAMPOS */}

            <div className="ep-professor-grid">

              <div className="ep-professor-campo">

                <label htmlFor="ep-nome">
                  Nome completo
                </label>

                <input
                  id="ep-nome"
                  type="text"
                  value={nome}
                  onChange={(event) =>
                    setNome(event.target.value)
                  }
                  placeholder="Digite seu nome"
                  required
                />

              </div>

              <div className="ep-professor-campo">

                <label htmlFor="ep-email">
                  E-mail
                </label>

                <input
                  id="ep-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Digite seu e-mail"
                  required
                />

              </div>

            </div>

          </section>

          {/* BOTÕES FORA DO CARD */}

          <div className="ep-professor-acoes">

            <button
              type="button"
              className="ep-professor-cancelar"
              onClick={cancelar}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="ep-professor-salvar"
            >
              Salvar
            </button>

          </div>

        </form>

      </main>

    </div>
  );
}