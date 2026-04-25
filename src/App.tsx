import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/AppLayout';
import AuthWrapper from './components/AuthWrapper';
import Dashboard from './pages/Dashboard';
import Sales from './pages/Sales';
import Members from './pages/Members';
import Expenses from './pages/Expenses';
import Leads from './pages/Leads';
import Clients from './pages/Clients';
import Agenda from './pages/Agenda';

export default function App() {
  return (
    <AuthWrapper>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="agenda" element={<Agenda />} />
              <Route path="leads" element={<Leads />} />
              <Route path="vendas" element={<Sales />} />
              <Route path="clientes" element={<Clients />} />
              <Route path="despesas" element={<Expenses />} />
              <Route path="membros" element={<Members />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthWrapper>
  );
}

