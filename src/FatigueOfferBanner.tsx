/**
 * FatigueOfferBanner — soft, dismissible offer when operational-load proxies fire.
 * Never blocks work. Prefer COGA calm / pause; P0 safety interrupts stay separate.
 *
 *   <FatigueOfferBanner onEnableCalm={() => setCoga("calm")} />
 *   // or controlled:
 *   <FatigueOfferBanner signal={assessment} offer={suggestFatigueCopy(kind)} />
 */
import { Alert, AlertTitle, Box, Button } from "@mui/material";
import { useEffect, useState, type ReactNode } from "react";
import {
  clearLatestFatigueOffer,
  getLatestFatigueOffer,
  subscribeFatigueOffer,
  type FatigueOffer,
} from "./fatigue.js";
import { VOICE } from "./tokens.js";

export type FatigueOfferBannerProps = {
  /** Controlled signal; defaults to latest emitted `ux.fatigue_signal`. */
  signal?: FatigueOffer | null;
  offer?: string;
  title?: string;
  onEnableCalm?: () => void;
  onDismiss?: () => void;
  calmLabel?: string;
  dismissLabel?: string;
};

export function FatigueOfferBanner({
  signal,
  offer,
  title = "A lighter pace may help",
  onEnableCalm,
  onDismiss,
  calmLabel = "Try calm mode",
  dismissLabel = VOICE.cancelLabel,
}: FatigueOfferBannerProps) {
  const [auto, setAuto] = useState<FatigueOffer | null>(() => getLatestFatigueOffer());
  useEffect(() => subscribeFatigueOffer(setAuto), []);

  const active = signal !== undefined ? signal : auto;
  if (!active) return null;

  const body: ReactNode = offer ?? active.offer ?? VOICE.fatiguePauseOffer;

  return (
    <Box sx={{ mb: 2 }} role="status" data-fatigue-kind={active.kind} data-fatigue-level={active.level}>
      <Alert
        severity="info"
        variant="outlined"
        onClose={() => {
          clearLatestFatigueOffer();
          onDismiss?.();
        }}
        action={
          <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
            {onEnableCalm ? (
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  onEnableCalm();
                  clearLatestFatigueOffer();
                }}
              >
                {calmLabel}
              </Button>
            ) : null}
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                clearLatestFatigueOffer();
                onDismiss?.();
              }}
            >
              {dismissLabel}
            </Button>
          </Box>
        }
      >
        <AlertTitle>{title}</AlertTitle>
        {body}
      </Alert>
    </Box>
  );
}

export default FatigueOfferBanner;
