
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Cadastro from "./pages/telaCadastro";
import Login from "./pages/telaLogin";
import Inicio from "./pages/telaInicio";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Primeira tela do projeto */}
        <Route
          path="/"
          element={<Navigate to="/cadastro" replace />}
        />

        {/* Cadastro */}
        <Route
          path="/cadastro"
          element={<Cadastro />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Página inicial da gestão */}
        <Route
          path="/inicio"
          element={<Inicio />}
        />

        {/* Rotas ainda não configuradas */}
        <Route
          path="*"
          element={<Navigate to="/inicio" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
