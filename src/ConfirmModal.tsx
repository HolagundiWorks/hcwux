import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { typeScaleSx } from "./chrome-sx.js";
import { VOICE, colors } from "./tokens.js";

/**
 * ConfirmModal — confirmation for destructive / consequential actions (HCW:
 * destroy always confirms; never `window.confirm`).
 *
 * Voice: invitational defaults ({@link VOICE}) — empathic partner, not commander.
 *
 * Error taxonomy (Reason):
 * - **slip** — unintended action; confirm + optional undo path after.
 * - **mistake** — wrong belief/default; show `reason` explaining why blocked or
 *   what will change, then confirm.
 *
 *   <ConfirmModal open kind="mistake" reason="This client has open invoices." … />
 */
export type ConfirmKind = "slip" | "mistake";

export type ConfirmModalProps = {
  open: boolean;
  heading?: string;
  body: ReactNode;
  /** Mistake-path explanation (why this is consequential / blocked context). */
  reason?: ReactNode;
  kind?: ConfirmKind;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  pending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmModal({
  open,
  heading,
  body,
  reason,
  kind = "slip",
  confirmText = "Delete",
  cancelText = VOICE.cancelLabel,
  danger = true,
  pending = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  const title =
    heading ??
    (kind === "mistake" ? VOICE.confirmHeadingMistake : VOICE.confirmHeadingSlip);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" aria-labelledby="confirm-modal-title">
      <DialogTitle id="confirm-modal-title">{title}</DialogTitle>
      <DialogContent>
        {typeof body === "string" ? <p>{body}</p> : body}
        {(kind === "mistake" || reason) && reason ? (
          <Typography
            component="div"
            sx={{
              mt: 2,
              p: 1.5,
              backgroundColor: colors.layer02,
              borderInlineStart: `3px solid ${danger ? colors.supportError : colors.accent}`,
              ...typeScaleSx("body2"),
              color: colors.textSecondary,
            }}
          >
            {reason}
          </Typography>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="text" color="inherit">
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={pending}
          variant="contained"
          color={danger ? "error" : "primary"}
        >
          {pending ? VOICE.pendingLabel : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmModal;
