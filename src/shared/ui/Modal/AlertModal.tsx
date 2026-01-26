import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/shared/ui";

type AlertModalProps = {
  open: boolean;
  title?: string;
  description?: string;
  onConfirm: () => void;
  close: boolean;
};

export function AlertModal({
  open,
  title = "알림",
  description,
  onConfirm,
}: AlertModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="max-w-[360px] rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-600">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <Button size="lg" className="w-full" onClick={onConfirm}>
            확인
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
