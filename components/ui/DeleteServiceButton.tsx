"use client"

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
      {/* ⬇️ asChild সরিয়ে সরাসরি স্টাইল দেওয়া হলো */}
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
          {/* ⬇️ সার্ভার অ্যাকশনটি ফর্মের মাধ্যমে কল করা হচ্ছে */}
          <form action={onDelete}>
            <input type="hidden" name="id" value={serviceId} />
            <AlertDialogAction type="submit" className="bg-red-600 hover:bg-red-700">
              Continue
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}