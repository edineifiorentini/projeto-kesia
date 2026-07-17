import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
});

export const appointmentCreateSchema = z.object({
  businessId: z.string().min(1),
  clientId: z.string().min(1),
  professionalId: z.string().min(1),
  startsAt: z.string().datetime(),
  serviceIds: z.array(z.string().min(1)).min(1),
});

export const mercadoPagoPreferenceSchema = z.object({
  commandId: z.string().min(1),
  payerEmail: z.string().email().optional(),
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        quantity: z.number().int().positive(),
        unitPriceCents: z.number().int().positive(),
      }),
    )
    .min(1),
});

export const googleCalendarEventSchema = z.object({
  accessToken: z.string().min(1),
  calendarId: z.string().min(1).default("primary"),
  appointmentId: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().optional(),
  location: z.string().optional(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  attendeeEmail: z.string().email().optional(),
});

export const wuzApiMessageSchema = z.object({
  phone: z.string().min(8),
  body: z.string().min(1),
});

export const wuzApiQrCodeRequestSchema = z.object({
  forceNew: z.boolean().optional().default(false),
});
