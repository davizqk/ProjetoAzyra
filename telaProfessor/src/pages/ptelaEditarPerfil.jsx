import { useState, useRef } from "react";

import "../styles/ptelaHistorico.css";
import "../styles/ptelaPerfil.css";
import "../styles/ptelaEditarPerfil.css";

import logo from "../assets/logo-footer.png";
import iconeHistorico from "../assets/historico-footer.png";
import perfilUsuario from "../assets/perfil-minhasturmas.png";
import iconeMinhasTurmasWhite from "../assets/minhasturmaswhite-footer.png";

export default function PtelaEditarPerfil({ aoNavegar, telaAtual }) {
  const [nome, setNome] = useState("Jucelino Pinheiro de Andrade");
  const [email, setEmail] = useState("jucelinopinheiro134@gmail.com");
  const [foto, setFoto] = useState(perfilUsuario);

  const inputFoto = useRef(null);

  const navegar = (tela) => {
    if (typeof aoNavegar === "function") {
      aoNavegar(tela);
    }
  };

  const alterarFoto = (event) => {
    const arquivo = event.target.files[0];

    if (arquivo) {
      const imagem = URL.createObjectURL(arquivo);
      setFoto(imagem);
    }
  };

  const salvarPerfil = (event) => {
    event.preventDefault();

    // Integre o salvamento com seu backend aqui.
    navegar("perfil");
  };

  const cancelarEdicao = () => {
    navegar("perfil");
  };

  return (
    <div className="historico-app perfil-app editar-perfil-app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-brand">
          <img
            src={logo}
            alt="Logo Azyra"
            className="sidebar-logo"
          />

          <span>Azyra</span>
        </div>

        <nav
          className="sidebar-nav"
          aria-label="Navegação principal"
        >
          <button
            type="button"
            className="sidebar-link"
            onClick={() => navegar("minhas-turmas")}
          >
            <img
              src={iconeMinhasTurmasWhite}
              alt=""
              className="sidebar-icon"
            />

            <span>Minhas Turmas</span>
          </button>

          <button
            type="button"
            className="sidebar-link"
            onClick={() => navegar("historico")}
          >
            <img
              src={iconeHistorico}
              alt=""
              className="sidebar-icon"
            />

            <span>Histórico</span>
          </button>
        </nav>

        {/* RODAPÉ */}
        <button
          type="button"
          className="sidebar-footer"
          onClick={() => navegar("perfil")}
          aria-label="Abrir perfil"
        >
          <img
            src={perfilUsuario}
            alt=""
            className="sidebar-footer-avatar"
          />

          <div className="sidebar-footer-text">
            <strong>Jucelino</strong>
            <span>coordenador</span>
          </div>
        </button>

      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="turmas-main historico-main perfil-main editar-perfil-main">

        {/* TÍTULO */}
        <div className="page-header">
          <h1>Editar Perfil</h1>
        </div>

        <form
          className="editar-perfil-form"
          onSubmit={salvarPerfil}
        >

          {/* CARD DE EDIÇÃO */}
          <section className="editar-perfil-card">

            {/* FOTO */}
            <div className="editar-perfil-foto-area">

              <img
                src={foto}
                alt="Foto do perfil"
                className="editar-perfil-avatar"
              />

              <input
                ref={inputFoto}
                type="file"
                accept="image/*"
                className="editar-perfil-input-file"
                onChange={alterarFoto}
              />

              <button
                type="button"
                className="editar-perfil-foto-botao"
                onClick={() => inputFoto.current?.click()}
              >
                Alterar foto
              </button>

            </div>

            {/* CAMPOS */}
            <div className="editar-perfil-campos">

              <div className="editar-perfil-campo">
                <label htmlFor="nome">
                  Nome Completo
                </label>

                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>

              <div className="editar-perfil-campo">
                <label htmlFor="email">
                  E-mail
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Digite seu e-mail"
                  required
                />
              </div>

            </div>

          </section>

          {/* BOTÕES */}
          <div className="editar-perfil-botoes">

            <button
              type="button"
              className="editar-perfil-cancelar"
              onClick={cancelarEdicao}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="editar-perfil-salvar"
            >
              Salvar
            </button>

          </div>

        </form>

      </main>

    </div>
  );
}
