import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TelaInicio from './pages/telaInicio';
import TelaCadastrarAluno from './pages/telaCadastrarAluno';
import TelaTurmas from './pages/telaTurmas';
import TelaNovaTurma from './pages/telaNovaTurma';
import TelaEditarTurma from './pages/telaEditarTurma';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/inicio" element={<TelaInicio />} />
        <Route path="/alunos" element={<TelaCadastrarAluno />} />
        <Route path="/turmas" element={<TelaTurmas />} />
        <Route path="/turmas/nova" element={<TelaNovaTurma />} />
        <Route path="/turmas/editar/:id" element={<TelaEditarTurma />}
/>
      </Routes>
    </BrowserRouter>
  );
}

