import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import MeiliSearch from "meilisearch";
import { PrismaService } from "../../common/prisma/prisma.service";

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly logger = new Logger(SearchService.name);
  private client: MeiliSearch;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService
  ) {
    this.client = new MeiliSearch({
      host: this.config.get<string>("MEILISEARCH_HOST") ?? "http://localhost:7700",
      apiKey: this.config.get<string>("MEILISEARCH_MASTER_KEY"),
    });
  }

  async onModuleInit() {
    await this.setupIndexes();
  }

  private async setupIndexes() {
    try {
      const index = await this.client.getOrCreateIndex("products", { primaryKey: "id" });

      await index.updateSettings({
        searchableAttributes: ["name", "description", "sku", "brandName", "categoryNames", "tags"],
        filterableAttributes: ["status", "type", "brandId", "categoryIds", "price", "rating", "inStock"],
        sortableAttributes: ["price", "rating", "salesCount", "createdAt"],
        rankingRules: [
          "words", "typo", "proximity", "attribute", "sort", "exactness",
          "salesCount:desc", "rating:desc",
        ],
        typoTolerance: { enabled: true, minWordSizeForTypos: { oneTypo: 4, twoTypos: 8 } },
      });
    } catch (err) {
      this.logger.warn("Meilisearch not available, search features degraded");
    }
  }

  async search(query: string, options: {
    page?: number;
    limit?: number;
    filters?: string;
    sort?: string[];
  } = {}) {
    const { page = 1, limit = 20, filters, sort } = options;

    try {
      const index = this.client.index("products");
      return await index.search(query, {
        limit,
        offset: (page - 1) * limit,
        filter: filters,
        sort,
      });
    } catch {
      return this.fallbackSearch(query, page, limit);
    }
  }

  async indexProduct(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        brand: true,
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        images: { where: { isPrimary: true }, take: 1 },
        inventory: true,
      },
    });

    if (!product) return;

    const doc = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description ?? "",
      sku: product.sku ?? "",
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      rating: Number(product.rating),
      reviewCount: product.reviewCount,
      salesCount: product.salesCount,
      status: product.status,
      type: product.type,
      brandId: product.brandId,
      brandName: product.brand?.name ?? "",
      categoryIds: product.categories.map((c) => c.categoryId),
      categoryNames: product.categories.map((c) => c.category.name),
      tags: product.tags.map((t) => t.tag.name),
      image: product.images[0]?.url ?? "",
      inStock: product.inventory ? product.inventory.quantity > 0 : true,
      createdAt: product.createdAt.getTime(),
    };

    await this.client.index("products").addDocuments([doc]);
  }

  async removeProductFromIndex(productId: string) {
    await this.client.index("products").deleteDocument(productId);
  }

  async reindexAll() {
    const products = await this.prisma.product.findMany({
      where: { status: "ACTIVE" },
      select: { id: true },
    });

    for (const { id } of products) {
      await this.indexProduct(id);
    }

    return { indexed: products.length };
  }

  private async fallbackSearch(query: string, page: number, limit: number) {
    const products = await this.prisma.product.findMany({
      where: {
        status: "ACTIVE",
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      skip: (page - 1) * limit,
      take: limit,
      include: { images: { where: { isPrimary: true }, take: 1 } },
    });

    return { hits: products, totalHits: products.length };
  }
}
