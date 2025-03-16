"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { ImagePlus, X } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value: string[]
  onChange: (value: string[]) => void
  maxImages?: number
}

export function ImageUpload({ value = [], onChange, maxImages = 5 }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: FileList | null) => {
      if (!acceptedFiles) return

      const newFiles = Array.from(acceptedFiles)
        .filter((file) => file.type.startsWith("image/"))
        .slice(0, maxImages - value.length)

      // In a real application, you would upload these files to your storage
      // For now, we'll create object URLs
      const newUrls = newFiles.map((file) => URL.createObjectURL(file))
      onChange([...value, ...newUrls])
    },
    [value, onChange, maxImages],
  )

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      onDrop(e.dataTransfer.files)
    },
    [onDrop],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      onDrop(e.target.files)
    },
    [onDrop],
  )

  const removeImage = useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index))
    },
    [value, onChange],
  )

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center ${
          dragActive ? "border-primary" : "border-muted"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input type="file" multiple accept="image/*" className="hidden" id="image-upload" onChange={handleChange} />
        <label htmlFor="image-upload" className="flex flex-col items-center gap-2 cursor-pointer">
          <ImagePlus className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Drag & drop images here or click to select</p>
          <p className="text-xs text-muted-foreground">Maximum {maxImages} images • PNG, JPG up to 5MB each</p>
        </label>
      </div>
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src={url || "/placeholder.svg"}
                  alt={`Uploaded image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

