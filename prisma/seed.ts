import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  AppointmentSource,
  AppointmentStatus,
  CommandItemType,
  CommandStatus,
  CommissionStatus,
  Locale,
  MessageChannel,
  MessageStatus,
  PaymentMethod,
  PaymentStatus,
  PrismaClient,
  StockMovementType,
  UserRole,
} from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/salon_saas?schema=public",
});

const prisma = new PrismaClient({ adapter });

const businessSlug = "kesia-dutra-cabeleireira";
const password = "@135LuccaDutra";

async function resetDatabase() {
  await prisma.$transaction([
    prisma.auditLog.deleteMany(),
    prisma.sentMessage.deleteMany(),
    prisma.marketingCampaign.deleteMany(),
    prisma.messageTemplate.deleteMany(),
    prisma.review.deleteMany(),
    prisma.stockMovement.deleteMany(),
    prisma.commandItem.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.commission.deleteMany(),
    prisma.commissionPayment.deleteMany(),
    prisma.command.deleteMany(),
    prisma.appointmentItem.deleteMany(),
    prisma.appointment.deleteMany(),
    prisma.clientPackage.deleteMany(),
    prisma.packageItem.deleteMany(),
    prisma.package.deleteMany(),
    prisma.subscription.deleteMany(),
    prisma.professionalService.deleteMany(),
    prisma.service.deleteMany(),
    prisma.serviceCategory.deleteMany(),
    prisma.product.deleteMany(),
    prisma.productCategory.deleteMany(),
    prisma.supplier.deleteMany(),
    prisma.expense.deleteMany(),
    prisma.expenseCategory.deleteMany(),
    prisma.cashRegister.deleteMany(),
    prisma.client.deleteMany(),
    prisma.professional.deleteMany(),
    prisma.rolePermission.deleteMany(),
    prisma.permission.deleteMany(),
    prisma.role.deleteMany(),
    prisma.user.deleteMany(),
    prisma.branch.deleteMany(),
    prisma.setting.deleteMany(),
    prisma.translation.deleteMany(),
    prisma.business.deleteMany(),
  ]);
}

async function main() {
  await resetDatabase();

  const passwordHash = await hash(password, 10);
  const business = await prisma.business.create({
    data: {
      name: "Késia Dutra Cabeleireira",
      slug: businessSlug,
      responsibleName: "Késia Dutra",
      document: "12.345.678/0001-90",
      email: "contato@kesiadutra.com.br",
      phone: "(11) 3333-2222",
      whatsapp: "5511999990000",
      addressLine: "Rua das Flores, 120",
      addressNumber: "120",
      addressComplement: "Sala 2",
      neighborhood: "Centro",
      city: "Sao Paulo",
      state: "SP",
      postalCode: "01000-000",
      defaultLocale: Locale.PT_BR,
      cancellationPolicy:
        "Cancelamentos devem ser feitos com pelo menos 6 horas de antecedencia.",
      openingHours: {
        monday: ["09:00", "19:00"],
        tuesday: ["09:00", "19:00"],
        wednesday: ["09:00", "19:00"],
        thursday: ["09:00", "20:00"],
        friday: ["09:00", "20:00"],
        saturday: ["08:00", "17:00"],
      },
      bookingRules: {
        minimumNoticeHours: 2,
        maxAdvanceDays: 45,
        allowAnyProfessional: true,
      },
    },
  });

  const branch = await prisma.branch.create({
    data: {
      businessId: business.id,
      name: "Unidade Centro",
      addressLine: "Rua das Flores, 120",
      city: "Sao Paulo",
      state: "SP",
      phone: "(11) 3333-2222",
      whatsapp: "5511999990000",
    },
  });

  const permissions = await Promise.all(
    [
      ["manage", "appointments", "Gerenciar agenda"],
      ["manage", "clients", "Gerenciar clientes"],
      ["manage", "professionals", "Gerenciar profissionais"],
      ["manage", "services", "Gerenciar servicos"],
      ["manage", "commands", "Gerenciar comandas"],
      ["manage", "financial", "Gerenciar financeiro"],
      ["manage", "inventory", "Gerenciar estoque"],
      ["export", "reports", "Exportar relatorios"],
      ["approve", "discounts", "Aprovar descontos elevados"],
      ["manage", "settings", "Gerenciar configuracoes"],
    ].map(([action, subject, description]) =>
      prisma.permission.create({
        data: { businessId: business.id, action, subject, description },
      }),
    ),
  );

  const ownerRole = await prisma.role.create({
    data: {
      businessId: business.id,
      name: "Proprietario",
      systemRole: UserRole.BUSINESS_OWNER,
      permissions: {
        create: permissions.map((permission) => ({
          permissionId: permission.id,
        })),
      },
    },
  });

  const receptionistRole = await prisma.role.create({
    data: {
      businessId: business.id,
      name: "Recepcao",
      systemRole: UserRole.RECEPTIONIST,
      permissions: {
        create: permissions
          .filter((permission) =>
            ["appointments", "clients", "commands"].includes(permission.subject),
          )
          .map((permission) => ({ permissionId: permission.id })),
      },
    },
  });

  const owner = await prisma.user.create({
    data: {
      businessId: business.id,
      roleId: ownerRole.id,
      email: "edineif@gmail.com",
      passwordHash,
      name: "Marina Proprietaria",
      phone: "(11) 98888-1111",
      role: UserRole.BUSINESS_OWNER,
    },
  });

  const receptionist = await prisma.user.create({
    data: {
      businessId: business.id,
      roleId: receptionistRole.id,
      email: "recepcao@barbeariamodelo.com",
      passwordHash,
      name: "Bianca Recepcao",
      phone: "(11) 97777-2222",
      role: UserRole.RECEPTIONIST,
    },
  });

  const [joaoUser, anaUser, carlosUser] = await Promise.all(
    [
      ["joao@barbeariamodelo.com", "Joao Barbeiro"],
      ["ana@barbeariamodelo.com", "Ana Cabeleireira"],
      ["carlos@barbeariamodelo.com", "Carlos Profissional"],
    ].map(([email, name]) =>
      prisma.user.create({
        data: {
          businessId: business.id,
          email,
          passwordHash,
          name,
          role: UserRole.PROFESSIONAL,
        },
      }),
    ),
  );

  const [joao, ana, carlos] = await Promise.all([
    prisma.professional.create({
      data: {
        businessId: business.id,
        userId: joaoUser.id,
        displayName: "Joao Barbeiro",
        specialties: ["Corte masculino", "Barba", "Degrade"],
        defaultCommissionRate: 45,
        monthlyTargetCents: 1800000,
        satisfactionScore: 4.9,
        workingHours: {
          monday: ["09:00", "19:00"],
          tuesday: ["09:00", "19:00"],
          thursday: ["09:00", "20:00"],
          friday: ["09:00", "20:00"],
          saturday: ["08:00", "17:00"],
        },
      },
    }),
    prisma.professional.create({
      data: {
        businessId: business.id,
        userId: anaUser.id,
        displayName: "Ana Cabeleireira",
        specialties: ["Corte feminino", "Escova", "Coloracao"],
        defaultCommissionRate: 40,
        monthlyTargetCents: 2200000,
        satisfactionScore: 4.8,
      },
    }),
    prisma.professional.create({
      data: {
        businessId: business.id,
        userId: carlosUser.id,
        displayName: "Carlos Profissional",
        specialties: ["Sobrancelha", "Tratamentos", "Manicure"],
        defaultCommissionRate: 38,
        monthlyTargetCents: 1200000,
        satisfactionScore: 4.7,
      },
    }),
  ]);

  const categories = await Promise.all(
    [
      ["Barbearia", "#2563eb"],
      ["Cabelo feminino", "#be185d"],
      ["Beleza", "#059669"],
    ].map(([name, color]) =>
      prisma.serviceCategory.create({
        data: { businessId: business.id, name, color },
      }),
    ),
  );

  const [barbearia, feminino, beleza] = categories;

  const services = await Promise.all([
    prisma.service.create({
      data: {
        businessId: business.id,
        categoryId: barbearia.id,
        name: "Corte Masculino",
        description: "Corte com acabamento e finalizacao.",
        priceCents: 6000,
        durationMinutes: 40,
        cleanupMinutes: 10,
        commissionRate: 45,
      },
    }),
    prisma.service.create({
      data: {
        businessId: business.id,
        categoryId: barbearia.id,
        name: "Barba",
        description: "Barba completa com toalha quente.",
        priceCents: 4500,
        durationMinutes: 30,
        cleanupMinutes: 5,
        commissionRate: 45,
      },
    }),
    prisma.service.create({
      data: {
        businessId: business.id,
        categoryId: feminino.id,
        name: "Corte Feminino",
        description: "Corte, lavagem e finalizacao.",
        priceCents: 9500,
        durationMinutes: 70,
        preparationMinutes: 10,
        cleanupMinutes: 10,
        commissionRate: 40,
      },
    }),
    prisma.service.create({
      data: {
        businessId: business.id,
        categoryId: feminino.id,
        name: "Escova",
        description: "Escova modelada.",
        priceCents: 7500,
        durationMinutes: 50,
        commissionRate: 40,
      },
    }),
    prisma.service.create({
      data: {
        businessId: business.id,
        categoryId: feminino.id,
        name: "Coloracao",
        description: "Coloracao com diagnostico de fios.",
        priceCents: 22000,
        durationMinutes: 150,
        preparationMinutes: 15,
        cleanupMinutes: 15,
        commissionRate: 35,
        depositRequired: true,
        depositCents: 5000,
      },
    }),
    prisma.service.create({
      data: {
        businessId: business.id,
        categoryId: beleza.id,
        name: "Sobrancelha",
        description: "Design de sobrancelha.",
        priceCents: 4000,
        durationMinutes: 30,
        commissionRate: 38,
      },
    }),
  ]);

  await prisma.professionalService.createMany({
    data: [
      { professionalId: joao.id, serviceId: services[0].id, commissionRate: 45 },
      { professionalId: joao.id, serviceId: services[1].id, commissionRate: 45 },
      { professionalId: ana.id, serviceId: services[2].id, commissionRate: 40 },
      { professionalId: ana.id, serviceId: services[3].id, commissionRate: 40 },
      { professionalId: ana.id, serviceId: services[4].id, commissionRate: 35 },
      { professionalId: carlos.id, serviceId: services[5].id, commissionRate: 38 },
    ],
  });

  const [cliente1, cliente2] = await Promise.all([
    prisma.client.create({
      data: {
        businessId: business.id,
        preferredProfessionalId: joao.id,
        name: "Lucas Almeida",
        phone: "(11) 95555-1010",
        whatsapp: "5511955551010",
        email: "lucas@example.com",
        marketingConsent: true,
        photoConsent: true,
        averageTicketCents: 9200,
        lastVisitAt: new Date("2026-07-05T14:00:00-03:00"),
        hairFormula: "Maquina 1 nas laterais, tesoura no topo.",
      },
    }),
    prisma.client.create({
      data: {
        businessId: business.id,
        preferredProfessionalId: ana.id,
        name: "Fernanda Souza",
        phone: "(11) 94444-2020",
        whatsapp: "5511944442020",
        email: "fernanda@example.com",
        marketingConsent: true,
        averageTicketCents: 18500,
        lastVisitAt: new Date("2026-07-03T10:00:00-03:00"),
        allergies: "Sensibilidade a amonia.",
      },
    }),
    prisma.client.create({
      data: {
        businessId: business.id,
        preferredProfessionalId: carlos.id,
        name: "Patricia Lima",
        phone: "(11) 93333-3030",
        whatsapp: "5511933333030",
        marketingConsent: false,
        averageTicketCents: 4000,
        noShowCount: 1,
      },
    }),
  ]);

  const supplier = await prisma.supplier.create({
    data: {
      businessId: business.id,
      name: "Distribuidora Beleza Pro",
      phone: "(11) 3222-4000",
    },
  });

  const productCategory = await prisma.productCategory.create({
    data: { businessId: business.id, name: "Finalizadores" },
  });

  const pomada = await prisma.product.create({
    data: {
      businessId: business.id,
      categoryId: productCategory.id,
      supplierId: supplier.id,
      name: "Pomada Modeladora",
      costCents: 2200,
      salePriceCents: 4500,
      stockQuantity: 8,
      minimumStock: 5,
      retail: true,
    },
  });

  await prisma.stockMovement.create({
    data: {
      businessId: business.id,
      productId: pomada.id,
      type: StockMovementType.ENTRY,
      quantity: 12,
      unitCostCents: 2200,
      reason: "Estoque inicial",
    },
  });

  const todayStart = new Date("2026-07-07T09:00:00-03:00");
  const appointment = await prisma.appointment.create({
    data: {
      businessId: business.id,
      branchId: branch.id,
      clientId: cliente1.id,
      professionalId: joao.id,
      status: AppointmentStatus.CONFIRMED,
      source: AppointmentSource.MANUAL,
      startsAt: todayStart,
      endsAt: new Date("2026-07-07T09:50:00-03:00"),
      items: {
        create: {
          serviceId: services[0].id,
          priceCents: services[0].priceCents,
          durationMinutes: services[0].durationMinutes,
        },
      },
    },
  });

  await prisma.appointment.create({
    data: {
      businessId: business.id,
      branchId: branch.id,
      clientId: cliente2.id,
      professionalId: ana.id,
      status: AppointmentStatus.SCHEDULED,
      source: AppointmentSource.ONLINE,
      startsAt: new Date("2026-07-07T11:00:00-03:00"),
      endsAt: new Date("2026-07-07T12:10:00-03:00"),
      depositRequired: true,
      depositPaid: true,
      items: {
        create: {
          serviceId: services[2].id,
          priceCents: services[2].priceCents,
          durationMinutes: services[2].durationMinutes,
        },
      },
    },
  });

  const command = await prisma.command.create({
    data: {
      businessId: business.id,
      appointmentId: appointment.id,
      clientId: cliente1.id,
      status: CommandStatus.CLOSED,
      subtotalCents: 10500,
      discountCents: 0,
      tipCents: 1000,
      totalCents: 11500,
      closedAt: new Date("2026-07-07T10:05:00-03:00"),
      items: {
        create: [
          {
            businessId: business.id,
            professionalId: joao.id,
            serviceId: services[0].id,
            type: CommandItemType.SERVICE,
            description: "Corte Masculino",
            quantity: 1,
            unitPriceCents: 6000,
            totalCents: 6000,
            commissionCents: 2700,
          },
          {
            businessId: business.id,
            professionalId: joao.id,
            productId: pomada.id,
            type: CommandItemType.PRODUCT,
            description: "Pomada Modeladora",
            quantity: 1,
            unitPriceCents: 4500,
            totalCents: 4500,
            commissionCents: 450,
          },
        ],
      },
    },
  });

  const commandItems = await prisma.commandItem.findMany({
    where: { commandId: command.id },
  });

  await prisma.payment.create({
    data: {
      businessId: business.id,
      commandId: command.id,
      clientId: cliente1.id,
      amountCents: 11500,
      method: PaymentMethod.PIX,
      status: PaymentStatus.CONFIRMED,
      paidAt: new Date("2026-07-07T10:06:00-03:00"),
    },
  });

  await prisma.commission.createMany({
    data: commandItems.map((item) => ({
      businessId: business.id,
      professionalId: joao.id,
      commandItemId: item.id,
      baseAmountCents: item.totalCents,
      rate: item.type === CommandItemType.SERVICE ? 45 : 10,
      amountCents: item.commissionCents,
      status: CommissionStatus.AVAILABLE,
      availableAt: new Date("2026-07-07T10:06:00-03:00"),
    })),
  });

  await prisma.cashRegister.create({
    data: {
      businessId: business.id,
      branchId: branch.id,
      openedById: receptionist.id,
      closedById: owner.id,
      openingAmountCents: 20000,
      closingAmountCents: 31500,
      expectedAmountCents: 31500,
      differenceCents: 0,
      openedAt: new Date("2026-07-07T08:30:00-03:00"),
      closedAt: new Date("2026-07-07T19:10:00-03:00"),
    },
  });

  await prisma.messageTemplate.createMany({
    data: [
      {
        businessId: business.id,
        name: "Confirmacao de agendamento",
        channel: MessageChannel.WHATSAPP,
        trigger: "appointment.confirmed",
        body: "Ola {{clientName}}, seu horario na {{businessName}} foi confirmado para {{date}} as {{time}}.",
      },
      {
        businessId: business.id,
        name: "Cliente inativo",
        channel: MessageChannel.WHATSAPP,
        trigger: "client.inactive",
        body: "Sentimos sua falta, {{clientName}}. Que tal agendar seu retorno?",
      },
    ],
  });

  await prisma.marketingCampaign.create({
    data: {
      businessId: business.id,
      name: "Retorno de clientes inativos",
      channel: MessageChannel.WHATSAPP,
      status: MessageStatus.DRAFT,
      audience: { inactiveDays: 45, marketingConsent: true },
    },
  });

  await prisma.setting.createMany({
    data: [
      {
        businessId: business.id,
        key: "locale",
        value: { locale: "pt-BR" },
      },
      {
        businessId: business.id,
        key: "currency",
        value: { currency: "BRL" },
      },
      {
        businessId: business.id,
        key: "whatsapp",
        value: {
          provider: "wuzapi",
          baseUrl: "http://localhost:8080",
          enabled: false,
        },
      },
      {
        businessId: business.id,
        key: "payments",
        value: {
          provider: "mercado_pago",
          enabled: false,
        },
      },
      {
        businessId: business.id,
        key: "googleCalendar",
        value: {
          calendarId: "primary",
          enabled: false,
        },
      },
    ],
  });

  await prisma.auditLog.create({
    data: {
      businessId: business.id,
      actorId: owner.id,
      action: "seed",
      subject: "business",
      subjectId: business.id,
      metadata: { demoPassword: password, bookingSlug: businessSlug },
    },
  });

  console.log(`Seed concluido para ${business.name}`);
  console.log(`Login demo: edineif@gmail.com / ${password}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
