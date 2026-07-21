/**
 * ActionOutcomeBanner — stage-head display for {@link useActionOutcome}.
 * Flat layer; success is calm, error is tinted. Empty when no outcome.
 */
import { Alert, AlertTitle, Box, Button } from "@mui/material";
import { clearOutcome, useActionOutcome } from "./ActionOutcome.js";

export function ActionOutcomeBanner({
  onDismiss,
}: {
  onDismiss?: () => void;
} = {}) {
  const outcome = useActionOutcome();
  if (!outcome) return null;
  const severity =
    outcome.status === "error" ? "error" : outcome.status === "pending" ? "info" : "success";
  return (
    <Box sx={{ mb: 2 }}>
      <Alert
        severity={severity}
        variant="outlined"
        onClose={() => {
          clearOutcome(outcome.id);
          onDismiss?.();
        }}
        action={
          outcome.status === "pending" ? (
            <Button color="inherit" size="small" disabled>
              Working…
            </Button>
          ) : undefined
        }
      >
        <AlertTitle>{outcome.label}</AlertTitle>
        {outcome.detail}
      </Alert>
    </Box>
  );
}

export default ActionOutcomeBanner;
