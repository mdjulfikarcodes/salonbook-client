"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation" 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createService } from "@/lib/actions/services"

const categories = ["Haircut", "Coloring", "Facial", "Makeup", "Spa", "Manicure", "Pedicure"]

export default function AddServicePage() {
  const router = useRouter(); 
  
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [duration, setDuration] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [status, setStatus] = useState("Active")
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setShowSuccess(false)

    const formData = new FormData()
    formData.append("name", name)
    formData.append("category", category)
    formData.append("description", description)
    formData.append("price", price)
    formData.append("duration", duration)
    formData.append("status", status)
    if (image) formData.append("image", image)

    try {
      console.log("1. Form Submit Start. Sending data to backend...")
      
      const result = await createService(formData)
      
      // ⬇️ এই লগটি দেখেই তুমি বুঝবে সার্ভার কী রেসপন্স দিচ্ছে
      console.log("2. Response from createService:", result)

      if (result) {
        console.log("3. Success! Redirecting to Manage Services...")
        router.push("/dashboard/admin/services") 
        router.refresh()
      } else {
        console.log("3. Failed! Result is null. Backend might be throwing an error.")
      }
    } catch (error) {
      console.error("Backend fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold">Add / Update Service</h1>
      <p className="mt-1 text-sm text-muted-foreground">Fill in the service details below.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">Service Name</label>
          <Input id="name" type="text" required placeholder="e.g. Premium Haircut" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Service Category</label>
          <Select value={category} onValueChange={(value) => setCategory(String(value))}>
            <SelectTrigger className="w-full cursor-pointer"><SelectValue placeholder="Select a category" /></SelectTrigger>
            <SelectContent>
              {categories.map((item) => (<SelectItem key={item} value={item}>{item}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium">Description</label>
          <Textarea id="description" required placeholder="Describe the service..." value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="mb-1 block text-sm font-medium">Price</label>
            <Input id="price" type="number" required placeholder="TK 500" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div>
            <label htmlFor="duration" className="mb-1 block text-sm font-medium">Estimated Duration (minutes)</label>
            <Input id="duration" type="number" required placeholder="minutes 45" value={duration} onChange={(e) => setDuration(e.target.value)} />
          </div>
        </div>

        <div>
          <label htmlFor="image" className="mb-1 block text-sm font-medium">Service Image (Upload)</label>
          <Input id="image" type="file" className="cursor-pointer" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Service Status</label>
          <Select value={status} onValueChange={(value) => setStatus(String(value))}>
            <SelectTrigger className="w-full cursor-pointer"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Active" className="cursor-pointer">Active</SelectItem>
              <SelectItem value="Inactive" className="cursor-pointer">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
          {loading ? "Uploading & Saving..." : "Publish Service"}
        </Button>
      </form>
    </div>
  )
}