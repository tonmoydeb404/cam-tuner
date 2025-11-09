"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Square } from "lucide-react";

type Props = {
  isStreaming: boolean;
  isLoading: boolean;
  error: string | null;
  onStart: () => void | Promise<void>;
  onStop: () => void;
  onRetry?: () => void | Promise<void>;
};

const PlayerActions = (props: Props) => {
  const { isStreaming, isLoading, error, onStart, onStop, onRetry } = props;
  return (
    <div className="w-full max-w-3xl flex items-center justify-between bg-sidebar px-5 py-3 rounded-xl border">
      {!!error ? (
        <>
          <div>{error}</div>
          <div>
            <Button onClick={onRetry}>Retry</Button>
          </div>
        </>
      ) : (
        <>
          <div>
            {isStreaming ? (
              <Button
                size="sm"
                variant="destructive"
                onClick={onStop}
                disabled={isLoading}
              >
                <Square className="size-4" />
                Stop
              </Button>
            ) : (
              <Button size="sm" onClick={onStart} disabled={isLoading}>
                <Play className="size-4" />
                Start
              </Button>
            )}
          </div>
          <div>
            <Badge variant={"outline"} className="px-3 py-1">
              {isStreaming ? "Streaming" : "Idle"}
            </Badge>
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerActions;
