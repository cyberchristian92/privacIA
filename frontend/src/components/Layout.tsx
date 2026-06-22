import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  Shield,
  Lock,
  FileText,
  ShieldCheck,
  ScrollText,
  Settings,
  Bot } from
'lucide-react';
import { cn } from '../lib/utils';
export function Layout() {
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-50 flex flex-col shrink-0">
        <div className="p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-500" />
            <h1 className="text-xl font-bold tracking-tight">PrivacIA</h1>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-slate-800/50 text-emerald-400 text-[10px] font-medium px-2 py-1 rounded-full w-fit border border-emerald-500/20">
            <Lock className="w-3 h-3" />
            Execução 100% local
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavItem to="/" icon={<FileText className="w-4 h-4" />}>
            Workspace
          </NavItem>
          <NavItem
            to="/conformidade"
            icon={<ShieldCheck className="w-4 h-4" />}>
            
            Conformidade LGPD
          </NavItem>
          <NavItem to="/auditoria" icon={<ScrollText className="w-4 h-4" />}>
            Auditoria
          </NavItem>
          <NavItem to="/configuracoes" icon={<Settings className="w-4 h-4" />}>
            Configurações
          </NavItem>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Bot className="w-4 h-4" />
            <div>
              <p className="font-medium text-slate-300">LLM Local Ativo</p>
              <p className="text-[10px] font-mono mt-0.5">
                Llama-3-8B-Instruct-GGUF
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Outlet />
      </main>
    </div>);

}
function NavItem({
  to,
  icon,
  children




}: {to: string;icon: React.ReactNode;children: React.ReactNode;}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
      cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
        isActive ?
        'bg-slate-800 text-white' :
        'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
      )
      }>
      
      {icon}
      {children}
    </NavLink>);

}