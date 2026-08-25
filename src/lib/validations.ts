import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(1, "أدخل كلمة المرور"),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "الاسم قصير جداً").max(120),
  email: z.string().trim().email("البريد الإلكتروني غير صالح").max(180),
  message: z.string().trim().min(10, "الرسالة قصيرة جداً").max(4000),
  company: z.string().optional(),
});

export const projectImageSchema = z.object({
  id: z.number().optional(),
  imageUrl: z.string().min(1),
  altText: z.string().optional().default(""),
  sortOrder: z.number().optional().default(0),
});

export const projectSchema = z.object({
  title: z.string().trim().min(1, "أدخل عنوان المشروع").max(255),
  slug: z.string().trim().max(255).optional().default(""),
  description: z.string().optional().default(""),
  shortDescription: z.string().optional().default(""),
  categoryId: z.number().nullable().optional(),
  year: z.number().int().min(1980).max(2100).nullable().optional(),
  coverImage: z.string().optional().default(""),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(false),
  sortOrder: z.number().int().optional().default(0),
  client: z.string().optional().default(""),
  credits: z.string().optional().default(""),
  tags: z.string().optional().default(""),
  seoTitle: z.string().optional().default(""),
  seoDescription: z.string().optional().default(""),
  images: z.array(projectImageSchema).optional().default([]),
});

export const categorySchema = z.object({
  name: z.string().trim().min(1).max(255),
  slug: z.string().trim().min(1).max(255),
  sortOrder: z.number().int().optional().default(0),
});

export const serviceSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().optional().default(""),
  sortOrder: z.number().int().optional().default(0),
});

export const skillSchema = z.object({
  name: z.string().trim().min(1).max(255),
  sortOrder: z.number().int().optional().default(0),
});

export const mediaPatchSchema = z.object({
  altText: z.string().optional(),
  originalName: z.string().optional(),
});
