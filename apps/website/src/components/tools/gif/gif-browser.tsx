"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMediaOverlayContext } from "@/context/media-overlay-context";
import { KlipyGif } from "@/types/klipy-api";
import { getKlipyAPI } from "@/utils/klipy-api";
import { ImageIcon, Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function GifBrowser() {
  const { setSelectedGifUrl } = useMediaOverlayContext();
  const [gifs, setGifs] = useState<KlipyGif[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);

  const KLIPY_API_KEY = process.env.NEXT_PUBLIC_KLIPY_API_KEY;

  const loadTrendingGifs = useCallback(async () => {
    if (!KLIPY_API_KEY) {
      setError("KLIPY API key not configured");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const api = getKlipyAPI(KLIPY_API_KEY);
      const response = await api.trending({ per_page: 20 });

      setGifs(response?.data?.data || []);
      setIsSearchMode(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load trending GIFs"
      );
    } finally {
      setLoading(false);
    }
  }, [KLIPY_API_KEY]);

  const searchGifs = useCallback(
    async (query: string) => {
      if (!query.trim()) return;
      if (!KLIPY_API_KEY) {
        setError("KLIPY API key not configured");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const api = getKlipyAPI(KLIPY_API_KEY);
        const response = await api.search(query, { per_page: 20 });

        setGifs(response.data.data || []);
        setIsSearchMode(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to search GIFs");
      } finally {
        setLoading(false);
      }
    },
    [KLIPY_API_KEY]
  );

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        searchGifs(searchQuery.trim());
      }
    },
    [searchQuery, searchGifs]
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setIsSearchMode(false);
    loadTrendingGifs();
  }, [loadTrendingGifs]);

  const handleGifSelect = useCallback(
    (gif: KlipyGif) => {
      const gifUrl = gif.file.md.gif.url;
      setSelectedGifUrl(gifUrl);
    },
    [setSelectedGifUrl]
  );

  useEffect(() => {
    loadTrendingGifs();
  }, [loadTrendingGifs]);

  if (!KLIPY_API_KEY) {
    return (
      <div className="text-center py-8 space-y-3">
        <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Klipy API key required
        </p>
        <p className="text-xs text-muted-foreground">
          Add NEXT_PUBLIC_KLIPY_API_KEY to .env.local
        </p>
        <Button variant="outline" size="sm" asChild>
          <a
            href="https://partner.klipy.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get API Key
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Search GIFs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
        {isSearchMode && (
          <Button
            type="button"
            onClick={handleClearSearch}
            variant="outline"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </form>

      {/* Error State */}
      {error && (
        <div className="text-center py-4 text-sm text-destructive">
          {error}
          <Button
            onClick={loadTrendingGifs}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-2 gap-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="aspect-video bg-muted animate-pulse rounded-md"
            />
          ))}
        </div>
      )}

      {/* GIF Grid */}
      {!loading && !error && gifs.length > 0 && (
        <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
          {gifs.map((gif) => (
            <button
              key={gif.id}
              onClick={() => handleGifSelect(gif)}
              className="relative aspect-video overflow-hidden rounded-md border border-border hover:border-primary transition-colors group"
            >
              <img
                src={gif.file.sm.gif.url}
                alt={gif.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </button>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && gifs.length === 0 && (
        <div className="text-center py-8">
          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No GIFs found</p>
        </div>
      )}
    </div>
  );
}
