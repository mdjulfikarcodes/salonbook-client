"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { updateService } from "@/lib/actions/services"

type Props = {
  serviceId: string
  currentStatus: string
}

export function ToggleStatusButton({ serviceId, currentStatus }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleToggle = async () => {
    setLoading(true)
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active"

    try {
      const result = await updateService(serviceId, { status: newStatus })
      
    
      if (result) {
        toast.success(`Service marked as ${newStatus}`)
        router.refresh() 
      } else {
        toast.error("Failed to update status")
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to update status")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleToggle} 
      disabled={loading}
    >
      {loading ? "Updating..." : currentStatus === "Active" ? "Deactivate" : "Activate"}
    </Button>
  )
}