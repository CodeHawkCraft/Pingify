import type { Websites } from "../../database/types.ts";

export type WebsiteResponse = Pick<Websites, "id" | "url"  | "created_at">;
