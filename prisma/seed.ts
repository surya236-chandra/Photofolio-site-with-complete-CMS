import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { DEFAULT_SETTINGS } from "../src/lib/settings";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // --- Users -------------------------------------------------------------
  const adminPass = await bcrypt.hash("admin123", 10);
  const editorPass = await bcrypt.hash("editor123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@studio.test" },
    update: {},
    create: {
      email: "admin@studio.test",
      name: "Surya Chandra",
      passwordHash: adminPass,
      role: "admin",
    },
  });

  await prisma.user.upsert({
    where: { email: "editor@studio.test" },
    update: {},
    create: {
      email: "editor@studio.test",
      name: "Sam Editor",
      passwordHash: editorPass,
      role: "editor",
    },
  });

  // --- Categories --------------------------------------------------------
  const cats = [
    { name: "Portrait", slug: "portrait", order: 1 },
    { name: "Commercial", slug: "commercial", order: 2 },
    { name: "Film", slug: "film", order: 3 },
    { name: "Editorial", slug: "editorial", order: 4 },
  ];
  const catMap: Record<string, string> = {};
  for (const c of cats) {
    const row = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, order: c.order },
      create: c,
    });
    catMap[c.slug] = row.id;
  }

  // --- Projects ----------------------------------------------------------
  // Uses Unsplash source images so the demo looks good out of the box.
  const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;

  const projects = [
    {
      title: "Northern Light",
      slug: "northern-light",
      client: "Aurora Apparel",
      year: "2025",
      role: "Photography, Direction",
      excerpt: "A winter campaign shot across the fjords of northern Norway.",
      description:
        "## Chasing the light\n\nWe followed the sun for three weeks across the Arctic circle to capture a campaign that feels as cold and clear as the air up there.\n\n- 14 locations\n- 3 weeks\n- 1 unforgettable crew",
      coverImage: img("photo-1518837695005-2083093ee35b"),
      gallery: JSON.stringify([
        img("photo-1483728642387-6c3bdd6c93e5"),
        img("photo-1469474968028-56623f02e42e"),
        img("photo-1454496522488-7a8e488e8606"),
      ]),
      categoryId: catMap["commercial"],
      featured: true,
      order: 1,
    },
    {
      title: "Quiet Faces",
      slug: "quiet-faces",
      client: "Personal",
      year: "2024",
      role: "Photography",
      excerpt: "An intimate portrait series exploring stillness.",
      description:
        "A study of expression in natural light. Shot on medium format film over a single summer.",
      coverImage: img("photo-1531123897727-8f129e1688ce"),
      gallery: JSON.stringify([
        img("photo-1500648767791-00dcc994a43e"),
        img("photo-1506794778202-cad84cf45f1d"),
        img("photo-1539571696357-5a69c17a67c6"),
      ]),
      categoryId: catMap["portrait"],
      featured: true,
      order: 2,
    },
    {
      title: "City in Motion",
      slug: "city-in-motion",
      client: "Metro Transit",
      year: "2025",
      role: "Film, Editing",
      excerpt: "A short film celebrating the rhythm of the city after dark.",
      description:
        "A 90-second film cut to the pulse of the city. Shot over six nights with a two-person crew.",
      coverImage: img("photo-1449824913935-59a10b8d2000"),
      videoUrl: "https://player.vimeo.com/video/76979871",
      gallery: JSON.stringify([
        img("photo-1480714378408-67cf0d13bc1b"),
        img("photo-1444723121867-7a241cacace9"),
      ]),
      categoryId: catMap["film"],
      featured: true,
      order: 3,
    },
    {
      title: "Bloom",
      slug: "bloom",
      client: "Verde Magazine",
      year: "2024",
      role: "Editorial Photography",
      excerpt: "A botanical editorial for a print magazine spread.",
      description: "Twelve pages of colour and texture for Verde's spring issue.",
      coverImage: img("photo-1490750967868-88aa4486c946"),
      gallery: JSON.stringify([
        img("photo-1462530260150-162092dbf011"),
        img("photo-1502082553048-f009c37129b9"),
      ]),
      categoryId: catMap["editorial"],
      featured: false,
      order: 4,
    },
    {
      title: "Coastline",
      slug: "coastline",
      client: "Salt & Sail",
      year: "2023",
      role: "Photography, Film",
      excerpt: "Brand imagery for a coastal lifestyle label.",
      description: "Sun, salt and slow mornings — a full content shoot on the Atlantic coast.",
      coverImage: img("photo-1507525428034-b723cf961d3e"),
      gallery: JSON.stringify([
        img("photo-1505228395891-9a51e7e86bf6"),
        img("photo-1473116763249-2faaef81ccda"),
      ]),
      categoryId: catMap["commercial"],
      featured: false,
      order: 5,
    },
    {
      title: "Studio Sessions",
      slug: "studio-sessions",
      client: "Various",
      year: "2025",
      role: "Portrait Photography",
      excerpt: "A collection of studio portraits with bold colour gels.",
      description: "Experiments in colour, shadow and personality, all shot in-house.",
      coverImage: img("photo-1488161628813-04466f872be2"),
      gallery: JSON.stringify([
        img("photo-1492288991661-058aa541ff43"),
        img("photo-1524504388940-b1c1722653e1"),
      ]),
      categoryId: catMap["portrait"],
      featured: false,
      order: 6,
    },
  ];

  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: p,
      create: { ...p, published: true },
    });
  }

  // --- Blog posts --------------------------------------------------------
  const posts = [
    {
      title: "Five lessons from a year of shooting film",
      slug: "five-lessons-shooting-film",
      excerpt: "What slowing down taught us about seeing.",
      content:
        "# Five lessons from a year of shooting film\n\nShooting film forces patience. Here is what a year of it taught the studio.\n\n## 1. Light first, everything else second\n\nYou learn to wait for the moment the light is right.\n\n## 2. Limits are a gift\n\n36 frames changes how you think about every shot.\n\n## 3. Mistakes are interesting\n\nThe happy accidents became some of our favourite frames.",
      coverImage: img("photo-1452587925148-ce544e77e70d"),
      tags: "film, process, behind the scenes",
      published: true,
      publishedAt: new Date("2025-11-02"),
      seoTitle: "Five lessons from a year of shooting film",
      seoDescription:
        "What a year of shooting film taught our photography studio about patience, light and seeing.",
    },
    {
      title: "How we plan a campaign shoot",
      slug: "how-we-plan-a-campaign-shoot",
      excerpt: "From mood board to final frame — our production process.",
      content:
        "# How we plan a campaign shoot\n\nGreat images start long before the camera comes out. Here is how we run a commercial production from brief to delivery.\n\n## Pre-production\n\nMood boards, locations, casting and a shot list.\n\n## On set\n\nA calm set is a productive set.\n\n## Post\n\nColour, retouch and delivery in every format the client needs.",
      coverImage: img("photo-1500336624523-d727130c3328"),
      tags: "production, commercial, process",
      published: true,
      publishedAt: new Date("2025-09-18"),
      seoTitle: "How we plan a campaign shoot — Studio process",
      seoDescription:
        "A look inside how our studio plans and produces a commercial campaign shoot from brief to delivery.",
    },
    {
      title: "Choosing the right lens for portraits",
      slug: "choosing-the-right-lens-for-portraits",
      excerpt: "A practical guide to portrait focal lengths.",
      content:
        "# Choosing the right lens for portraits\n\n35mm, 50mm, 85mm — each tells a different story. Here is how we choose.",
      coverImage: img("photo-1554048612-b6a482bc67e5"),
      tags: "gear, portrait, guide",
      published: true,
      publishedAt: new Date("2025-07-30"),
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: { ...post, authorId: admin.id },
      create: { ...post, authorId: admin.id },
    });
  }

  // --- Pages -------------------------------------------------------------
  const pages = [
    {
      slug: "about",
      title: "About Surya Chandra",
      content:
        "## Surya Chandra — Photography & Film\n\nAn independent photography and film portfolio. Explore selected projects, portraits, editorial work, and motion.",
      seoTitle: "About — our photography & film studio",
      seoDescription:
        "Learn about our independent photography and film studio, our story, and the work we love to make.",
    },
    {
      slug: "services",
      title: "Services",
      content:
        "## What we offer\n\nFrom a single portrait to a multi-day campaign, we scale to fit the story.\n\n### Photography\n\nCommercial, editorial, portrait and product photography, in-studio or on location.\n\n### Film\n\nBrand films, social content and short-form motion, from concept through to the final cut.\n\n### Art direction\n\nMood, styling and visual direction to make sure every frame is on-brand.\n\n### Post-production\n\nColour grading, retouching and delivery in every format you need.",
      seoTitle: "Services — photography, film & art direction",
      seoDescription:
        "Our studio services: commercial and editorial photography, brand film, art direction and post-production.",
    },
  ];

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: page,
      create: page,
    });
  }

  // --- A sample message --------------------------------------------------
  const existingMsg = await prisma.message.findFirst();
  if (!existingMsg) {
    await prisma.message.create({
      data: {
        name: "Jordan Lee",
        email: "jordan@example.com",
        subject: "Wedding film enquiry",
        body: "Hi! We loved your reel. Are you available for a wedding film next spring in Italy?",
      },
    });
  }

  // --- Settings ----------------------------------------------------------
  await prisma.setting.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, data: JSON.stringify(DEFAULT_SETTINGS) },
  });

  console.log("✅ Seed complete.");
  console.log("   Admin login:  admin@studio.test  / admin123");
  console.log("   Editor login: editor@studio.test / editor123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
