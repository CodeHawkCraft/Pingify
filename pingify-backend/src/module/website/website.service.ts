import { ApiError } from "../../utils/api-error.ts";
import { findWebsiteByUrlAndUser, findWebsiteByNameAndUser, createWebsite } from "./website.repository.ts";
import type { WebsiteResponse } from "./website.types.ts";
import type { CreateWebsiteInput } from "./website.validator.ts";

export async function create(
  input: CreateWebsiteInput,
  userId: string,
): Promise<WebsiteResponse> {
  const [existingUrl, existingName] = await Promise.all([
    findWebsiteByUrlAndUser(input.url, userId),
    findWebsiteByNameAndUser(input.name, userId),
  ]);

  if (existingUrl) throw new ApiError(409, "URL already monitored");
  if (existingName) throw new ApiError(409, "Monitor name already taken");

  return createWebsite(input.name, input.url, userId);
}
