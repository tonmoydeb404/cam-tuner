import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/ui/feature-card";
import { useAppContext } from "@/context/app";
import { KlipyGif } from "@/types/klipy-api";
import { getKlipyAPI } from "@/utils/klipy-api";
import { ImageIcon, Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const GifSection = () => {
  const { overlay, setSelectedGif } = useAppContext();

  const [gifs, setGifs] = useState<KlipyGif[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);

  const KLIPY_API_KEY = import.meta.env.VITE_KLIPY_API_KEY;

  const loadTrendingGifs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const api = getKlipyAPI(KLIPY_API_KEY);
      const response = await api.trending({ per_page: 20 });

      console.log(response);

      setGifs(response?.data?.data);
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

      try {
        setLoading(true);
        setError(null);

        const api = getKlipyAPI(KLIPY_API_KEY);
        const response = await api.search(query, { per_page: 20 });

        setGifs(response.data.data);
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
      setSelectedGif(gif.file.hd.gif.url, gif.file.hd.mp4.url, gif.id.toString());
    },
    [setSelectedGif]
  );

  // Load trending GIFs on mount
  useEffect(() => {
    loadTrendingGifs();
  }, [loadTrendingGifs]);

  return (
    <FeatureCard
      title="GIF Overlays"
      description="Add animated GIFs to your video recordings"
      icon={ImageIcon}
      badge={overlay.enabled ? "Active" : undefined}
      badgeVariant={overlay.enabled ? "success" : "default"}
    >
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for GIFs..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={!searchQuery.trim() || loading}
          >
            Search
          </Button>
          {isSearchMode && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearSearch}
              disabled={loading}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>

      {/* Content Header */}
      <div className="flex items-center justify-between pt-2">
        <h4 className="text-sm font-medium text-muted-foreground">
          {isSearchMode ? `Search: "${searchQuery}"` : "Trending GIFs"}
        </h4>
        {gifs.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {gifs.length} results
          </span>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="relative rounded-md overflow-hidden border-2 border-border animate-pulse"
            >
              <div className="w-full h-24 bg-muted" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <div className="h-3 bg-white/30 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={loadTrendingGifs}
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      )}

      {/* GIF Grid */}
      {!loading && !error && gifs.length > 0 && (
        <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
          {gifs.map((gif) => (
            <div
              key={gif.id}
              className={`relative cursor-pointer rounded-md overflow-hidden border-2 transition-all hover:border-primary/50 ${
                overlay.gifId === gif.id.toString()
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-border/60"
              }`}
              onClick={() => handleGifSelect(gif)}
            >
              <img
                src={gif.file.sm.jpg.url}
                alt={gif.title}
                className="w-full h-24 object-cover"
                loading="lazy"
              />
              {overlay.gifId === gif.id.toString() && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs font-medium">
                    Selected
                  </div>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="text-xs text-white truncate">{gif.title}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && gifs.length === 0 && (
        <div className="text-center py-8">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {isSearchMode
              ? "No GIFs found for this search"
              : "No trending GIFs available"}
          </p>
          {isSearchMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearSearch}
              className="mt-2"
            >
              Back to Trending
            </Button>
          )}
        </div>
      )}

      {/* Selected GIF Info */}
      {overlay.enabled && overlay.gifUrl && (
        <div className="pt-3 border-t border-border/30">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
            Selected GIF
          </div>
          <div className="flex items-center gap-3 p-2 bg-accent/20 rounded-md border border-border/20">
            <img
              src={overlay.gifUrl}
              alt="Selected GIF"
              className="w-12 h-12 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Active Overlay</p>
              <p className="text-xs text-muted-foreground">
                Position: {overlay.position.x}%, {overlay.position.y}% •
                Scale: {overlay.scale}x • Duration: {overlay.duration}s
              </p>
            </div>
          </div>
        </div>
      )}

      {/* API Key Notice */}
      {!KLIPY_API_KEY && (
        <div className="mt-3 p-3 bg-warning/10 border border-warning/20 rounded-md">
          <p className="text-xs text-warning-foreground">
            <strong>Setup Required:</strong> Add your KLIPY API key to enable
            GIF search. Get your free key at{" "}
            <a
              href="https://partner.klipy.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              partner.klipy.com/api-keys
            </a>
          </p>
        </div>
      )}
    </FeatureCard>
  );
};

export default GifSection;
