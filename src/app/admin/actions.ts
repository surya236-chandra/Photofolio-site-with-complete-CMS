"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  authenticate,
  createSession,
  destroySession,
  getCurrentUser,
  hashPassword,
} from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { getSettings, saveSettings, DEFAULT_SETTINGS, type SiteSettings } from "@/lib/settings";
import { isValidTheme } from "@/lib/themes";

// ---- helpers --------------------------------------------------------------
function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}
function bool(fd: FormData, key: string) {
  return fd.get(key) === "on" || fd.get(key) === "true";
}
function int(fd: FormData, key: string, fallback = 0) {
  const n = parseInt(str(fd, key), 10);
  return Number.isNaN(n) ? fallback : n;
}
async function guard() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}
async function guardAdmin() {
  const user = await guard();
  if (user.role !== "admin") throw new Error("Admins only");
  return user;
}
function revalidateAll() {
  revalidatePath("/", "layout");
}

// ---- auth -----------------------------------------------------------------
export async function loginAction(_prev: unknown, fd: FormData) {
  const email = str(fd, "email");
  const password = str(fd, "password");
  if (!email || !password) return { error: "Email and password are required." };
  const session = await authenticate(email, password);
  if (!session) return { error: "Invalid email or password." };
  await createSession(session);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

// ---- projects -------------------------------------------------------------
function projectData(fd: FormData) {
  const title = str(fd, "title");
  return {
    title,
    slug: str(fd, "slug") || slugify(title),
    client: str(fd, "client") || null,
    year: str(fd, "year") || null,
    role: str(fd, "role") || null,
    excerpt: str(fd, "excerpt") || null,
    description: str(fd, "description") || null,
    coverImage: str(fd, "coverImage") || null,
    videoUrl: str(fd, "videoUrl") || null,
    gallery: str(fd, "gallery") || null, // JSON string from the editor
    categoryId: str(fd, "categoryId") || null,
    featured: bool(fd, "featured"),
    published: bool(fd, "published"),
    order: int(fd, "order"),
    seoTitle: str(fd, "seoTitle") || null,
    seoDescription: str(fd, "seoDescription") || null,
    ogImage: str(fd, "ogImage") || null,
  };
}

export async function createProject(fd: FormData) {
  await guard();
  const data = projectData(fd);
  if (!data.title) throw new Error("Title is required");
  const created = await prisma.project.create({ data });
  revalidateAll();
  redirect(`/admin/projects/${created.id}`);
}

export async function updateProject(id: string, fd: FormData) {
  await guard();
  await prisma.project.update({ where: { id }, data: projectData(fd) });
  revalidateAll();
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  await guard();
  await prisma.project.delete({ where: { id } });
  revalidateAll();
  redirect("/admin/projects");
}

// ---- categories -----------------------------------------------------------
export async function createCategory(fd: FormData) {
  await guard();
  const name = str(fd, "name");
  if (!name) throw new Error("Name required");
  await prisma.category.create({
    data: { name, slug: str(fd, "slug") || slugify(name), order: int(fd, "order") },
  });
  revalidateAll();
  redirect("/admin/projects");
}

export async function deleteCategory(id: string) {
  await guard();
  await prisma.category.delete({ where: { id } });
  revalidateAll();
  redirect("/admin/projects");
}

// ---- posts ----------------------------------------------------------------
function postData(fd: FormData, authorId: string) {
  const title = str(fd, "title");
  const published = bool(fd, "published");
  const publishedAtRaw = str(fd, "publishedAt");
  return {
    title,
    slug: str(fd, "slug") || slugify(title),
    excerpt: str(fd, "excerpt") || null,
    content: str(fd, "content") || null,
    coverImage: str(fd, "coverImage") || null,
    tags: str(fd, "tags") || null,
    published,
    publishedAt: publishedAtRaw
      ? new Date(publishedAtRaw)
      : published
        ? new Date()
        : null,
    authorId,
    seoTitle: str(fd, "seoTitle") || null,
    seoDescription: str(fd, "seoDescription") || null,
    ogImage: str(fd, "ogImage") || null,
  };
}

export async function createPost(fd: FormData) {
  const user = await guard();
  const data = postData(fd, user.id);
  if (!data.title) throw new Error("Title is required");
  const created = await prisma.post.create({ data });
  revalidateAll();
  redirect(`/admin/blog/${created.id}`);
}

export async function updatePost(id: string, fd: FormData) {
  const user = await guard();
  await prisma.post.update({ where: { id }, data: postData(fd, user.id) });
  revalidateAll();
  redirect("/admin/blog");
}

export async function deletePost(id: string) {
  await guard();
  await prisma.post.delete({ where: { id } });
  revalidateAll();
  redirect("/admin/blog");
}

// ---- pages ----------------------------------------------------------------
function pageData(fd: FormData) {
  const title = str(fd, "title");
  return {
    title,
    slug: str(fd, "slug") || slugify(title),
    content: str(fd, "content") || null,
    seoTitle: str(fd, "seoTitle") || null,
    seoDescription: str(fd, "seoDescription") || null,
  };
}

export async function createPage(fd: FormData) {
  await guard();
  const data = pageData(fd);
  if (!data.title) throw new Error("Title is required");
  const created = await prisma.page.create({ data });
  revalidateAll();
  redirect(`/admin/pages/${created.id}`);
}

export async function updatePage(id: string, fd: FormData) {
  await guard();
  await prisma.page.update({ where: { id }, data: pageData(fd) });
  revalidateAll();
  redirect("/admin/pages");
}

export async function deletePage(id: string) {
  await guard();
  await prisma.page.delete({ where: { id } });
  revalidateAll();
  redirect("/admin/pages");
}

// ---- messages -------------------------------------------------------------
export async function toggleMessageRead(id: string, read: boolean) {
  await guard();
  await prisma.message.update({ where: { id }, data: { read } });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  await guard();
  await prisma.message.delete({ where: { id } });
  revalidatePath("/admin/messages");
}

// ---- users (admin only) ---------------------------------------------------
export async function createUser(fd: FormData) {
  await guardAdmin();
  const email = str(fd, "email").toLowerCase();
  const name = str(fd, "name");
  const password = str(fd, "password");
  const role = str(fd, "role") === "admin" ? "admin" : "editor";
  if (!email || !name || !password) throw new Error("All fields are required");
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new Error("A user with that email already exists");
  await prisma.user.create({
    data: { email, name, role, passwordHash: await hashPassword(password) },
  });
  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function updateUser(id: string, fd: FormData) {
  await guardAdmin();
  const name = str(fd, "name");
  const role = str(fd, "role") === "admin" ? "admin" : "editor";
  const password = str(fd, "password");
  const data: { name: string; role: string; passwordHash?: string } = { name, role };
  if (password) data.passwordHash = await hashPassword(password);
  await prisma.user.update({ where: { id }, data });
  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function deleteUser(id: string) {
  const me = await guardAdmin();
  if (me.id === id) throw new Error("You cannot delete your own account");
  const adminCount = await prisma.user.count({ where: { role: "admin" } });
  const target = await prisma.user.findUnique({ where: { id } });
  if (target?.role === "admin" && adminCount <= 1) {
    throw new Error("Cannot delete the last admin");
  }
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}

// ---- settings -------------------------------------------------------------
export async function saveSettingsAction(fd: FormData) {
  await guard();
  const current = await getSettings();
  const next: SiteSettings = {
    ...current,
    siteName: str(fd, "siteName") || DEFAULT_SETTINGS.siteName,
    tagline: str(fd, "tagline"),
    logoText: str(fd, "logoText"),
    logoUrl: str(fd, "logoUrl"),
    faviconUrl: str(fd, "faviconUrl"),
    contactEmail: str(fd, "contactEmail"),
    phone: str(fd, "phone"),
    address: str(fd, "address"),
    footerText: str(fd, "footerText"),
    socials: {
      instagram: str(fd, "instagram"),
      behance: str(fd, "behance"),
      vimeo: str(fd, "vimeo"),
      youtube: str(fd, "youtube"),
      linkedin: str(fd, "linkedin"),
      x: str(fd, "x"),
    },
    seo: {
      titleTemplate: str(fd, "titleTemplate") || DEFAULT_SETTINGS.seo.titleTemplate,
      defaultTitle: str(fd, "defaultTitle"),
      defaultDescription: str(fd, "defaultDescription"),
      defaultOgImage: str(fd, "defaultOgImage"),
      keywords: str(fd, "keywords"),
    },
    home: {
      heroTitle: str(fd, "heroTitle"),
      heroSubtitle: str(fd, "heroSubtitle"),
      heroImage: str(fd, "heroImage"),
      aboutBlurb: str(fd, "aboutBlurb"),
      ctaTitle: str(fd, "ctaTitle"),
      ctaText: str(fd, "ctaText"),
    },
  };
  await saveSettings(next);
  revalidateAll();
  redirect("/admin/settings?saved=1");
}

// ---- navigation -----------------------------------------------------------
export async function saveNavigationAction(fd: FormData) {
  await guard();
  const raw = str(fd, "nav");
  let parsed: SiteSettings["nav"];
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Could not save navigation (invalid data).");
  }
  // Light sanitisation
  const cleanLink = (l: { label?: string; href?: string }) => ({
    label: (l.label || "").trim(),
    href: (l.href || "").trim() || "#",
  });
  const nav: SiteSettings["nav"] = {
    header: (parsed.header || [])
      .filter((i) => (i.label || "").trim())
      .map((i) => ({
        label: i.label.trim(),
        href: (i.href || "").trim() || "#",
        children: (i.children || [])
          .map((g) => ({
            heading: (g.heading || "").trim(),
            links: (g.links || []).filter((l) => (l.label || "").trim()).map(cleanLink),
          }))
          .filter((g) => g.links.length > 0),
      })),
    footer: (parsed.footer || [])
      .filter((c) => (c.title || "").trim())
      .map((c) => ({
        title: c.title.trim(),
        links: (c.links || []).filter((l) => (l.label || "").trim()).map(cleanLink),
      })),
  };

  const current = await getSettings();
  await saveSettings({ ...current, nav });
  revalidateAll();
  redirect("/admin/navigation?saved=1");
}

// ---- theme ----------------------------------------------------------------
export async function setThemeAction(fd: FormData) {
  await guard();
  const active = str(fd, "theme");
  const accent = str(fd, "accent");
  const current = await getSettings();
  await saveSettings({
    ...current,
    theme: {
      active: isValidTheme(active) ? active : current.theme.active,
      accent: accent || "",
    },
  });
  revalidateAll();
  redirect("/admin/theme?saved=1");
}
