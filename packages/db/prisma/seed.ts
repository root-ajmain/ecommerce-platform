import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.systemSetting.upsert({
    where: { key: "store_name" },
    update: {},
    create: { key: "store_name", value: "LUXE Store", group: "general" },
  });

  const categories = [
    { name: "Men's Fashion", slug: "mens-fashion", description: "Clothing, shoes & accessories for men" },
    { name: "Women's Fashion", slug: "womens-fashion", description: "Clothing, shoes & accessories for women" },
    { name: "Electronics", slug: "electronics", description: "Phones, laptops, gadgets & accessories" },
    { name: "Sports & Outdoors", slug: "sports-outdoors", description: "Fitness & outdoor gear" },
    { name: "Home & Living", slug: "home-living", description: "Furniture, décor & essentials" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { ...cat, isActive: true, isFeatured: true },
    });
  }

  const brands = [
    { name: "Nike", slug: "nike", website: "https://nike.com" },
    { name: "Adidas", slug: "adidas", website: "https://adidas.com" },
    { name: "Apple", slug: "apple", website: "https://apple.com" },
    { name: "Samsung", slug: "samsung", website: "https://samsung.com" },
    { name: "Levi's", slug: "levis", website: "https://levi.com" },
  ];

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: { ...brand, isActive: true },
    });
  }

  const heroSlides = [
    {
      title: "Summer Collection 2025",
      subtitle: "New Arrivals",
      description: "Discover premium fashion for the modern lifestyle.",
      ctaLabel: "Shop Now",
      ctaUrl: "/category/new-arrivals",
      imageUrl: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400&q=80",
      sortOrder: 0,
    },
  ];

  for (const slide of heroSlides) {
    await prisma.heroSlide.create({ data: slide }).catch(() => null);
  }

  const homeSection = await prisma.homepageSection.create({
    data: {
      type: "featured_categories",
      title: "Shop by Category",
      config: { layout: "grid", columns: 5 },
      isActive: true,
      sortOrder: 1,
    },
  }).catch(() => null);

  console.log("Seed complete.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
