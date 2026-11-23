import { toast } from "sonner";

/*
 * Small wrappers around the toast system so hooks and pages
 * can show feedback without blocking the screen like alert().
 * The <Toaster /> is mounted once in App.jsx.
 */

export function notifyError(message, title = "Something went wrong") {
  toast.error(title, {
    description: message,
  });
}

export function notifySuccess(message, title = "Done") {
  toast.success(title, {
    description: message,
  });
}
