import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area 
} from 'recharts';
import { DollarSign, TrendingUp, CreditCard, Activity, ArrowDownRight, ArrowUpRight } from 'lucide-react';

const COLORS = ['#00d4ff', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981'];

export default function Dashboard() {
  const { sales, expenses } = useAppContext();

  // Metrics Sales
  const grossRevenue = sales.reduce((acc, sale) => acc + sale.price + sale.mrr, 0);
  const implementationRevenue = sales.reduce((acc, sale) => acc + sale.price, 0);
  const currentMRR = sales.reduce((acc, sale) => acc + sale.mrr, 0);

  // Metrics Expenses
  const activeRecurringExpenses = expenses.filter(e => e.type === 'Recorrente' && e.isActive).reduce((acc, e) => acc + e.amount, 0);
  const totalUniqueExpenses = expenses.filter(e => e.type === 'Única').reduce((acc, e) => acc + e.amount, 0);
  const totalExpensesAllTime = expenses.reduce((acc, e) => acc + e.amount, 0);

  // Real Liquid Calculation (Faturamento Líquido = Faturamento - Despesas Totais)
  const netRevenue = grossRevenue - totalExpensesAllTime;
  // Monthly Cash Flow Snapshot
  const estimatedMonthlyProfit = currentMRR - activeRecurringExpenses;

  // Format currency
  const formatSec = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Chart 1: Cash Flow (Receitas x Despesas)
  const cashFlowData = useMemo(() => {
    const dataByMonth: Record<string, { month: string, receita: number, despesa: number }> = {};
    
    // Add sales
    sales.forEach(sale => {
      const date = new Date(sale.date);
      const month = date.toLocaleDateString('pt-BR', { month: 'short' });
      if (!dataByMonth[month]) dataByMonth[month] = { month, receita: 0, despesa: 0 };
      dataByMonth[month].receita += sale.price;
      // MRR accumulates, simplified here as just the initial sign up value for history length
      dataByMonth[month].receita += sale.mrr; 
    });

    // Add expenses
    expenses.forEach(e => {
      const date = new Date(e.date);
      const month = date.toLocaleDateString('pt-BR', { month: 'short' });
      if (!dataByMonth[month]) dataByMonth[month] = { month, receita: 0, despesa: 0 };
      dataByMonth[month].despesa += e.amount;
    });

    return Object.values(dataByMonth).reverse();
  }, [sales, expenses]);

  // Chart 2: Revenue Split (Implementation vs Recurrence)
  const splitData = [
    { name: 'Implantação', value: implementationRevenue },
    { name: 'Recorrência', value: currentMRR }
  ];

  // Chart 3: Sales by Category
  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    sales.forEach(s => {
      data[s.category] = (data[s.category] || 0) + 1;
    });
    return Object.keys(data).map(key => ({ name: key, value: data[key] }));
  }, [sales]);

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Financeiro</h1>
        <p className="text-gray-400 mt-1">Gestão de caixa, receitas e controle de lucros da agência.</p>
      </header>

      {/* Main Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard 
          title="Faturamento Bruto" 
          value={formatSec(grossRevenue)} 
          icon={<ArrowUpRight size={16} />}
          gradient="from-blue-500/10 to-transparent"
          textColor="text-nexora-neon"
        />
        <MetricCard 
          title="Despesas Totais" 
          value={formatSec(totalExpensesAllTime)} 
          icon={<ArrowDownRight size={16} />}
          gradient="from-rose-500/10 to-transparent"
          textColor="text-rose-400"
        />
        <MetricCard 
          title="Lucro Líquido Real" 
          value={formatSec(netRevenue)} 
          icon={<DollarSign size={16} />}
          gradient="from-green-500/10 to-transparent"
          textColor={netRevenue >= 0 ? "text-green-400" : "text-rose-400"}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
         <MetricCard 
          title="MRR (Receita Recorrente)" 
          value={formatSec(currentMRR)} 
          icon={<TrendingUp size={16} />}
          gradient="from-blue-500/10 to-transparent"
          textColor="text-blue-400"
        />
        <MetricCard 
          title="Despesas Fixas (Mês)" 
          value={formatSec(activeRecurringExpenses)} 
          icon={<Activity size={16} />}
          gradient="from-orange-500/10 to-transparent"
          textColor="text-orange-400"
        />
        <MetricCard 
          title="Previsão Fluxo (Mês)" 
          value={formatSec(estimatedMonthlyProfit)} 
          icon={<Activity size={16} />}
          gradient="from-emerald-500/10 to-transparent"
          textColor={estimatedMonthlyProfit >= 0 ? "text-emerald-400" : "text-rose-400"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-nexora-card border border-white/5 rounded-2xl p-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-nexora-neon/5 blur-[100px] rounded-full pointer-events-none"></div>
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">Fluxo de Caixa <span className="text-sm font-normal text-gray-500">(Receitas x Despesas)</span></h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="#9ca3af" 
                  fontSize={12} 
                  tickFormatter={(val) => `R$${val}`}
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
                  contentStyle={{ backgroundColor: '#151f28', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number) => formatSec(value)}
                />
                <Legend />
                <Area type="monotone" dataKey="receita" name="Receitas" stroke="#00d4ff" fillOpacity={1} fill="url(#colorReceita)" strokeWidth={2} />
                <Area type="monotone" dataKey="despesa" name="Despesas" stroke="#f43f5e" fillOpacity={1} fill="url(#colorDespesa)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Chart */}
        <div className="bg-nexora-card border border-white/5 rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">Receita <span className="text-sm font-normal text-gray-500">(Implantação vs MRR)</span></h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={splitData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {splitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: number) => formatSec(val)}
                  contentStyle={{ backgroundColor: '#151f28', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-nexora-card border border-white/5 rounded-2xl p-6 shadow-lg mt-6">
          <h2 className="text-lg font-semibold mb-6">Composição de Serviços Vendidos (Qtd)</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={categoryData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                 <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                 <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#151f28', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                 />
                 <Line type="monotone" dataKey="value" name="Vendas" stroke="#00d4ff" strokeWidth={3} dot={{ fill: '#00d4ff', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, gradient, textColor }: { title: string, value: string | number, icon: React.ReactNode, gradient: string, textColor: string }) {
  return (
    <div className="bg-nexora-card border border-white/5 rounded-xl p-5 shadow-sm relative overflow-hidden group">
      <div className={`absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-br ${gradient} opacity-30 group-hover:opacity-60 transition-opacity pointer-events-none`}></div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className={textColor}>{icon}</div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{title}</p>
        </div>
        <p className={`text-2xl font-semibold tracking-tight ${textColor}`}>{value}</p>
      </div>
    </div>
  );
}
