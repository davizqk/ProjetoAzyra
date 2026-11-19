
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom";

import Cadastro from "./pages/telaCadastro";
import Login from "./pages/telaLogin";
import Inicio from "./pages/telaInicio";
import CadastrarAluno from "./pages/telaCadastrarAluno";
import Turmas from "./pages/telaTurmas";
import Recorrencias from "./pages/telaRecorrencias";
import EditarTurma from "./pages/telaEditarTurma";
import NovaTurma from "./pages/telaNovaTurma";
import Perfil from "./pages/telaPerfil";
import EditarPerfil from "./pages/telaEditarPerfil";

function Rotas() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/cadastro" replace />} />

      <Route
        path="/cadastro"
        element={<Cadastro aoCadastrar={() => navigate("/inicio")} />}
      />

      <Route
        path="/login"
        element={<Login aoEntrar={() => navigate("/inicio")} />}
      />

      <Route path="/inicio" element={<Inicio />} />
      <Route path="/alunos" element={<CadastrarAluno />} />
      <Route path="/turmas" element={<Turmas />} />
      <Route path="/turmas/cadastrar" element={<NovaTurma />} />
      <Route path="/turmas/editar/:id" element={<EditarTurma />} />
      <Route path="/recorrencias" element={<Recorrencias />} />

      <Route path="/perfil" element={<Perfil />} />
      <Route path="/editar-perfil" element={<EditarPerfil />} />

      <Route path="*" element={<Navigate to="/cadastro" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Rotas />
    </BrowserRouter>
  );
}
