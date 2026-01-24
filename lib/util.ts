import crypto from "crypto";
const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000";
export function generateSlug(name: string) {
  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const randomId = crypto.randomBytes(3).toString("hex"); // 6 chars

  return `${baseSlug}-${randomId}`;
}

export function getShareUrl(slug: string) {
  return `${baseUrl}/item/${slug}`;
}