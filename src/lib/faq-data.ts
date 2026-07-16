export type FAQItemData = {
  id:
    | "advance-booking"
    | "bridal-trial"
    | "references"
    | "dress-accessories"
    | "appointment-confirmation"
    | "additional-services";
  number: string;
  question: string;
  answer: string;
  temporaryBusinessRule: boolean;
  active: boolean;
};

export const faqItems: FAQItemData[] = [
  {
    id: "advance-booking",
    number: "01",
    question: "Com quanto tempo de antecedência devo agendar?",
    answer:
      "O ideal é reservar o horário assim que a data do evento estiver definida, especialmente para noivas e atendimentos em períodos de maior procura. A disponibilidade depende da agenda.",
    temporaryBusinessRule: true,
    active: true,
  },
  {
    id: "bridal-trial",
    number: "02",
    question: "É possível fazer um teste antes do casamento?",
    answer:
      "Sim. O teste ajuda a alinhar expectativas, escolher os detalhes do penteado e garantir que tudo esteja em harmonia com seu estilo, vestido e ocasião.",
    temporaryBusinessRule: true,
    active: true,
  },
  {
    id: "references",
    number: "03",
    question: "Posso enviar referências do penteado?",
    answer:
      "Sim. As referências ajudam a entender suas preferências. A partir delas, o penteado pode ser adaptado ao seu cabelo, formato do rosto, vestido, acessórios e estilo pessoal.",
    temporaryBusinessRule: false,
    active: true,
  },
  {
    id: "dress-accessories",
    number: "04",
    question: "O penteado é pensado de acordo com o vestido?",
    answer:
      "Sim. O modelo do vestido, o decote, os acessórios, o estilo da cerimônia e suas preferências são considerados para criar um resultado equilibrado e personalizado.",
    temporaryBusinessRule: false,
    active: true,
  },
  {
    id: "appointment-confirmation",
    number: "05",
    question: "Como funciona a confirmação do horário?",
    answer:
      "Após a escolha do serviço, data e horário, a confirmação seguirá as regras definidas no sistema de agendamento ou pelo canal indicado. As condições finais devem ser revisadas antes da publicação.",
    temporaryBusinessRule: true,
    active: true,
  },
  {
    id: "additional-services",
    number: "06",
    question: "Quais outros serviços você também realiza?",
    answer:
      "Além dos penteados para noivas, debutantes e festas, também são oferecidos serviços de coloração, lavagem, escova e finalização personalizada.",
    temporaryBusinessRule: false,
    active: true,
  },
];
