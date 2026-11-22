"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authFetch } from "@/lib/core/client" 
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
}

export function DeleteServiceButton({ serviceId }: Props) {
  const router = useRouter()
  const BASE_URL = process.env.API_BASE_URL || "http://localhost:5000"

  const handleDelete = async () => {
    try {
      const res = await authFetch(`${BASE_URL}/services/${serviceId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("Service deleted", {
          description: "The service has been removed successfully.",
        })
        router.refresh()
      } else {
        toast.error("Error", {
          description: "Failed to delete service.",
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <AlertDialog>
      {/* ⬇️ এখানে asChild এরর দিচ্ছিল, সেটি সরিয়ে সরাসরি className দেওয়া হলো */}
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
          
          <AlertDialogAction 
            onClick={handleDelete} 
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}