export type PortfolioCategory =
  | "noivas"
  | "debutantes"
  | "festas"
  | "semipresos"
  | "coques"
  | "ondas"
  | "detalhes"
  | "finalizacao";

export type PortfolioImage = {
  id: string;
  imageUrl: string;
  thumbnailUrl: string | null;
  title: string;
  category: PortfolioCategory;
  description: string | null;
  altText: string;
  imagePosition: string;
  width: number;
  height: number;
  featured: boolean;
  active: boolean;
  sortOrder: number;
  createdAt?: string;
  clientConsent?: boolean;
};

export interface PortfolioRepository {
  getActiveImages(): Promise<PortfolioImage[]>;
  getFeaturedImages(): Promise<PortfolioImage[]>;
  getImagesByCategory(category: PortfolioCategory): Promise<PortfolioImage[]>;
  getPortfolioImageById(id: string): Promise<PortfolioImage | null>;
}

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const portfolioCategoryLabels: Record<PortfolioCategory, string> = {
  noivas: "Noiva",
  debutantes: "Debutante",
  festas: "Festa",
  semipresos: "Semipreso",
  coques: "Coque",
  ondas: "Ondas",
  detalhes: "Detalhes",
  finalizacao: "Finalização",
};

export const portfolioImages: PortfolioImage[] = [
  {
    id: "portfolio-01",
    imageUrl: `${publicBasePath}/images/experience/noiva-coque-editorial.webp`,
    thumbnailUrl: null,
    title: "Coque baixo com textura e acessório delicado",
    category: "noivas",
    description: "Penteado clássico, romântico e personalizado.",
    altText: "Vista posterior de noiva com coque baixo texturizado e acessório delicado.",
    imagePosition: "50% 38%",
    width: 876,
    height: 1796,
    featured: true,
    active: true,
    sortOrder: 1,
    createdAt: "2026-07-01T12:00:00.000Z",
  },
  {
    id: "portfolio-02",
    imageUrl: `${publicBasePath}/images/moments/brides.webp`,
    thumbnailUrl: null,
    title: "Penteado clássico e romântico",
    category: "noivas",
    description: "Acabamento elegante com mechas suaves ao redor do rosto.",
    altText: "Noiva de perfil com penteado preso e acessório de pérolas.",
    imagePosition: "50% 42%",
    width: 1024,
    height: 1536,
    featured: true,
    active: true,
    sortOrder: 2,
    createdAt: "2026-07-02T12:00:00.000Z",
  },
  {
    id: "portfolio-03",
    imageUrl: `${publicBasePath}/images/experience/noiva-semi-preso-lateral.webp`,
    thumbnailUrl: null,
    title: "Ondas leves e semipreso",
    category: "festas",
    description: "Movimento natural com acabamento sofisticado.",
    altText: "Mulher de perfil com penteado semipreso e ondas longas.",
    imagePosition: "52% 44%",
    width: 1200,
    height: 900,
    featured: true,
    active: true,
    sortOrder: 3,
    createdAt: "2026-07-03T12:00:00.000Z",
  },
  {
    id: "portfolio-04",
    imageUrl: `${publicBasePath}/images/moments/events.webp`,
    thumbnailUrl: null,
    title: "Penteado romântico e jovem",
    category: "debutantes",
    description: "Leveza e personalidade para uma nova fase.",
    altText: "Mulher de perfil com coque delicado e mechas suaves.",
    imagePosition: "50% 42%",
    width: 1024,
    height: 1536,
    featured: true,
    active: true,
    sortOrder: 4,
    createdAt: "2026-07-04T12:00:00.000Z",
  },
  {
    id: "portfolio-05",
    imageUrl: `${publicBasePath}/images/services/debutante-hairstyle.webp`,
    thumbnailUrl: null,
    title: "Semipreso com ondas e movimento",
    category: "semipresos",
    description: "Textura e volume com aparência natural.",
    altText: "Penteado semipreso visto de costas com ondas e acessório delicado.",
    imagePosition: "50% 40%",
    width: 1024,
    height: 1536,
    featured: true,
    active: true,
    sortOrder: 5,
    createdAt: "2026-07-05T12:00:00.000Z",
  },
  {
    id: "portfolio-06",
    imageUrl: `${publicBasePath}/images/experience/noiva-coque-trancado.webp`,
    thumbnailUrl: null,
    title: "Textura, leveza e acabamento",
    category: "detalhes",
    description: "Detalhes cuidadosamente construídos.",
    altText: "Detalhe aproximado de penteado preso com textura e acessório floral.",
    imagePosition: "50% 48%",
    width: 1100,
    height: 1100,
    featured: true,
    active: true,
    sortOrder: 6,
    createdAt: "2026-07-06T12:00:00.000Z",
  },
  {
    id: "portfolio-07",
    imageUrl: `${publicBasePath}/images/services/bridal-hairstyle.webp`,
    thumbnailUrl: null,
    title: "Coque despojado e sofisticado",
    category: "coques",
    description: "Elegância com movimento e naturalidade.",
    altText: "Noiva de perfil com coque baixo despojado e acessório delicado.",
    imagePosition: "50% 42%",
    width: 1024,
    height: 1536,
    featured: true,
    active: true,
    sortOrder: 7,
    createdAt: "2026-07-07T12:00:00.000Z",
  },
  {
    id: "portfolio-08",
    imageUrl: `${publicBasePath}/images/moments/debutantes.webp`,
    thumbnailUrl: null,
    title: "Ondas polidas para celebrar",
    category: "debutantes",
    description: "Volume leve e acabamento luminoso.",
    altText: "Debutante com ondas polidas e penteado semipreso elegante.",
    imagePosition: "50% 40%",
    width: 1024,
    height: 1536,
    featured: false,
    active: true,
    sortOrder: 8,
    createdAt: "2026-07-08T12:00:00.000Z",
  },
  {
    id: "portfolio-09",
    imageUrl: `${publicBasePath}/images/services/party-hairstyle.webp`,
    thumbnailUrl: null,
    title: "Ondas elegantes para festas",
    category: "festas",
    description: "Movimento e brilho para ocasiões especiais.",
    altText: "Mulher com ondas polidas em penteado elegante para festa.",
    imagePosition: "50% 42%",
    width: 1024,
    height: 1536,
    featured: false,
    active: true,
    sortOrder: 9,
    createdAt: "2026-07-09T12:00:00.000Z",
  },
  {
    id: "portfolio-10",
    imageUrl: `${publicBasePath}/images/services/custom-finishing.webp`,
    thumbnailUrl: null,
    title: "Ondas com acabamento natural",
    category: "ondas",
    description: "Finalização suave que preserva o movimento dos fios.",
    altText: "Cabelo longo com ondas e finalização personalizada.",
    imagePosition: "50% 45%",
    width: 1024,
    height: 1536,
    featured: false,
    active: true,
    sortOrder: 10,
    createdAt: "2026-07-10T12:00:00.000Z",
  },
  {
    id: "portfolio-11",
    imageUrl: `${publicBasePath}/images/services/hair-coloring.webp`,
    thumbnailUrl: null,
    title: "Nuances que valorizam a textura",
    category: "finalizacao",
    description: "Cor e acabamento pensados para realçar o penteado.",
    altText: "Cabelo castanho com nuances caramelo e acabamento luminoso.",
    imagePosition: "50% 45%",
    width: 1024,
    height: 1536,
    featured: false,
    active: true,
    sortOrder: 11,
    createdAt: "2026-07-11T12:00:00.000Z",
  },
  {
    id: "portfolio-12",
    imageUrl: `${publicBasePath}/images/services/wash-and-brush.webp`,
    thumbnailUrl: null,
    title: "Brilho, alinhamento e movimento",
    category: "finalizacao",
    description: "Preparação cuidadosa para um resultado leve e duradouro.",
    altText: "Cabelo saudável e alinhado depois de uma finalização profissional.",
    imagePosition: "50% 44%",
    width: 1024,
    height: 1536,
    featured: false,
    active: true,
    sortOrder: 12,
    createdAt: "2026-07-12T12:00:00.000Z",
  },
];

const sortImages = (images: PortfolioImage[]) =>
  [...images].sort((first, second) => first.sortOrder - second.sortOrder);

export const localPortfolioRepository: PortfolioRepository = {
  async getActiveImages() {
    return sortImages(portfolioImages.filter((image) => image.active));
  },
  async getFeaturedImages() {
    return sortImages(portfolioImages.filter((image) => image.active && image.featured));
  },
  async getImagesByCategory(category) {
    return sortImages(
      portfolioImages.filter((image) => image.active && image.category === category),
    );
  },
  async getPortfolioImageById(id) {
    return portfolioImages.find((image) => image.id === id) ?? null;
  },
};
