import { HeroSection } from "@/components/home/hero-section";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { BestSellers } from "@/components/home/best-sellers";
import { FlashSale } from "@/components/home/flash-sale";
import { FeaturedProducts } from "@/components/home/featured-products";
import { TrustSection } from "@/components/home/trust-section";
import { Newsletter } from "@/components/home/newsletter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Discover premium products at unbeatable prices",
};

export const revalidate = 60;

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCategories />
      <BestSellers />
      <FlashSale />
      <FeaturedProducts />
      <TrustSection />
      <Newsletter />
    </>
  );
}
