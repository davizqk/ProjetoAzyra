import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import logoFooter from "../assets/logo-footer.png";
import casaIcon from "../assets/casa-footer.png";
import cadastrarIcon from "../assets/cadastrar-footer.png";
import turmasIcon from "../assets/turmas-preenchido-footer.png";
import recorrenciasIcon from "../assets/recorrencias-footer.png";
import perfilIcon from "../assets/perfil-footer.png";

import "../styles/telaInicio.css";
import "../styles/telaEditarTurma.css";

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

function TelaEditarTurma() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [turmas] = useState(carregarTurmas);

  const turmaSelecionada = turmas.find(
    (turma) => Number(turma.id) === Number(id)
  );

  const [formulario, setFormulario] = useState(() =>
    turmaSelecionada
      ? { ...turmaSelecionada }
      : {
          nome: "",
          professor: "",
          modelo: "",
          periodo: "",
          horarioInicio: "",
          horarioTermino: "",
        }
  );

  // ALTERAR CAMPOS

  function alterarCampo(e) {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  // SALVAR ALTERAÇÕES

  function salvarAlteracoes(e) {
    e.preventDefault();

    if (!turmaSelecionada) {
      return;
    }

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

    const turmasAtualizadas = turmas.map((turma) =>
      Number(turma.id) === Number(id)
        ? {
            ...formulario,
            id: turma.id,
            nome: formulario.nome.trim(),
            professor: formulario.professor.trim(),
          }
        : turma
    );

    try {
      localStorage.setItem(
        "azyra_turmas",
        JSON.stringify(turmasAtualizadas)
      );

      alert("Turma atualizada com sucesso!");
      navigate("/turmas");

    } catch (erro) {
      console.error("Erro ao salvar turma:", erro);
      alert("Não foi possível salvar as alterações.");
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

        {/* RODAPÉ */}

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

      <main className="gestao-main pagina-editar-turma">

        {turmaSelecionada ? (

          <form
            className="editar-turma-formulario"
            onSubmit={salvarAlteracoes}
          >

            {/* CARD PRINCIPAL */}

            <section className="editar-turma-container">

              {/* TÍTULO DO CARD */}

              <div className="editar-turma-titulo">
                <h2>Editar Turma</h2>
                <p>Atualize as informações da turma.</p>
              </div>

              {/* CAMPOS */}

              <div className="editar-turma-campos">

                {/* NOME DA TURMA */}

                <div className="editar-turma-campo">

                  <label htmlFor="nome">
                    Nome da Turma
                  </label>

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

                <div className="editar-turma-campo">

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

                <div className="editar-turma-campo">

                  <label htmlFor="modelo">
                    Modelo de Ensino
                  </label>

                  <select
                    id="modelo"
                    name="modelo"
                    value={formulario.modelo}
                    onChange={alterarCampo}
                    required
                  >
                    <option value="SEDUC">
                      SEDUC
                    </option>

                    <option value="Comunidade">
                      Comunidade
                    </option>
                  </select>

                </div>

                {/* PERÍODO */}

                <div className="editar-turma-campo">

                  <label htmlFor="periodo">
                    Período
                  </label>

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

                {/* HORÁRIO DE INÍCIO */}

                <div className="editar-turma-campo">

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

                {/* HORÁRIO DE TÉRMINO */}

                <div className="editar-turma-campo">

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

            </section>

            {/* BOTÕES */}

            <div className="editar-turma-acoes">

              <button
                type="button"
                className="btn-cancelar-edicao"
                onClick={() => navigate("/turmas")}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="btn-salvar-edicao"
              >
                Salvar Alterações
              </button>

            </div>

          </form>

        ) : (

          <section className="editar-turma-container">

            <div className="editar-turma-titulo">
              <h2>Editar Turma</h2>
            </div>

            <div className="editar-turma-nao-encontrada">

              <p>Turma não encontrada.</p>

              <button
                type="button"
                onClick={() => navigate("/turmas")}
              >
                Voltar para Turmas
              </button>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default TelaEditarTurma;