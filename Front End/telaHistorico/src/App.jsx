
import { Routes, Route, Navigate } from 'react-router-dom';

import TelaDados from './pages/telaDados.jsx';
import TelaAtraso from './pages/telaAtraso.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TelaDados />} />
      <Route path="/dados" element={<TelaDados />} />
      <Route path="/atraso" element={<TelaAtraso />} />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}
