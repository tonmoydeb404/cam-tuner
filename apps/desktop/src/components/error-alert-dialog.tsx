import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { useModal } from "@/context/modal-context";

export function ErrorAlertDialog() {
  const { alert } = useModal();

  return (
    <AlertDialog
      open={alert.isOpen}
      onOpenChange={(open) => {
        if (!open) alert.close();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Something went wrong</AlertDialogTitle>
          <AlertDialogDescription>{alert.value}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => alert.close()}>
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
