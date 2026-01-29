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

  confirmText: string;
  cancelText?: string;

  onConfirm: () => void;
  onCancel?: () => void;

  align?: "center" | "left";
  buttonSize?: "sm" | "md" | "lg";
  buttonWidth?: "w-full" | "w-[64px]" | "w-[110px]";
  buttonHeight?: "h-12" | "h-10";

  cancelButton?: boolean;
  fullButton?: boolean;
};

export function AlertModal({
  open,
  title = "알림",
  description,

  confirmText = "확인",
  cancelText = "취소",

  onConfirm,
  onCancel,

  align = "center",
  buttonSize = "lg",
  buttonWidth = "w-full",
  buttonHeight = "h-12",

  cancelButton = false,
  fullButton = false,
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
          {description ? (
            <DialogDescription className={`${textAlign} text-gray-600`}>
              {description}
            </DialogDescription>
          ) : (
            <DialogDescription className="sr-only">{title}</DialogDescription>
          )}
        </DialogHeader>

        <div className="flex justify-end">
          {cancelButton ? (
            <Button
              className={
                "w-[64px] h-12 bg-[#F9FAFB] text-mainColor font-semibold text-[18px] mt-6 mr-4"
              }
              onClick={onCancel}
            >
              {cancelText}
            </Button>
          ) : (
            ""
          )}
          <div className={`${fullButton ? "w-full" : ""} mt-6 `}>
            <Button
              size={buttonSize}
              className={`${buttonWidth} text-[18px] ${buttonHeight}`}
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
