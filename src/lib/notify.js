import { toast } from "@/components/ui/use-toast";

/*
 * Small wrappers around the toast system so hooks and pages
 * can show feedback without blocking the screen like alert().
 */

export function notifyError(message, title = "Something went wrong") {
  toast({
    variant: "destructive",
    title,
    description: message,
  });
}

export function notifySuccess(message, title = "Done") {
  toast({
    title,
    description: message,
  });
}
