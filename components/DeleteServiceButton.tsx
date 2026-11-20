"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type Props = {
  serviceId: string
  onDelete: (formData: FormData) => void
}

export function DeleteServiceButton({ serviceId, onDelete }: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="inline-flex items-center justify-center rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 transition-colors">
        Delete
      </AlertDialogTrigger>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the service
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          
          <form 
            action={async (formData) => {
              await onDelete(formData);
              toast.add({
                title: "Service deleted",
                description: "The service has been removed successfully.",
              });
            }}
          >
            <input type="hidden" name="id" value={serviceId} />
            <AlertDialogAction type="submit" className="bg-red-600 hover:bg-red-700 ">
              Delete
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}