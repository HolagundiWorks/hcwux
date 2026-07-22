/**
 * HcwTelemetryRoot — optional product bootstrap for KPI session + fatigue offer.
 * Compose under {@link KitRoot}. Does not replace theme/locale.
 *
 *   <KitRoot coga={coga}>
 *     <HcwTelemetryRoot fatigueOffer onEnableCalm={() => setCoga("calm")}>
 *       <App />
 *     </HcwTelemetryRoot>
 *   </KitRoot>
 */
import { useEffect, type ReactNode } from "react";
import { FatigueOfferBanner } from "./FatigueOfferBanner.js";
import { startFatigueSession } from "./fatigue.js";

export type HcwTelemetryRootProps = {
  children: ReactNode;
  /** Start fatigue session on mount (default true). */
  startSession?: boolean;
  /** Render {@link FatigueOfferBanner} above children. */
  fatigueOffer?: boolean;
  onEnableCalm?: () => void;
  onDismissFatigue?: () => void;
};

export function HcwTelemetryRoot({
  children,
  startSession = true,
  fatigueOffer = false,
  onEnableCalm,
  onDismissFatigue,
}: HcwTelemetryRootProps) {
  useEffect(() => {
    if (startSession) startFatigueSession();
  }, [startSession]);

  return (
    <>
      {fatigueOffer ? (
        <FatigueOfferBanner onEnableCalm={onEnableCalm} onDismiss={onDismissFatigue} />
      ) : null}
      {children}
    </>
  );
}

export default HcwTelemetryRoot;
