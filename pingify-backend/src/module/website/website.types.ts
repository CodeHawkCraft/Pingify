import type { Websites } from "../../database/types.ts";

export type WebsiteResponse = Pick<Websites, "id" | "name" | "url" | "created_at">;
