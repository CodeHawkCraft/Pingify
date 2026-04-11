import type { Websites } from "../../database/types.ts";

export type WebsiteResponse = Pick<Websites, "id" | "url" | "user_id" | "created_at">;
