
import { useState, useEffect } from "react";
import "./App.css";

import Cadastro from "./pages/cadastro.jsx";
import Login from "./pages/Login.jsx";
import PTelaMinhasTurmas from "./pages/ptelaMinhasTurmas.jsx";
import PtelaHistorico from "./pages/ptelaHistorico.jsx";
import PtelaPerfil from "./pages/ptelaPerfil.jsx";
import EditarPerfil from "./pages/ptelaEditarPerfil.jsx";

const ROTAS_VALIDAS = [
  "cadastro",
  "login",
  "minhas-turmas",
  "historico",
  "perfil",
  "editar-perfil",
];

function lerRota() {
  const rota = window.location.hash.replace("#", "");

  return ROTAS_VALIDAS.includes(rota) ? rota : "cadastro";
}

export default function App() {
  const [telaAtual, setTelaAtual] = useState(lerRota);

  const [usuario, setUsuario] = useState({
    nome: "Jucelino Pinheiro",
    email: "jucelino@senai.br",
  });

  const [foto, setFoto] = useState("");

  useEffect(() => {
    function atualizarRota() {
      setTelaAtual(lerRota());
    }

    window.addEventListener("hashchange", atualizarRota);

    return () => {
      window.removeEventListener("hashchange", atualizarRota);
    };
  }, []);

  function navegarPara(rota) {
    if (!ROTAS_VALIDAS.includes(rota)) return;

    if (window.location.hash !== `#${rota}`) {
      window.location.hash = rota;
    }

    setTelaAtual(rota);
  }

  function entrar() {
    navegarPara("minhas-turmas");
  }

  function cadastrar() {
    navegarPara("minhas-turmas");
  }

  function salvarPerfil(dados) {
    setUsuario((anterior) => ({
      ...anterior,
      nome: dados.nome,
      email: dados.email,
    }));

    if (dados.foto) {
      setFoto(dados.foto);
    }

    navegarPara("perfil");
  }

  let conteudo;

  switch (telaAtual) {
    case "cadastro":
      conteudo = (
        <Cadastro
          aoCadastrar={cadastrar}
          aoEntrar={() => navegarPara("login")}
        />
      );
      break;

    case "login":
      conteudo = <Login aoEntrar={entrar} />;
      break;

    case "minhas-turmas":
      conteudo = (
        <PTelaMinhasTurmas
          aoNavegar={navegarPara}
          telaAtual={telaAtual}
        />
      );
      break;

    case "historico":
      conteudo = (
        <PtelaHistorico
          aoNavegar={navegarPara}
          telaAtual={telaAtual}
        />
      );
      break;

    case "perfil":
      conteudo = (
        <PtelaPerfil
          usuario={usuario}
          foto={foto}
          aoEditar={() => navegarPara("editar-perfil")}
          aoNavegar={navegarPara}
          telaAtual={telaAtual}
        />
      );
      break;

    case "editar-perfil":
      conteudo = (
        <EditarPerfil
          usuario={usuario}
          foto={foto}
          aoCancelar={() => navegarPara("perfil")}
          aoSalvar={salvarPerfil}
          aoNavegar={navegarPara}
          telaAtual={telaAtual}
        />
      );
      break;

    default:
      conteudo = (
        <Cadastro
          aoCadastrar={cadastrar}
          aoEntrar={() => navegarPara("login")}
        />
      );
  }

  return <>{conteudo}</>;
}
