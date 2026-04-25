import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, Menu, DollarSign, Target, Briefcase, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';
import RelaxBullet from './RelaxBullet';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/agenda', icon: Calendar, label: 'Agenda' },
    { to: '/leads', icon: Target, label: 'Leads' },
    { to: '/vendas', icon: CreditCard, label: 'Vendas' },
    { to: '/clientes', icon: Briefcase, label: 'Contratos' },
    { to: '/despesas', icon: DollarSign, label: 'Despesas' },
    { to: '/membros', icon: Users, label: 'Equipe' },
  ];

  return (
    <>
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-nexora-card rounded-md border border-white/10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={20} />
      </button>

      <div className={cn(
        "fixed md:static top-0 left-0 h-full w-64 bg-[#0a111a] border-r border-white/5 flex flex-col transition-transform duration-300 z-40",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-6 flex items-center justify-center border-b border-white/5">
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-nexora-neon to-blue-500">
            Nexora Web
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group text-sm font-medium",
                isActive 
                  ? "bg-gradient-to-r from-nexora-neon/20 to-transparent text-nexora-neon border-l-2 border-nexora-neon" 
                  : "text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
              )}
            >
              <link.icon size={18} className="drop-shadow-sm" />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="px-4 pb-4 border-t border-white/5 pt-4">
          <button 
            onClick={() => {
              localStorage.removeItem('nexora_auth');
              localStorage.removeItem('nexora_currentUser');
              window.location.reload();
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            <span>Sair da Conta</span>
          </button>
        </div>
        
        <div className="px-6 pb-6 text-xs text-gray-500 text-center">
          © 2026 Nexora Web
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export const AppLayout = () => {
  return (
    <div className="flex h-screen bg-nexora-dark overflow-hidden font-sans text-white selection:bg-nexora-neon/30">
      <Sidebar />
      <main className="flex-1 overflow-y-auto w-full">
        <div className="max-w-7xl mx-auto p-4 md:p-8 pt-16 md:pt-8">
          <Outlet />
        </div>
      </main>
      <RelaxBullet />
    </div>
  );
};
