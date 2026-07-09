import type { ModuleKey } from "./i18n/dictionaries";

export const dashboardMetrics = {
  revenueCents: 342000,
  appointments: 18,
  averageTicketCents: 12600,
  occupancy: 78,
  pendingCommissionsCents: 86400,
  lowStockCount: 4,
};

export const todayAppointments = [
  {
    time: "09:00",
    client: "Lucas Almeida",
    service: "Corte Masculino",
    professional: "Joao Barbeiro",
    status: "confirmed",
  },
  {
    time: "10:30",
    client: "Patricia Lima",
    service: "Sobrancelha",
    professional: "Carlos Profissional",
    status: "scheduled",
  },
  {
    time: "11:00",
    client: "Fernanda Souza",
    service: "Corte Feminino",
    professional: "Ana Cabeleireira",
    status: "scheduled",
  },
  {
    time: "14:00",
    client: "Rafael Nunes",
    service: "Barba",
    professional: "Joao Barbeiro",
    status: "arrived",
  },
];

export const revenueSeries = [42000, 51000, 63000, 58000, 76000, 52000, 34200];

export const openCommands = [
  {
    client: "Rafael Nunes",
    items: "Barba + Pomada",
    amountCents: 9000,
    status: "open",
  },
  {
    client: "Camila Rocha",
    items: "Escova",
    amountCents: 7500,
    status: "pending",
  },
];

export const stockAlerts = [
  {
    name: "Pomada Modeladora",
    quantity: 4,
    minimum: 5,
  },
  {
    name: "Oxidante 20 volumes",
    quantity: 2,
    minimum: 3,
  },
  {
    name: "Lamina navalha",
    quantity: 12,
    minimum: 20,
  },
];

export const professionalPerformance = [
  {
    name: "Joao Barbeiro",
    revenueCents: 182000,
    occupancy: 86,
    satisfaction: 4.9,
  },
  {
    name: "Ana Cabeleireira",
    revenueCents: 214000,
    occupancy: 74,
    satisfaction: 4.8,
  },
  {
    name: "Carlos Profissional",
    revenueCents: 98000,
    occupancy: 68,
    satisfaction: 4.7,
  },
];

export type ModuleRow = {
  title: string;
  meta: string;
  value: string;
  status: keyof typeof statusTone;
};

export const statusTone = {
  scheduled: "bg-sky-50 text-sky-700 ring-sky-100",
  confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  arrived: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  inProgress: "bg-amber-50 text-amber-700 ring-amber-100",
  completed: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  missed: "bg-rose-50 text-rose-700 ring-rose-100",
  cancelled: "bg-zinc-100 text-zinc-500 ring-zinc-200",
  open: "bg-amber-50 text-amber-700 ring-amber-100",
  closed: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  pending: "bg-orange-50 text-orange-700 ring-orange-100",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  lowStock: "bg-rose-50 text-rose-700 ring-rose-100",
  active: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  inactive: "bg-zinc-100 text-zinc-600 ring-zinc-200",
};

export const moduleRows: Record<ModuleKey, ModuleRow[]> = {
  calendar: [
    {
      title: "Lucas Almeida",
      meta: "09:00 · Corte Masculino · Joao",
      value: "50 min",
      status: "confirmed",
    },
    {
      title: "Fernanda Souza",
      meta: "11:00 · Corte Feminino · Ana",
      value: "70 min",
      status: "scheduled",
    },
    {
      title: "Patricia Lima",
      meta: "14:30 · Sobrancelha · Carlos",
      value: "30 min",
      status: "scheduled",
    },
  ],
  clients: [
    {
      title: "Lucas Almeida",
      meta: "WhatsApp ativo · Ticket medio R$ 92,00",
      value: "Ultima visita: 05/07",
      status: "active",
    },
    {
      title: "Fernanda Souza",
      meta: "Alergia cadastrada · Consentimento LGPD",
      value: "R$ 185,00",
      status: "active",
    },
    {
      title: "Patricia Lima",
      meta: "1 falta registrada · Opt-out marketing",
      value: "Inativa",
      status: "inactive",
    },
  ],
  professionals: [
    {
      title: "Joao Barbeiro",
      meta: "Corte masculino, barba, degrade",
      value: "45%",
      status: "active",
    },
    {
      title: "Ana Cabeleireira",
      meta: "Corte feminino, escova, coloracao",
      value: "40%",
      status: "active",
    },
    {
      title: "Carlos Profissional",
      meta: "Sobrancelha, tratamentos, manicure",
      value: "38%",
      status: "active",
    },
  ],
  services: [
    {
      title: "Corte Masculino",
      meta: "Barbearia · 40 min + 10 min limpeza",
      value: "R$ 60,00",
      status: "active",
    },
    {
      title: "Coloracao",
      meta: "Cabelo feminino · exige sinal",
      value: "R$ 220,00",
      status: "active",
    },
    {
      title: "Sobrancelha",
      meta: "Beleza · agendamento online",
      value: "R$ 40,00",
      status: "active",
    },
  ],
  commands: [
    {
      title: "Comanda #1042",
      meta: "Lucas Almeida · Corte + Pomada",
      value: "R$ 115,00",
      status: "closed",
    },
    {
      title: "Comanda #1043",
      meta: "Rafael Nunes · Barba",
      value: "R$ 45,00",
      status: "open",
    },
    {
      title: "Comanda #1044",
      meta: "Camila Rocha · Escova",
      value: "Parcial",
      status: "pending",
    },
  ],
  financial: [
    {
      title: "Caixa Unidade Centro",
      meta: "Abertura R$ 200,00 · esperado R$ 3.150,00",
      value: "Sem diferenca",
      status: "closed",
    },
    {
      title: "Comissoes da semana",
      meta: "Joao, Ana e Carlos",
      value: "R$ 864,00",
      status: "pending",
    },
    {
      title: "Contas a pagar",
      meta: "Fornecedor Beleza Pro",
      value: "R$ 1.280,00",
      status: "pending",
    },
  ],
  inventory: [
    {
      title: "Pomada Modeladora",
      meta: "4 unidades · minimo 5",
      value: "Comprar",
      status: "lowStock",
    },
    {
      title: "Oxidante 20 volumes",
      meta: "2 unidades · lote 26A",
      value: "Baixo",
      status: "lowStock",
    },
    {
      title: "Shampoo Hidratante",
      meta: "18 unidades · venda e uso interno",
      value: "OK",
      status: "active",
    },
  ],
  marketing: [
    {
      title: "Confirmacao de agendamento",
      meta: "WhatsApp · gatilho automatico",
      value: "Ativa",
      status: "active",
    },
    {
      title: "Aniversariantes",
      meta: "Mensagem mensal · 42 contatos",
      value: "Rascunho",
      status: "pending",
    },
    {
      title: "Clientes inativos",
      meta: "45 dias sem retorno · respeita opt-out",
      value: "Pronta",
      status: "active",
    },
  ],
  reports: [
    {
      title: "Ocupacao media",
      meta: "Agenda dos ultimos 30 dias",
      value: "78%",
      status: "active",
    },
    {
      title: "No-show",
      meta: "Faltas confirmadas no periodo",
      value: "12%",
      status: "pending",
    },
    {
      title: "Servico mais rentavel",
      meta: "Coloracao · margem estimada",
      value: "R$ 9.240",
      status: "active",
    },
  ],
  settings: [
    {
      title: "Idioma padrao",
      meta: "Aplicado ao negocio e novas contas",
      value: "pt-BR",
      status: "active",
    },
    {
      title: "WhatsApp Cloud API",
      meta: "Arquitetura pronta · credenciais pendentes",
      value: "Mock",
      status: "pending",
    },
    {
      title: "Exportacao LGPD",
      meta: "Dados e consentimentos por cliente",
      value: "Ativa",
      status: "active",
    },
  ],
};
