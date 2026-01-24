"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Upload, X, Plus } from "lucide-react";

interface ItemFormProps {
  initialData?: {
    _id?: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: string;
  };
  categories: string[];
  onSubmit: (data: unknown) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface ImagePreview {
  file: File;
  previewUrl: string;
  isNew: boolean;
}

export function ItemForm({
  initialData,
  categories,
  onSubmit,
  onCancel,
  isLoading,
}: ItemFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    category: initialData?.category || categories[0] || "",
    images: initialData?.images || [],
  });
  const [newCategory, setNewCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allCategories = newCategory ? [...categories, newCategory] : categories;

  // Load existing images from initialData into previews
  useEffect(() => {
    if (initialData?.images) {
      const existingPreviews = initialData.images.map((url, index) => ({
        file: new File([], `existing_${index}`),
        previewUrl: url,
        isNew: false,
      }));
      setImagePreviews(existingPreviews);
    }
  }, [initialData]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        if (preview.isNew && preview.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(preview.previewUrl);
        }
      });
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // Upload new images that haven't been uploaded yet
      let uploadedUrls: string[] = [];

      console.log("Processing image preview:", imagePreviews);
      const uploadFormData = new FormData();
      for (const preview of imagePreviews)
        uploadFormData.append("file", preview.file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (response.ok) {
        const { data } = (await response.json()) as { data: { url: string }[] };
        uploadedUrls = data.map((item) => item.url);
        console.log("Uploaded image URLs:", uploadedUrls);
      } else {
        throw new Error("Failed to upload image");
      }

      await onSubmit({
        ...formData,
        images: uploadedUrls,
        category: newCategory || formData.category || "all",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to upload images. Please try again.");
      setIsUploading(false);
    }
  };

  const handleImageSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newPreviews: ImagePreview[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;

      const previewUrl = URL.createObjectURL(file);
      newPreviews.push({
        file,
        previewUrl,
        isNew: true,
      });
    }

    setImagePreviews((prev) => [...prev, ...newPreviews]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => {
      const newPreviews = prev.filter((_, i) => i !== index);
      // Revoke the object URL to avoid memory leaks
      if (prev[index].isNew && prev[index].previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(prev[index].previewUrl);
      }
      return newPreviews;
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleImageSelect(e.dataTransfer.files);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Item Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Price
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                price: parseFloat(e.target.value) || 0,
              }))
            }
            min={0}
            step={0.01}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, category: e.target.value }))
            }
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="__new__">+ Add new category</option>
          </select>
        </div>
      </div>

      {formData.category === "__new__" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            New Category Name
          </label>
          <input
            type="text"
            value={newCategory || ""}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Images
        </label>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
          }`}
        >
          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Drag and drop images here, or click to select
          </p>
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={(e) => handleImageSelect(e.target.files)}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Select Images
          </label>
        </div>

        {isUploading && (
          <p className="text-sm text-gray-500 mt-2">Uploading images...</p>
        )}

        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-4">
            {imagePreviews.map((preview, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700"
              >
                <Image
                  src={preview.previewUrl}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? "Saving..."
            : initialData?._id
              ? "Update Item"
              : "Add Item"}
        </button>
      </div>
    </form>
  );
}
