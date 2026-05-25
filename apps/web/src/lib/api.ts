const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const url = `${API_URL}/api/v1${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    next: options.next,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error((error as { message: string }).message ?? "Request failed");
  }

  const json = await res.json() as { success: boolean; data: T };
  return json.data;
}

export const api = {
  products: {
    getAll: (params?: Record<string, string>) => {
      const qs = params ? `?${new URLSearchParams(params)}` : "";
      return fetchApi<unknown>(`/products${qs}`, { next: { revalidate: 60, tags: ["products"] } });
    },
    getBySlug: (slug: string) =>
      fetchApi<{ id: string; name: string; slug: string; price: number; compareAtPrice?: number | null; shortDescription?: string | null; description?: string | null; metaTitle?: string | null; metaDesc?: string | null; images?: Array<{ url: string; altText?: string }>; categories?: Array<{ category: { name: string; slug: string } }>; variants?: Array<{ id: string; sku: string; price: number }>; inventory?: { quantity: number } | null; reviews?: Array<{ id?: string; rating: number; title?: string | null; body?: string | null; user?: { firstName: string; lastName: string; avatar?: string | null }; createdAt?: Date | string }>; rating: number; reviewCount: number }>(
        `/products/${slug}`,
        { next: { revalidate: 60, tags: [`product-${slug}`] } }
      ),
    getFeatured: () =>
      fetchApi<unknown[]>("/products/featured", { next: { revalidate: 60, tags: ["products"] } }),
    getBestsellers: () =>
      fetchApi<unknown[]>("/products/bestsellers", { next: { revalidate: 60, tags: ["products"] } }),
    getRelated: (id: string) =>
      fetchApi<unknown[]>(`/products/${id}/related`, { next: { revalidate: 60 } }),
  },

  categories: {
    getAll: () =>
      fetchApi<unknown[]>("/categories", { next: { revalidate: 3600, tags: ["categories"] } }),
  },

  cart: {
    get: (token: string) => fetchApi<unknown>("/cart", { headers: { Authorization: `Bearer ${token}` } }),
    add: (token: string, data: unknown) =>
      fetchApi<unknown>("/cart/items", { method: "POST", body: JSON.stringify(data) }, token),
    update: (token: string, itemId: string, quantity: number) =>
      fetchApi<unknown>(`/cart/items/${itemId}`, { method: "PATCH", body: JSON.stringify({ quantity }) }, token),
    remove: (token: string, itemId: string) =>
      fetchApi<unknown>(`/cart/items/${itemId}`, { method: "DELETE" }, token),
  },

  orders: {
    create: (token: string, data: unknown) =>
      fetchApi<unknown>("/orders", { method: "POST", body: JSON.stringify(data) }, token),
    getAll: (token: string) => fetchApi<unknown>("/orders", {}, token),
    getById: (token: string, id: string) => fetchApi<unknown>(`/orders/${id}`, {}, token),
  },

  search: {
    query: (q: string, params?: Record<string, string>) => {
      const qs = new URLSearchParams({ q, ...params });
      return fetchApi<unknown>(`/search?${qs}`);
    },
  },
};
