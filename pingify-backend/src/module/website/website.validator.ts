import { z } from "zod";

export const createWebsiteSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name must be at most 255 characters"),
  url: z
    .url("Invalid URL format")
    .max(2048, "URL must be at most 2048 characters"),
});

export type CreateWebsiteInput = z.infer<typeof createWebsiteSchema>;
