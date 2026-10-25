"use client";

import { useRef, useState } from "react";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Upload, X, Trash2, Plus } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import ImageCropper from "../ImageCropper";
import { uploadImage } from "@/lib/storage";

interface ProductMediaManagerProps {
  mainImagePreview: string;
  additionalImages: string[];
  onMainImageChange: (image: string) => void;
  onAdditionalImagesChange: (images: string[] | ((prev: string[]) => string[])) => void;
  errors: Record<string, string>;
}

export default function ProductMediaManager({ 
  mainImagePreview, 
  additionalImages, 
  onMainImageChange, 
  onAdditionalImagesChange,
  errors 
}: ProductMediaManagerProps) {
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesInputRef = useRef<HTMLInputElement>(null);
  const [croppingImage, setCroppingImage] = useState<string | null>(null);
  const [croppingType, setCroppingType] = useState<string>(""); // "main" or "additional"

  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState("");

  const handleImageValidation = (file: File): string | null => {
    if (!file.type.startsWith('image/')) return "Please select a valid image file";
    if (file.size > 15 * 1024 * 1024) return "Image size must be less than 15MB";
    return null;
  };

  const processImage = (file: File, type: string) => {
    const error = handleImageValidation(file);
    if (error) {
      alert(error);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setCroppingImage((e.target?.result as string) || null);
      setCroppingType(type);
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryUpload = (files: FileList) => {
    if (!files || files.length === 0) return;
    
    // If single file, allow crop
    if (files.length === 1) {
      processImage(files[0], "additional");
      return;
    }

    // If multiple files, auto-compress & add directly
    Array.from(files).forEach((file: File) => {
      const error = handleImageValidation(file);
      if (error) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 1200;
          let w = img.width;
          let h = img.height;
          if (w > MAX_SIZE || h > MAX_SIZE) {
            if (w > h) {
              h = Math.round((h * MAX_SIZE) / w);
              w = MAX_SIZE;
            } else {
              w = Math.round((w * MAX_SIZE) / h);
              h = MAX_SIZE;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          onAdditionalImagesChange((prev: string[]) => [...(prev || []), compressed]);
        };
        img.src = (e.target?.result as string) || '';
      };
      reader.readAsDataURL(file);
    });
  };

  const onCropComplete = async (croppedBlob: Blob) => {
    try {
      const imageUrl = await uploadImage(croppedBlob, "products");
      if (croppingType === "main") {
        onMainImageChange(imageUrl);
      } else {
        onAdditionalImagesChange([...(additionalImages || []), imageUrl]);
      }
    } catch (err) {
      console.error("Failed to process cropped image:", err);
    } finally {
      setCroppingImage(null);
      setCroppingType("");
    }
  };

  const handleApplyUrl = () => {
    if (urlInputValue.trim()) {
      onMainImageChange(urlInputValue.trim());
      setUrlInputValue("");
      setShowUrlInput(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Image Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm font-semibold text-[#2C2C2C] font-geist uppercase tracking-wider">
            Cover Image <span className="text-rose-500">*</span>
          </Label>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-xs font-bold text-[#D6AF66] hover:underline"
          >
            {showUrlInput ? "Use File Upload" : "Or Paste Image URL"}
          </button>
        </div>

        {showUrlInput && (
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={urlInputValue}
              onChange={(e) => setUrlInputValue(e.target.value)}
              placeholder="https://example.com/knife.jpg"
              className="flex-1 h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#D6AF66]"
            />
            <Button
              type="button"
              onClick={handleApplyUrl}
              className="h-10 px-4 bg-[#D6AF66] hover:bg-[#C19A5A] text-white rounded-xl text-xs font-bold"
            >
              Apply URL
            </Button>
          </div>
        )}

        <div className="mt-1">
          {mainImagePreview ? (
            <div className="relative group rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md">
              <img
                src={mainImagePreview}
                alt="Main product"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => mainImageInputRef.current?.click()}
                  className="bg-white/20 backdrop-blur-md text-white hover:bg-white/30 border-white/30"
                >
                  Change File
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => onMainImageChange("")}
                  className="bg-rose-500/80 backdrop-blur-md hover:bg-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center 
                ${errors?.mainImage ? 'border-rose-300 bg-rose-50/30' : 'border-gray-200 hover:border-[#D6AF66] hover:bg-gold-50/10'}`}
              onClick={() => mainImageInputRef.current?.click()}
            >
              <div className="p-4 bg-gray-50 rounded-2xl mb-4 group-hover:bg-[#D6AF66]/10 transition-colors">
                <Upload className="h-10 w-10 text-[#2C2C2C] opacity-40" />
              </div>
              <p className="text-sm font-bold text-[#2C2C2C] font-geist">Upload Principal Image</p>
              <p className="text-xs text-gray-400 mt-1 italic">PNG, JPG, WebP up to 15MB (Auto-compressed & Cropped)</p>
            </div>
          )}
          <input
            ref={mainImageInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                processImage(e.target.files[0], "main");
                e.target.value = "";
              }
            }}
            className="hidden"
          />
          {errors?.mainImage && (
            <p className="mt-2 text-xs font-bold text-rose-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {errors.mainImage}
            </p>
          )}
        </div>
      </div>

      {/* Gallery Section */}
      <div>
        <Label className="text-sm font-semibold text-[#2C2C2C] mb-2 block font-geist uppercase tracking-wider">
          Gallery Collection
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-1">
          {(additionalImages || []).map((image, index) => (
            <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm">
              <img
                src={image}
                alt={`Gallery ${index}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onAdditionalImagesChange(additionalImages.filter((_, i) => i !== index))}
                className="absolute top-2 right-2 bg-rose-500 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {(additionalImages || []).length < 8 && (
            <button
              type="button"
              onClick={() => additionalImagesInputRef.current?.click()}
              className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center hover:border-[#D6AF66] hover:bg-gold-50/10 transition-all text-gray-400 hover:text-[#D6AF66]"
            >
              <Plus className="h-8 w-8 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Add Photo</span>
            </button>
          )}
        </div>
        <input
          ref={additionalImagesInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              handleGalleryUpload(e.target.files);
              e.target.value = "";
            }
          }}
          className="hidden"
        />
        <p className="mt-3 text-[10px] text-gray-400 italic">
          Tip: Select single or multiple shots. We&apos;ll automatically optimize and downscale them (&lt;300KB each).
        </p>
      </div>

      {/* Internal Cropper Modal logic */}
      <AnimatePresence>
        {croppingImage && (
          <ImageCropper
            image={croppingImage}
            onCropComplete={onCropComplete}
            onCancel={() => {
              setCroppingImage(null);
              setCroppingType("");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
