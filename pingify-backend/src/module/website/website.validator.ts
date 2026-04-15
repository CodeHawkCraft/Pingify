import { z } from "zod";

export const createWebsiteSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name must be at most 255 characters"),
  url: z
    .url("Invalid URL format")
    .max(2048, "URL must be at most 2048 characters"),
});

export type CreateWebsiteInput = z.infer<typeof createWebsiteSchema>;

export const pingLogsQuerySchema = z
  .object({
    startDate: z.iso.datetime({ offset: true }).optional(),
    endDate: z.iso.datetime({ offset: true }).optional(),
    status: z.enum(["up", "down"]).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(50),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    { message: "startDate must be before or equal to endDate", path: ["startDate"] },
  );

export type PingLogsQueryInput = z.infer<typeof pingLogsQuerySchema>;

export const getWebsitesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type GetWebsitesQueryInput = z.infer<typeof getWebsitesQuerySchema>;
