import React, { createContext, useContext, useState, useEffect } from 'react';

export type ServiceCategory = 'Sistema Digital Completo' | 'Página de Vendas' | 'Página de Captura' | 'Otimização & Redesign';
export type ExpenseCategory = 'Ferramentas' | 'Infraestrutura' | 'Marketing' | 'Operacional' | 'Outros';
export type ExpenseType = 'Única' | 'Recorrente';
export type LeadStatus = 'Novo Lead' | 'Contato Iniciado' | 'Reunião Marcada' | 'Proposta Enviada' | 'Negociação' | 'Fechado' | 'Perdido';
export type ClientStatus = 'Ativo' | 'Cancelado';
export type CalendarEventType = 'Reunião' | 'Follow-up' | 'Tarefa interna';
export type EventPriority = 'Baixa' | 'Média' | 'Alta';
export type EventStatus = 'Pendente' | 'Concluído';

export interface Sale {
  id: string;
  leadId?: string;
  category: ServiceCategory;
  businessType: string;
  companyName: string;
  ownerName: string;
  whatsapp: string;
  siteUrl: string;
  price: number; // Implantação
  mrr: number; // Recorrência
  date: string;
}

export interface Client {
  id: string;
  saleId: string;
  leadId?: string;
  companyName: string;
  ownerName: string;
  whatsapp: string;
  siteUrl: string;
  category: ServiceCategory;
  price: number;
  mrr: number;
  date: string;
  status: ClientStatus;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  roles: string[];
  photoUrl: string;
  isPinned: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  date: string; // ISO String (Date + Time)
  leadId?: string;
  clientId?: string;
  memberId?: string;
  description?: string;
  priority?: EventPriority; // Mainly for Follow-up
  status: EventStatus;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: ExpenseCategory;
  description?: string;
  date: string;
  type: ExpenseType;
  isActive: boolean; // para recorrentes apenas
}

export interface Lead {
  id: string;
  name: string;
  companyName?: string;
  whatsapp: string;
  source: string;
  status: LeadStatus;
  notes?: string;
  date: string;
}

interface AppContextType {
  sales: Sale[];
  addSale: (sale: Omit<Sale, 'id' | 'date'>) => void;
  deleteSale: (id: string) => void;
  members: Member[];
  addMember: (member: Omit<Member, 'id'>) => void;
  updateMember: (id: string, updates: Partial<Omit<Member, 'id'>>) => void;
  togglePinMember: (id: string) => void;
  deleteMember: (id: string) => void;
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
  toggleExpenseStatus: (id: string) => void;
  deleteExpense: (id: string) => void;
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'date'>) => void;
  updateLead: (id: string, updates: Partial<Omit<Lead, 'id' | 'date'>>) => void;
  deleteLead: (id: string) => void;
  clients: Client[];
  updateClientStatus: (id: string, status: ClientStatus) => void;
  deleteClient: (id: string) => void;
  agendaEvents: CalendarEvent[];
  addAgendaEvent: (event: Omit<CalendarEvent, 'id' | 'status'>) => void;
  updateAgendaEventStatus: (id: string, status: EventStatus) => void;
  deleteAgendaEvent: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialSales: Sale[] = [
  {
    id: 's1',
    category: 'Sistema Digital Completo',
    businessType: 'Clínica Odontológica',
    companyName: 'Sorriso Fácil',
    ownerName: 'Dr. Carlos',
    whatsapp: '11999999999',
    siteUrl: 'sorrisofacil.com.br',
    price: 3500,
    mrr: 150,
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 's2',
    category: 'Página de Vendas',
    businessType: 'Infoprodutor',
    companyName: 'Mestre das Vendas',
    ownerName: 'João Silva',
    whatsapp: '11988888888',
    siteUrl: 'mestredasvendas.com',
    price: 1200,
    mrr: 0,
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 's3',
    category: 'Página de Captura',
    businessType: 'Agência de Marketing',
    companyName: 'Marketing Pro',
    ownerName: 'Marina Costa',
    whatsapp: '11977777777',
    siteUrl: 'marketingpro.com/captura',
    price: 800,
    mrr: 0,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
    {
    id: 's4',
    category: 'Sistema Digital Completo',
    businessType: 'Restaurante',
    companyName: 'Bistrô Sabor',
    ownerName: 'Ana Paula',
    whatsapp: '11966666666',
    siteUrl: 'bistrosabor.com',
    price: 2500,
    mrr: 100,
    date: new Date().toISOString()
  }
];

const initialMembers: Member[] = [
  {
    id: 'm1',
    firstName: 'Lucas',
    lastName: 'Andrade',
    roles: ['CEO', 'Desenvolvedor Full Stack'],
    photoUrl: 'https://i.pravatar.cc/150?u=lucas',
    isPinned: true
  },
  {
    id: 'm2',
    firstName: 'Sofia',
    lastName: 'Ribeiro',
    roles: ['UX/UI Designer'],
    photoUrl: 'https://i.pravatar.cc/150?u=sofia',
    isPinned: false
  }
];

const initialExpenses: Expense[] = [
  {
    id: 'e1',
    name: 'Hospedagem AWS',
    amount: 150,
    category: 'Infraestrutura',
    description: 'Servidores e banco de dados',
    date: new Date().toISOString(),
    type: 'Recorrente',
    isActive: true
  },
  {
    id: 'e2',
    name: 'Anúncios Facebook Ads',
    amount: 500,
    category: 'Marketing',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'Única',
    isActive: false
  }
];

const initialLeads: Lead[] = [
  {
    id: 'l1',
    name: 'Pedro Gomes',
    companyName: 'Gomes Advocacia',
    whatsapp: '11955554444',
    source: 'Tráfego Pago',
    status: 'Novo Lead',
    notes: 'Precisa de um site para o escritório.',
    date: new Date().toISOString()
  },
  {
    id: 'l2',
    name: 'Fernanda Lima',
    whatsapp: '11933332222',
    source: 'TikTok',
    status: 'Contato Iniciado',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'l3',
    name: 'Ricardo Alves',
    companyName: 'Alves Construções',
    whatsapp: '11911110000',
    source: 'Indicação',
    status: 'Negociação',
    notes: 'Aguardando aprovação do orçamento para landing page.',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const initialClients: Client[] = initialSales.map(sale => ({
  id: 'c_' + sale.id,
  saleId: sale.id,
  companyName: sale.companyName,
  ownerName: sale.ownerName,
  whatsapp: sale.whatsapp,
  siteUrl: sale.siteUrl,
  category: sale.category,
  price: sale.price,
  mrr: sale.mrr,
  date: sale.date,
  status: 'Ativo'
}));

const initialAgendaEvents: CalendarEvent[] = [
  {
    id: 'evt1',
    title: 'Reunião de Alinhamento',
    type: 'Reunião',
    date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // Em 2 horas
    status: 'Pendente',
    clientId: 'c_s1'
  },
  {
    id: 'evt2',
    title: 'Cobrar proposta',
    type: 'Follow-up',
    date: new Date().toISOString(), // Hoje
    status: 'Pendente',
    priority: 'Alta',
    leadId: 'l2'
  },
  {
    id: 'evt3',
    title: 'Configurar domínio',
    type: 'Tarefa interna',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Ontem
    status: 'Pendente',
    memberId: 'm1'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('nexora_sales');
    return saved ? JSON.parse(saved) : initialSales;
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('nexora_members');
    return saved ? JSON.parse(saved) : initialMembers;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('nexora_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('nexora_leads');
    return saved ? JSON.parse(saved) : initialLeads;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('nexora_clients');
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [agendaEvents, setAgendaEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('nexora_events');
    return saved ? JSON.parse(saved) : initialAgendaEvents;
  });

  useEffect(() => {
    localStorage.setItem('nexora_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('nexora_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('nexora_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('nexora_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('nexora_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('nexora_events', JSON.stringify(agendaEvents));
  }, [agendaEvents]);

  const addSale = (saleData: Omit<Sale, 'id' | 'date'>) => {
    const newSaleId = Math.random().toString(36).substr(2, 9);
    const newSale: Sale = {
      ...saleData,
      id: newSaleId,
      date: new Date().toISOString()
    };
    setSales(prev => [newSale, ...prev]);

    if (saleData.leadId) {
      updateLead(saleData.leadId, { status: 'Fechado' });
    }

    const newClient: Client = {
      id: Math.random().toString(36).substr(2, 9),
      saleId: newSale.id,
      leadId: newSale.leadId,
      companyName: newSale.companyName,
      ownerName: newSale.ownerName,
      whatsapp: newSale.whatsapp,
      siteUrl: newSale.siteUrl,
      category: newSale.category,
      price: newSale.price,
      mrr: newSale.mrr,
      date: newSale.date,
      status: 'Ativo'
    };
    setClients(prev => [newClient, ...prev]);
  };

  const deleteSale = (id: string) => {
    setSales(prev => prev.filter(s => s.id !== id));
  }

  const addMember = (memberData: Omit<Member, 'id'>) => {
    const newMember: Member = {
      ...memberData,
      id: Math.random().toString(36).substr(2, 9)
    };
    setMembers(prev => [...prev, newMember]);
  };

  const updateMember = (id: string, updates: Partial<Omit<Member, 'id'>>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const togglePinMember = (id: string) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, isPinned: !m.isPinned } : m));
  };

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const addExpense = (expenseData: Omit<Expense, 'id' | 'date'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString()
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const toggleExpenseStatus = (id: string) => {
    setExpenses(prev => prev.map(e => (e.id === id ? { ...e, isActive: !e.isActive } : e)));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const addLead = (leadData: Omit<Lead, 'id' | 'date'>) => {
    const newLead: Lead = {
      ...leadData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString()
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const updateLead = (id: string, updates: Partial<Omit<Lead, 'id' | 'date'>>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  const updateClientStatus = (id: string, status: ClientStatus) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const addAgendaEvent = (eventData: Omit<CalendarEvent, 'id' | 'status'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Pendente'
    };
    setAgendaEvents(prev => [...prev].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).concat(newEvent));
  };

  const updateAgendaEventStatus = (id: string, status: EventStatus) => {
    setAgendaEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  };

  const deleteAgendaEvent = (id: string) => {
    setAgendaEvents(prev => prev.filter(e => e.id !== id));
  };

  return (
    <AppContext.Provider value={{
      sales, addSale, deleteSale,
      members, addMember, updateMember, togglePinMember, deleteMember,
      expenses, addExpense, toggleExpenseStatus, deleteExpense,
      leads, addLead, updateLead, deleteLead,
      clients, updateClientStatus, deleteClient,
      agendaEvents, addAgendaEvent, updateAgendaEventStatus, deleteAgendaEvent
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
