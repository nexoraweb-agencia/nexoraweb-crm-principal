import React, { useState } from 'react';
import { useAppContext, Lead, LeadStatus } from '../context/AppContext';
import { Plus, Search, Table2, Kanban, MessageCircle, Edit3, Trash2, Building, GripVertical } from 'lucide-react';
import { cn } from '../lib/utils';

const LEAD_STATUSES: LeadStatus[] = [
  'Novo Lead', 'Contato Iniciado', 'Reunião Marcada', 
  'Proposta Enviada', 'Negociação', 'Fechado', 'Perdido'
];

const PREDEFINED_SOURCES = ['TikTok', 'Indicação', 'Orgânico', 'Tráfego Pago', 'Instagram', 'Outro'];

// Color mapping for statuses
const STATUS_COLORS: Record<LeadStatus, { bg: string, text: string, border: string }> = {
  'Novo Lead': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  'Contato Iniciado': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  'Reunião Marcada': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  'Proposta Enviada': { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
  'Negociação': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  'Fechado': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
  'Perdido': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' }
};

export default function Leads() {
  const { leads, addLead, updateLead, deleteLead } = useAppContext();
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);

  const openAddModal = () => {
    setLeadToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (lead: Lead) => {
    setLeadToEdit(lead);
    setIsModalOpen(true);
  };

  const formatWhatsAppLink = (phone: string) => {
    let clean = phone.replace(/\D/g, '');
    if (clean && clean.length <= 11) {
      clean = `55${clean}`;
    }
    return `https://wa.me/${clean}`;
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (l.companyName && l.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    l.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Funil de Leads</h1>
          <p className="text-gray-400 mt-1">Gerencie os potenciais clientes da agência.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar lead..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-nexora-card border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-nexora-neon transition-colors"
            />
          </div>
          
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
            <button 
              onClick={() => setView('kanban')}
              className={cn("p-1.5 rounded-md transition-colors", view === 'kanban' ? "bg-white/10 text-white" : "text-gray-400 hover:text-white")}
              title="Visualização Kanban"
            >
              <Kanban size={18} />
            </button>
            <button 
              onClick={() => setView('list')}
              className={cn("p-1.5 rounded-md transition-colors", view === 'list' ? "bg-white/10 text-white" : "text-gray-400 hover:text-white")}
              title="Visualização em Lista"
            >
              <Table2 size={18} />
            </button>
          </div>

          <button
            onClick={openAddModal}
            className="flex-shrink-0 flex items-center justify-center bg-gradient-to-r from-blue-600 to-nexora-neon hover:opacity-90 text-white px-4 h-10 w-full sm:w-auto rounded-lg font-medium transition-all shadow-lg shadow-nexora-neon/20 gap-2"
          >
            <Plus size={18} />
            <span>Novo Lead</span>
          </button>
        </div>
      </div>

      {view === 'kanban' ? (
        <KanbanBoard 
          leads={filteredLeads} 
          updateLead={updateLead} 
          onEdit={openEditModal}
          formatLink={formatWhatsAppLink}
          onDelete={deleteLead}
        />
      ) : (
        <ListView 
          leads={filteredLeads} 
          onEdit={openEditModal}
          formatLink={formatWhatsAppLink}
          onDelete={deleteLead}
        />
      )}

      {isModalOpen && (
        <LeadModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={(data) => {
            if (leadToEdit) updateLead(leadToEdit.id, data);
            else addLead(data);
          }}
          initialData={leadToEdit}
        />
      )}
    </div>
  );
}

// -------------------------------------------------------------
// KANBAN VIEW
// -------------------------------------------------------------
function KanbanBoard({ leads, updateLead, onEdit, formatLink, onDelete }: any) {
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain');
    if (leadId) {
      updateLead(leadId, { status });
    }
  };

  return (
    <div className="flex-1 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
      <div className="flex gap-4 min-w-max h-full">
        {LEAD_STATUSES.map(status => {
          const columnLeads = leads.filter((l: Lead) => l.status === status);
          const colorObj = STATUS_COLORS[status];

          return (
            <div 
              key={status}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
              className="w-[300px] flex flex-col bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden"
            >
              <div className={cn("p-4 border-b border-white/5 flex items-center justify-between", colorObj.bg)}>
                <h3 className={cn("font-medium text-sm", colorObj.text)}>{status}</h3>
                <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full text-white/70">{columnLeads.length}</span>
              </div>
              
              <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                {columnLeads.map((lead: Lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead.id)}
                    onDragEnd={handleDragEnd}
                    className="bg-nexora-card border border-white/5 hover:border-white/20 p-4 rounded-lg shadow-sm cursor-grab active:cursor-grabbing group transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                       <h4 className="font-semibold text-white text-sm">{lead.name}</h4>
                       <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => onEdit(lead)} className="text-gray-400 hover:text-nexora-neon p-1"><Edit3 size={14}/></button>
                         <button onClick={() => onDelete(lead.id)} className="text-gray-400 hover:text-red-400 p-1"><Trash2 size={14}/></button>
                       </div>
                    </div>
                    {lead.companyName && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                        <Building size={12} />
                        <span className="truncate">{lead.companyName}</span>
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mb-4 truncate">{lead.source}</div>
                    
                    <a
                      href={formatLink(lead.whatsapp)}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] py-1.5 rounded-md text-xs font-medium transition-colors"
                    >
                      <MessageCircle size={14} /> Conversar
                    </a>
                  </div>
                ))}
                {columnLeads.length === 0 && (
                  <div className="text-center p-4 border border-dashed border-white/10 rounded-lg text-gray-500 text-xs">
                    Arraste leads para cá
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// LIST VIEW
// -------------------------------------------------------------
function ListView({ leads, onEdit, formatLink, onDelete }: any) {
  return (
    <div className="bg-nexora-card border border-white/5 rounded-2xl shadow-lg overflow-hidden flex-1">
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/5 text-xs uppercase tracking-wider text-gray-400">
              <th className="p-4 font-medium">Nome & Empresa</th>
              <th className="p-4 font-medium">Status no Funil</th>
              <th className="p-4 font-medium">Origem</th>
              <th className="p-4 font-medium">Cadastrado em</th>
              <th className="p-4 font-medium text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Nenhum lead encontrado.
                </td>
              </tr>
            ) : (
              leads.map((lead: Lead) => {
                const colorObj = STATUS_COLORS[lead.status];
                return (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4">
                      <div className="font-semibold text-white">{lead.name}</div>
                      {lead.companyName && <div className="text-gray-400 text-xs mt-0.5">{lead.companyName}</div>}
                    </td>
                    <td className="p-4">
                      <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border", colorObj.bg, colorObj.text, colorObj.border)}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">{lead.source}</td>
                    <td className="p-4 text-gray-500 text-xs">{new Date(lead.date).toLocaleDateString('pt-BR')}</td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                       <a
                          href={formatLink(lead.whatsapp)}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                        >
                          <MessageCircle size={14} /> WhatsApp
                        </a>
                      <button 
                        onClick={() => onEdit(lead)}
                        className="p-1.5 text-gray-400 hover:text-nexora-neon hover:bg-nexora-neon/10 rounded-md transition-colors"
                        title="Editar"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(lead.id)}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// ADD / EDIT MODAL
// -------------------------------------------------------------
function LeadModal({ onClose, onSave, initialData }: { onClose: () => void, onSave: (data: Omit<Lead, 'id'|'date'>) => void, initialData?: Lead | null }) {
  const isEditing = !!initialData;
  const [name, setName] = useState(initialData?.name || '');
  const [companyName, setCompanyName] = useState(initialData?.companyName || '');
  const [whatsapp, setWhatsapp] = useState(initialData?.whatsapp || '');
  const [source, setSource] = useState(initialData?.source || PREDEFINED_SOURCES[0]);
  const [status, setStatus] = useState<LeadStatus>(initialData?.status || 'Novo Lead');
  const [notes, setNotes] = useState(initialData?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !whatsapp) return;
    onSave({ name, companyName, whatsapp, source, status, notes });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0f1721] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-auto">
        <div className="p-6 border-b border-white/5 flex flex-col pt-8">
          <h2 className="text-xl font-bold text-white">{isEditing ? 'Editar Lead' : 'Adicionar Novo Lead'}</h2>
          <p className="text-sm text-gray-400 mt-1">Preencha os dados do potencial cliente.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400">Nome do Lead <span className="text-red-400">*</span></label>
              <input 
                type="text" 
                required 
                value={name} 
                onChange={e => setName(e.target.value)}
                className="w-full bg-[#151f28] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-nexora-neon"
                placeholder="Ex: Carlos Oliveira"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400">Empresa (Opcional)</label>
              <input 
                type="text" 
                value={companyName} 
                onChange={e => setCompanyName(e.target.value)}
                className="w-full bg-[#151f28] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-nexora-neon"
                placeholder="Ex: Carlos LTDA"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400">WhatsApp <span className="text-red-400">*</span></label>
            <input 
              type="text" 
              required 
              value={whatsapp} 
              onChange={e => setWhatsapp(e.target.value)}
              className="w-full bg-[#151f28] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-nexora-neon"
              placeholder="(11) 99999-9999"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400">Origem</label>
              <select 
                value={source}
                onChange={e => setSource(e.target.value)}
                className="w-full bg-[#151f28] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-nexora-neon appearance-none"
              >
                {PREDEFINED_SOURCES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400">Fase no Funil</label>
              <select 
                value={status}
                onChange={e => setStatus(e.target.value as LeadStatus)}
                className="w-full bg-[#151f28] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-nexora-neon appearance-none"
              >
                {LEAD_STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400">Observações</label>
            <textarea 
              value={notes} 
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-[#151f28] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-nexora-neon min-h-[80px]"
              placeholder="Detalhes ou histórico do lead..."
            />
          </div>

          <div className="pt-4 mt-2 border-t border-white/5 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-nexora-neon hover:opacity-90 transition-opacity"
            >
              Exatamente Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
