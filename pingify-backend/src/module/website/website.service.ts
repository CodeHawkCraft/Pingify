import { ApiError } from "../../utils/api-error.ts";
import { findWebsiteByUrlAndUser, createWebsite } from "./website.repository.ts";
import type { WebsiteResponse } from "./website.types.ts";
import type { CreateWebsiteInput } from "./website.validator.ts";

export async function create(
  input: CreateWebsiteInput,
  userId: string,
): Promise<WebsiteResponse> {
  const existing = await findWebsiteByUrlAndUser(input.url, userId);
  if (existing) {
    throw new ApiError(409, "Website already added");
  }

  return createWebsite(input.url, userId);
}
