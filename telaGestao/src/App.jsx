import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Cadastro from "./pages/telaCadastro";
import Login from "./pages/telaLogin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/cadastro" replace />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
