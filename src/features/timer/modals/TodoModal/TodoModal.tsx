import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { StartBody, TodoModalMode } from "./types";
import StartPanel from "./StartPanel";
import ManagePanel from "./ManagePanel";
import StopPanel from "./StopPanel";

type Props = {
  open: boolean;
  mode: TodoModalMode;
  onClose: () => void;

  onSubmitStart?: (body: StartBody) => void;
  onSubmitStop?: () => void;
};

export default function TodoModal({
  open,
  mode,
  onClose,
  onSubmitStart,
}: Props) {
  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-[640px] rounded-lg px-9 py-12"
        showCloseButton={false}
        // 바깥눌러도 닫히지 않게
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {mode === "start" && (
          <StartPanel onClose={onClose} onSubmit={onSubmitStart} />
        )}

        {mode === "manage" && <ManagePanel open={open} onClose={onClose} />}

        {mode === "stop" && <StopPanel open={open} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}
