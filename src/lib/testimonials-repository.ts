export type WhatsAppTestimonial = {
  id: string;
  displayName: string;
  occasion?: string;
  service?: string;
  screenshotUrl: string;
  thumbnailUrl?: string | null;
  altText: string;
  screenPosition?: string;
  verticalPan?: boolean;
  panStart?: number;
  panEnd?: number;
  displayDurationMs?: number;
  width: number;
  height: number;
  active: boolean;
  featured: boolean;
  sortOrder: number;
  publicationConsent: boolean;
  redactionApplied: boolean;
  developmentOnly?: boolean;
  createdAt?: string;
};

export interface TestimonialsRepository {
  getActiveTestimonials(): Promise<WhatsAppTestimonial[]>;
  getFeaturedTestimonials(): Promise<WhatsAppTestimonial[]>;
  getTestimonialById(id: string): Promise<WhatsAppTestimonial | null>;
}

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const productionTestimonials: WhatsAppTestimonial[] = [];

const developmentTestimonials: WhatsAppTestimonial[] = [
  {
    id: "testimonial-preview-01",
    displayName: "Prévia 01",
    occasion: "Noivas",
    screenshotUrl: `${publicBasePath}/images/testimonials/development-preview-01.svg`,
    thumbnailUrl: null,
    altText: "Área reservada para um screenshot autorizado de depoimento.",
    screenPosition: "center top",
    verticalPan: true,
    panStart: 0,
    panEnd: -0.7,
    displayDurationMs: 9_000,
    width: 720,
    height: 1560,
    active: true,
    featured: true,
    sortOrder: 1,
    publicationConsent: false,
    redactionApplied: true,
    developmentOnly: true,
  },
  {
    id: "testimonial-preview-02",
    displayName: "Prévia 02",
    occasion: "Debutantes",
    screenshotUrl: `${publicBasePath}/images/testimonials/development-preview-02.svg`,
    thumbnailUrl: null,
    altText: "Área reservada para um screenshot autorizado de depoimento.",
    screenPosition: "center top",
    verticalPan: true,
    panStart: -0.4,
    panEnd: 0.4,
    displayDurationMs: 9_500,
    width: 720,
    height: 1560,
    active: true,
    featured: true,
    sortOrder: 2,
    publicationConsent: false,
    redactionApplied: true,
    developmentOnly: true,
  },
  {
    id: "testimonial-preview-03",
    displayName: "Prévia 03",
    occasion: "Festas e eventos",
    screenshotUrl: `${publicBasePath}/images/testimonials/development-preview-03.svg`,
    thumbnailUrl: null,
    altText: "Área reservada para um screenshot autorizado de depoimento.",
    screenPosition: "center top",
    verticalPan: true,
    panStart: 0.4,
    panEnd: -0.4,
    displayDurationMs: 10_000,
    width: 720,
    height: 1560,
    active: true,
    featured: true,
    sortOrder: 3,
    publicationConsent: false,
    redactionApplied: true,
    developmentOnly: true,
  },
];

const bySortOrder = (testimonials: WhatsAppTestimonial[]) =>
  [...testimonials].sort((first, second) => first.sortOrder - second.sortOrder);

const isPublishable = (testimonial: WhatsAppTestimonial) =>
  testimonial.active &&
  testimonial.publicationConsent &&
  testimonial.redactionApplied &&
  !testimonial.developmentOnly;

export const publicTestimonials = bySortOrder(
  productionTestimonials.filter(isPublishable),
);

export const renderableTestimonials =
  process.env.NODE_ENV === "development"
    ? bySortOrder([...publicTestimonials, ...developmentTestimonials])
    : publicTestimonials;

export const localTestimonialsRepository: TestimonialsRepository = {
  async getActiveTestimonials() {
    return publicTestimonials;
  },
  async getFeaturedTestimonials() {
    return publicTestimonials.filter((testimonial) => testimonial.featured);
  },
  async getTestimonialById(id) {
    return publicTestimonials.find((testimonial) => testimonial.id === id) ?? null;
  },
};
