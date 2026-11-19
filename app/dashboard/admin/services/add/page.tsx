"use client"

import { useState, type FormEvent } from "react"

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

const categories = ["Haircut", "Coloring", "Facial", "Makeup", "Spa", "Manicure", "Pedicure"]

export default function AddServicePage() {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [duration, setDuration] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [status, setStatus] = useState("Active")
  const [showSuccess, setShowSuccess] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // Collect all form data (nothing is sent to a server)
    const serviceData = { name, category, description, price, duration, image, status }
    console.log("Service data:", serviceData)

    setShowSuccess(true)
  }

  return (
    <div className="max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold">Add / Update Service</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Fill in the service details below.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            Service Name
          </label>
          <Input
            id="name"
            type="text"
            placeholder="e.g. Premium Haircut"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Service Category
          </label>
          <Select value={category} onValueChange={(value) => setCategory(String(value))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium">
            Description
          </label>
          <Textarea
            id="description"
            placeholder="Describe the service..."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="mb-1 block text-sm font-medium">
              Price
            </label>
            <Input
              id="price"
              type="number"
              placeholder="e.g. 500"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="duration" className="mb-1 block text-sm font-medium">
              Estimated Duration (minutes)
            </label>
            <Input
              id="duration"
              type="number"
              placeholder="e.g. 45"
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="image" className="mb-1 block text-sm font-medium">
            Service Image
          </label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(event) => setImage(event.target.files?.[0] ?? null)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Service Status
          </label>
          <Select value={status} onValueChange={(value) => setStatus(String(value))}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {showSuccess && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-500/10 dark:text-green-400">
            Service saved! Check the browser console to see the collected data.
          </p>
        )}

        <Button type="submit">Save Service</Button>
      </form>
    </div>
  )
}
