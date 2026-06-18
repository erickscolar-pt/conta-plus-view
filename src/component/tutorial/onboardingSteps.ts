export type OfxBankGuide = {
  id: string;
  name: string;
  color: string;
  steps: string[];
  tip?: string;
};

export const OFX_BANK_GUIDES: OfxBankGuide[] = [
  {
    id: "itau",
    name: "Itaú",
    color: "#EC7000",
    steps: [
      "Acesse o Internet Banking ou app Itaú.",
      "Vá em Conta corrente → Extrato.",
      "Selecione o período desejado.",
      "Toque em Exportar / Salvar e escolha o formato OFX ou Money (.ofx).",
      "Envie o arquivo no Conta+ em Importar Extrato.",
    ],
    tip: "No app, o caminho costuma ser: Conta → Extrato → Compartilhar → OFX.",
  },
  {
    id: "nubank",
    name: "Nubank",
    color: "#820AD1",
    steps: [
      "Abra o app Nubank e entre na sua conta.",
      "Acesse Histórico ou Extrato da conta.",
      "Defina o período que deseja importar.",
      "Toque em Exportar / Compartilhar e selecione OFX (ou QIF/OFX, se disponível).",
      "Importe o .ofx no menu Importar Extrato do Conta+.",
    ],
    tip: "Se só houver CSV, exporte CSV; o Conta+ também aceita, mas OFX é o formato preferido.",
  },
  {
    id: "bradesco",
    name: "Bradesco",
    color: "#CC092F",
    steps: [
      "Entre no Bradesco Net Empresa ou app Bradesco.",
      "Abra Extrato da conta corrente.",
      "Escolha o intervalo de datas.",
      "Selecione Exportar → OFX / Microsoft Money.",
      "Faça upload do arquivo no Conta+.",
    ],
  },
  {
    id: "bb",
    name: "Banco do Brasil",
    color: "#FFF200",
    steps: [
      "Acesse BB Digital ou app Banco do Brasil.",
      "Vá em Conta corrente → Extrato.",
      "Informe o período e confirme.",
      "Use Salvar / Exportar e escolha OFX ou formato compatível.",
      "Envie pelo menu Importar Extrato no Conta+.",
    ],
    tip: "No BB, a opção pode aparecer como “Exportar extrato” ou “Download OFX”.",
  },
  {
    id: "santander",
    name: "Santander",
    color: "#EC0000",
    steps: [
      "Entre no Santander Internet Banking ou app.",
      "Acesse Extrato da conta.",
      "Selecione o período.",
      "Exporte em OFX / Money ou formato de extrato estruturado.",
      "Importe no Conta+.",
    ],
  },
  {
    id: "caixa",
    name: "Caixa",
    color: "#005CA9",
    steps: [
      "Acesse Caixa Internet Banking ou app Caixa.",
      "Abra Extrato / Movimentação da conta.",
      "Defina datas início e fim.",
      "Exporte o extrato (OFX quando disponível; senão CSV).",
      "Envie no Conta+ — OFX é o ideal para categorização automática.",
    ],
  },
  {
    id: "inter",
    name: "Banco Inter",
    color: "#FF7A00",
    steps: [
      "Abra o app ou site do Banco Inter.",
      "Vá em Conta digital → Extrato.",
      "Escolha o período.",
      "Exporte em OFX ou baixe o extrato estruturado.",
      "Importe pelo menu lateral Importar Extrato.",
    ],
  },
  {
    id: "c6",
    name: "C6 Bank",
    color: "#242424",
    steps: [
      "Entre no app C6 Bank.",
      "Acesse Extrato da conta.",
      "Selecione o intervalo de datas.",
      "Compartilhe ou exporte em OFX/CSV.",
      "Envie o arquivo OFX no Conta+ para melhor resultado.",
    ],
  },
  {
    id: "picpay",
    name: "PicPay",
    color: "#21C25E",
    steps: [
      "Abra o app PicPay → Carteira / Conta.",
      "Acesse Extrato ou Histórico de transações.",
      "Filtre o período desejado.",
      "Exporte ou compartilhe (OFX se disponível; caso contrário CSV).",
      "Importe no Conta+.",
    ],
  },
  {
    id: "mercadopago",
    name: "Mercado Pago",
    color: "#009EE3",
    steps: [
      "Acesse Mercado Pago (app ou site) → Atividade / Extrato.",
      "Filtre por período.",
      "Baixe o relatório ou extrato exportável.",
      "Prefira OFX; CSV também funciona.",
      "Envie em Importar Extrato no Conta+.",
    ],
  },
];

export type OnboardingStepId =
  | "welcome"
  | "dashboard"
  | "movimentacoes"
  | "metas"
  | "dividas"
  | "relatorios"
  | "import-ofx"
  | "ai"
  | "perfil"
  | "finish";

export type OnboardingStep = {
  id: OnboardingStepId;
  route: string;
  title: string;
  subtitle: string;
  bullets: string[];
  content?: "ofx-banks" | "default";
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "welcome",
    route: "/movimentacoes",
    title: "Bem-vindo ao Conta+",
    subtitle:
      "Este tour rápido mostra como usar a plataforma. É obrigatório na primeira vez; depois você não verá de novo.",
    bullets: [
      "Organize entradas, saídas, metas e dívidas em um só lugar.",
      "A forma principal de começar é importar seu extrato bancário em OFX.",
      "Use os botões Próximo e Anterior para navegar entre as telas.",
    ],
  },
  {
    id: "dashboard",
    route: "/dashboard",
    title: "Dashboard",
    subtitle: "Visão geral das suas finanças com gráficos e indicadores.",
    bullets: [
      "Acompanhe saldo, entradas e saídas do período.",
      "Veja gastos por categoria e evolução mensal.",
      "Ideal para entender para onde vai seu dinheiro antes de tomar decisões.",
    ],
  },
  {
    id: "movimentacoes",
    route: "/movimentacoes",
    title: "Movimentações",
    subtitle: "Registre e consulte entradas (rendas) e saídas (gastos).",
    bullets: [
      "Aba Entradas: salários, freelances, Pix recebidos e outras receitas.",
      "Aba Saídas: contas, cartão, compras e obrigações — com categorias.",
      "Filtre por data, busque lançamentos e marque pagamentos como feitos.",
      "Após importar OFX, use Recategorizar extrato se algo ficar sem categoria.",
    ],
  },
  {
    id: "metas",
    route: "/metas",
    title: "Metas",
    subtitle: "Defina objetivos financeiros e acompanhe o progresso.",
    bullets: [
      "Crie metas como viagem, reserva de emergência ou compra planejada.",
      "Informe valor alvo, categoria e se desconta do saldo disponível.",
      "Acompanhe quanto falta para concluir cada objetivo.",
    ],
  },
  {
    id: "dividas",
    route: "/dividas",
    title: "Dívidas",
    subtitle: "Controle parcelamentos e compromissos financeiros.",
    bullets: [
      "Cadastre dívidas com parcelas, vencimentos e status de pagamento.",
      "Veja o total em aberto e o que já foi quitado.",
      "Complementa o extrato importado para visão completa das obrigações.",
    ],
  },
  {
    id: "relatorios",
    route: "/relatorios",
    title: "Relatórios",
    subtitle: "Exporte e analise seus dados com mais detalhe.",
    bullets: [
      "Gere relatórios por período para revisão ou controle pessoal.",
      "Compare categorias e acompanhe tendências ao longo do tempo.",
      "Útil depois que você já importou e categorizou suas movimentações.",
    ],
  },
  {
    id: "import-ofx",
    route: "/importacao",
    title: "Importar extrato — OFX é o principal",
    subtitle:
      "A melhor forma de popular o Conta+ é exportar o extrato OFX do seu banco e enviar aqui. O sistema categoriza Pix, boletos, cartão e muito mais automaticamente.",
    bullets: [
      "No menu lateral, toque em Importar Extrato e envie o arquivo .ofx.",
      "Também aceitamos CSV, PDF e planilha Excel, mas OFX traz os melhores resultados.",
      "Abaixo estão os passos para obter o OFX em cada banco.",
    ],
    content: "ofx-banks",
  },
  {
    id: "ai",
    route: "/ai",
    title: "IA Financeira",
    subtitle: "Assistente para registrar, ajustar e recategorizar lançamentos.",
    bullets: [
      "Peça para recategorizar saídas do extrato importado em lote.",
      "Registre gastos ou marque contas como pagas por mensagem.",
      "Selecione o período no chat para focar no mês certo.",
    ],
  },
  {
    id: "perfil",
    route: "/perfil",
    title: "Perfil e configurações",
    subtitle: "Dados da conta, convites familiares e preferências.",
    bullets: [
      "Atualize nome, e-mail e senha.",
      "Convide familiares para compartilhar movimentações vinculadas.",
      "Ative notificações push no sino do topo para alertas importantes.",
    ],
  },
  {
    id: "finish",
    route: "/dashboard",
    title: "Pronto para começar!",
    subtitle: "Agora exporte o OFX do seu banco e importe — em minutos seu painel estará completo.",
    bullets: [
      "Menu lateral → Importar Extrato → envie o .ofx.",
      "Confira o Dashboard e Movimentações após a importação.",
      "Use a IA ou Recategorizar extrato se precisar ajustar categorias.",
    ],
  },
];
