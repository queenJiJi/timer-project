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
  align?: "center" | "left";
  confirmButtonSize?: "sm" | "md" | "lg";
  confirmFullWidth?: boolean;
};

export function AlertModal({
  open,
  title = "알림",
  description,
  onConfirm,
  align = "center",
  confirmButtonSize = "lg",
  confirmFullWidth = true,
}: AlertModalProps) {
  const textAlign = align === "center" ? "text-center" : "text-left";

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-[328px] rounded-xl"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className={`${textAlign} mb-6`}>{title}</DialogTitle>
          {description && (
            <DialogDescription className={`${textAlign} text-gray-600`}>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className={confirmFullWidth ? "mt-6" : "mt-3 flex justify-end"}>
          <Button
            size={confirmButtonSize}
            className={
              confirmFullWidth
                ? "w-full text-[18px] "
                : "w-[64px] h-12 text-[18px]"
            }
            onClick={onConfirm}
          >
            확인
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
