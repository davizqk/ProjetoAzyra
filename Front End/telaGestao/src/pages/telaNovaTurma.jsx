
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import logoFooter from "../assets/logo-footer.png";
import casaIcon from "../assets/casa-footer.png";
import cadastrarIcon from "../assets/cadastrar-footer.png";
import turmasIcon from "../assets/turmas-preenchido-footer.png";
import recorrenciasIcon from "../assets/recorrencias-footer.png";
import perfilIcon from "../assets/perfil-footer.png";

import "../styles/telaInicio.css";
import "../styles/telaNovaTurma.css";

const turmasIniciais = [
  {
    id: 1,
    nome: "Desenvolvimento de Sistemas",
    professor: "Eduardo Costa",
    modelo: "SEDUC",
    periodo: "Integral",
    horarioInicio: "08:00",
    horarioTermino: "17:00",
  },
  {
    id: 2,
    nome: "Rede de Computadores",
    professor: "Ana Paula",
    modelo: "Comunidade",
    periodo: "Manhã",
    horarioInicio: "07:45",
    horarioTermino: "12:00",
  },
  {
    id: 3,
    nome: "Multimídias",
    professor: "Carlos Silva",
    modelo: "SEDUC",
    periodo: "Integral",
    horarioInicio: "08:00",
    horarioTermino: "17:00",
  },
  {
    id: 4,
    nome: "Jogos digitais",
    professor: "Eduardo Costa",
    modelo: "Comunidade",
    periodo: "Tarde",
    horarioInicio: "14:15",
    horarioTermino: "18:00",
  },
];

function carregarTurmas() {
  try {
    const salvas = localStorage.getItem("azyra_turmas");

    if (salvas !== null) {
      const dados = JSON.parse(salvas);

      if (Array.isArray(dados)) {
        return dados;
      }
    }
  } catch (erro) {
    console.error("Erro ao carregar turmas:", erro);
  }

  return turmasIniciais;
}

function TelaNovaTurma() {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    nome: "",
    professor: "",
    modelo: "SEDUC",
    periodo: "Integral",
    horarioInicio: "",
    horarioTermino: "",
  });

  // ALTERAR CAMPOS DO FORMULÁRIO
  function alterarCampo(e) {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  // CADASTRAR NOVA TURMA
  function cadastrarTurma(e) {
    e.preventDefault();

    if (!formulario.nome.trim()) {
      alert("Digite o nome da turma.");
      return;
    }

    if (!formulario.professor.trim()) {
      alert("Digite o nome do professor responsável.");
      return;
    }

    if (
      formulario.horarioInicio >= formulario.horarioTermino
    ) {
      alert(
        "O horário de término deve ser maior que o horário de início."
      );
      return;
    }

    const turmas = carregarTurmas();

    const novoId =
      Math.max(
        0,
        ...turmas.map((turma) => Number(turma.id))
      ) + 1;

    const novaTurma = {
      id: novoId,
      ...formulario,
      nome: formulario.nome.trim(),
      professor: formulario.professor.trim(),
    };

    const turmasAtualizadas = [...turmas, novaTurma];

    try {
      localStorage.setItem(
        "azyra_turmas",
        JSON.stringify(turmasAtualizadas)
      );

      alert("Turma cadastrada com sucesso!");
      navigate("/turmas");
    } catch (erro) {
      console.error("Erro ao cadastrar turma:", erro);
      alert("Não foi possível cadastrar a turma.");
    }
  }

  return (
    <div className="gestao-layout">
      {/* SIDEBAR */}
      <aside className="gestao-sidebar">
        <div className="sidebar-logo">
          <img src={logoFooter} alt="Logo Azyra" />
          <span>Azyra</span>
        </div>

        <nav className="sidebar-menu">
          <Link to="/inicio" className="sidebar-link">
            <img src={casaIcon} alt="" />
            <span>Início</span>
          </Link>

          <Link to="/alunos" className="sidebar-link">
            <img src={cadastrarIcon} alt="" />
            <span>Cadastrar Alunos</span>
          </Link>

          <Link to="/turmas" className="sidebar-link ativo">
            <img src={turmasIcon} alt="" />
            <span>Turmas</span>
          </Link>

          <Link to="/recorrencias" className="sidebar-link">
            <img src={recorrenciasIcon} alt="" />
            <span>Recorrências</span>
          </Link>
        </nav>

        {/* RODAPÉ CLICÁVEL */}
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
      <main className="gestao-main">
        {/* CABEÇALHO */}
        <header className="nova-turma-header">
          <h1>Nova Turma</h1>
          <p>Cadastre uma nova turma na unidade</p>
        </header>

        {/* FORMULÁRIO */}
        <section className="nova-turma-container">
          <div className="nova-turma-titulo">
            <h2>Dados da turma</h2>
          </div>

          <form
            className="nova-turma-formulario"
            onSubmit={cadastrarTurma}
          >
            {/* NOME DA TURMA */}
            <div className="nova-turma-campo">
              <label htmlFor="nome">Nome da Turma</label>
              <input
                id="nome"
                type="text"
                name="nome"
                placeholder="Digite o nome da turma"
                value={formulario.nome}
                onChange={alterarCampo}
                required
              />
            </div>

            {/* PROFESSOR RESPONSÁVEL */}
            <div className="nova-turma-campo">
              <label htmlFor="professor">
                Professor Responsável
              </label>
              <input
                id="professor"
                type="text"
                name="professor"
                placeholder="Digite o nome do professor"
                value={formulario.professor}
                onChange={alterarCampo}
                required
              />
            </div>

            {/* MODELO DE ENSINO */}
            <div className="nova-turma-campo">
              <label htmlFor="modelo">Modelo de Ensino</label>
              <select
                id="modelo"
                name="modelo"
                value={formulario.modelo}
                onChange={alterarCampo}
                required
              >
                <option value="SEDUC">SEDUC</option>
                <option value="Comunidade">Comunidade</option>
              </select>
            </div>

            {/* PERÍODO */}
            <div className="nova-turma-campo">
              <label htmlFor="periodo">Período</label>
              <select
                id="periodo"
                name="periodo"
                value={formulario.periodo}
                onChange={alterarCampo}
                required
              >
                <option value="Integral">Integral</option>
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
                <option value="Noite">Noite</option>
              </select>
            </div>

            {/* HORÁRIOS */}
            <div className="nova-turma-horarios">
              <div className="nova-turma-campo">
                <label htmlFor="horarioInicio">
                  Horário de Início
                </label>
                <input
                  id="horarioInicio"
                  type="time"
                  name="horarioInicio"
                  value={formulario.horarioInicio}
                  onChange={alterarCampo}
                  required
                />
              </div>

              <div className="nova-turma-campo">
                <label htmlFor="horarioTermino">
                  Horário de Término
                </label>
                <input
                  id="horarioTermino"
                  type="time"
                  name="horarioTermino"
                  value={formulario.horarioTermino}
                  onChange={alterarCampo}
                  required
                />
              </div>
            </div>

            {/* BOTÕES */}
            <div className="nova-turma-acoes">
              <button
                type="button"
                className="btn-cancelar-nova-turma"
                onClick={() => navigate("/turmas")}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="btn-salvar-nova-turma"
              >
                Cadastrar Turma
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default TelaNovaTurma;
