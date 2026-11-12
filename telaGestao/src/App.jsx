
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import TelaCadastrarAluno from './pages/telaCadastrarAluno.jsx';
import TelaInicio from './pages/telaInicio.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/inicio" replace />} />

        <Route path="/inicio" element={<TelaInicio />} />

        <Route path="/alunos" element={<TelaCadastrarAluno />} />
      </Routes>
    </BrowserRouter>
  );
}
