import {
  KlipyCategoriesResponse,
  KlipySearchResponse,
  KlipyTrendingResponse,
} from "@/types/klipy-api";

const KLIPY_API_BASE = "https://api.klipy.co/api/v1";

export class KlipyAPI {
  private appKey: string;

  constructor(appKey: string) {
    this.appKey = appKey;
  }

  private async fetchFromKlipy<T>(
    endpoint: string,
    params: Record<string, string | number> = {}
  ): Promise<T> {
    const url = new URL(`${KLIPY_API_BASE}/${this.appKey}${endpoint}`);

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value.toString());
    });

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(
        `KLIPY API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  async search(
    query: string,
    options: {
      page?: number;
      per_page?: number;
      customer_id?: string;
      country_code?: string;
      content_filter?: "safe" | "moderate" | "off";
    } = {}
  ): Promise<KlipySearchResponse> {
    const params: Record<string, string | number> = {
      q: query,
      page: options.page || 1,
      per_page: options.per_page || 20,
      content_filter: options.content_filter || "safe",
    };

    if (options.customer_id) {
      params.customer_id = options.customer_id;
    }

    if (options.country_code) {
      params.country_code = options.country_code;
    }

    return this.fetchFromKlipy<KlipySearchResponse>("/gifs/search", params);
  }

  async trending(
    options: {
      page?: number;
      per_page?: number;
      customer_id?: string;
      locale?: string;
    } = {}
  ): Promise<KlipyTrendingResponse> {
    const params: Record<string, string | number> = {
      page: options.page || 1,
      per_page: options.per_page || 20,
    };

    if (options.customer_id) {
      params.customer_id = options.customer_id;
    }

    if (options.locale) {
      params.locale = options.locale;
    }

    return this.fetchFromKlipy<KlipyTrendingResponse>("/gifs/trending", params);
  }

  async categories(): Promise<KlipyCategoriesResponse> {
    return this.fetchFromKlipy<KlipyCategoriesResponse>("/gifs/categories");
  }

  async reportShare(gifId: string): Promise<void> {
    const url = new URL(`${KLIPY_API_BASE}/${this.appKey}/gifs/${gifId}/share`);

    const response = await fetch(url.toString(), {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(
        `KLIPY API error: ${response.status} ${response.statusText}`
      );
    }
  }
}

let klipyApiInstance: KlipyAPI | null = null;

export const getKlipyAPI = (appKey?: string): KlipyAPI => {
  if (!klipyApiInstance && !appKey) {
    throw new Error("KLIPY app key is required for first initialization");
  }

  if (appKey && (!klipyApiInstance || klipyApiInstance["appKey"] !== appKey)) {
    klipyApiInstance = new KlipyAPI(appKey);
  }

  return klipyApiInstance!;
};

export const initKlipyAPI = (appKey: string): void => {
  klipyApiInstance = new KlipyAPI(appKey);
};
