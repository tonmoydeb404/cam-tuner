export interface KlipyGifFile {
  gif: {
    url: string;
    width: number;
    height: number;
    size: number;
  };
  webp: {
    url: string;
    width: number;
    height: number;
    size: number;
  };
  jpg: {
    url: string;
    width: number;
    height: number;
    size: number;
  };
  mp4: {
    url: string;
    width: number;
    height: number;
    size: number;
  };
  webm: {
    url: string;
    width: number;
    height: number;
    size: number;
  };
}

export interface KlipyGif {
  id: number;
  slug: string;
  title: string;
  file: {
    hd: KlipyGifFile;
    md: KlipyGifFile;
    sm: KlipyGifFile;
    xs: KlipyGifFile;
  };
  tags: string[];
  type: string;
  blur_preview: string;
}

type BaseResponse<T> = {
  data: T;
  result: true;
};

export type KlipySearchResponse = BaseResponse<{
  data: KlipyGif[];
  page: number;
  per_page: number;
  total_pages: number;
  total_count: number;
}>;

export type KlipyTrendingResponse = BaseResponse<{
  data: KlipyGif[];
  page: number;
  per_page: number;
  total_pages: number;
  total_count: number;
}>;

export interface KlipyCategory {
  id: string;
  name: string;
  image_url: string;
  search_term: string;
}

export interface KlipyCategoriesResponse {
  data: KlipyCategory[];
}
