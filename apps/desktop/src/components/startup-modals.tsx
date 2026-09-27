import { DowngradeNoticeDialog } from "@/components/downgrade-notice-dialog";
import { UpdateNoticeDialog } from "@/components/update-notice-dialog";
import { WelcomeDialog } from "@/components/welcome-dialog";
import { useApp } from "@/context/app-context";
import { brand } from "@/lib/brand";
import { useCallback, useState } from "react";
import { coerce, compare } from "semver";

type StartupModalKind = "welcome" | "updated" | "downgraded" | null;

const VERSION_KEY = "last_opened_version";

export function StartupModals() {
  const { loading, settings, updateSetting } = useApp();
  const [dismissed, setDismissed] = useState(false);

  const stored = loading ? undefined : settings[VERSION_KEY];

  // Derived, not effect state: the optimistic settings update performed by
  // updateSetting() makes kind recompute to null, which closes the dialogs.
  let kind: StartupModalKind = null;
  let previousVersion: string | null = null;
  if (!loading && !dismissed) {
    if (!stored) {
      kind = "welcome";
    } else {
      const storedVer = coerce(stored);
      const currentVer = coerce(brand.version);
      if (storedVer && currentVer) {
        const cmp = compare(storedVer, currentVer);
        if (cmp < 0) {
          kind = "updated";
          previousVersion = stored;
        } else if (cmp > 0) {
          kind = "downgraded";
          previousVersion = stored;
        }
      }
    }
  }

  const handleWelcomeDone = useCallback(async () => {
    await updateSetting(VERSION_KEY, brand.version);
  }, [updateSetting]);

  const handleNoticeDismiss = useCallback(() => {
    updateSetting(VERSION_KEY, brand.version);
    setDismissed(true);
  }, [updateSetting]);

  return (
    <>
      <WelcomeDialog open={kind === "welcome"} onGetStarted={handleWelcomeDone} />
      <UpdateNoticeDialog
        open={kind === "updated"}
        previousVersion={previousVersion}
        onDismiss={handleNoticeDismiss}
      />
      <DowngradeNoticeDialog
        open={kind === "downgraded"}
        previousVersion={previousVersion ?? ""}
        onDismiss={handleNoticeDismiss}
      />
    </>
  );
}
