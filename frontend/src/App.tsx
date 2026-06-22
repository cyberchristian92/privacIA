import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Workspace } from './pages/Workspace';
import { Conformidade } from './pages/Conformidade';
import { Auditoria } from './pages/Auditoria';
import { Configuracoes } from './pages/Configuracoes';
export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Workspace />} />
          <Route path="conformidade" element={<Conformidade />} />
          <Route path="auditoria" element={<Auditoria />} />
          <Route path="configuracoes" element={<Configuracoes />} />
        </Route>
      </Routes>
    </BrowserRouter>);

}