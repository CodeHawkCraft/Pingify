import { z } from "zod";

export const createWebsiteSchema = z.object({
  url: z
    .string()
    .trim()
    .url("Invalid URL format")
    .max(2048, "URL must be at most 2048 characters"),
});

export type CreateWebsiteInput = z.infer<typeof createWebsiteSchema>;
