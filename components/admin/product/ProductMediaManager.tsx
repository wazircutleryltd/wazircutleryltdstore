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

  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleImageValidation = (file: File): string | null => {
    if (!file.type.startsWith('image/')) return "Please select a valid image file";
    if (file.size > 25 * 1024 * 1024) return "Image size must be less than 25MB";
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

  // Canvas WebP optimizer that converts file to optimized WebP Blob
  const compressToWebpBlob = (file: File, maxDim = 1200, quality = 0.88): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, w, h);
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error("Canvas export failed"));
            },
            'image/webp',
            quality
          );
        };
        img.onerror = reject;
        img.src = (e.target?.result as string) || '';
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleGalleryUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => !handleImageValidation(f));
    if (fileArray.length === 0) return;

    // Single file allows manual cropping
    if (fileArray.length === 1 && files instanceof FileList) {
      processImage(fileArray[0], "additional");
      return;
    }

    setIsUploading(true);
    try {
      const uploadPromises = fileArray.map(async (file) => {
        const webpBlob = await compressToWebpBlob(file);
        return uploadImage(webpBlob, "products");
      });
      const uploadedUrls = await Promise.all(uploadPromises);
      onAdditionalImagesChange((prev: string[]) => [...(prev || []), ...uploadedUrls]);
    } catch (err) {
      console.error("Failed to batch upload gallery images:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const onCropComplete = async (croppedBlob: Blob) => {
    setIsUploading(true);
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
      setIsUploading(false);
      setCroppingImage(null);
      setCroppingType("");
    }
  };

  const handleMakeCover = (imageUrl: string, index: number) => {
    const oldMain = mainImagePreview;
    onMainImageChange(imageUrl);
    const updatedGallery = additionalImages.filter((_, i) => i !== index);
    if (oldMain) {
      updatedGallery.push(oldMain);
    }
    onAdditionalImagesChange(updatedGallery);
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
                className="w-full h-64 object-contain bg-neutral-50/80 p-2"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => mainImageInputRef.current?.click()}
                  className="bg-white/20 backdrop-blur-md text-white hover:bg-white/30 border-white/30 cursor-pointer text-xs"
                >
                  Change File
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => onMainImageChange("")}
                  className="bg-rose-500/80 backdrop-blur-md hover:bg-rose-600 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center relative 
                ${isDragOver ? 'border-[#D6AF66] bg-[#D6AF66]/10 scale-[1.01]' : errors?.mainImage ? 'border-rose-300 bg-rose-50/30' : 'border-gray-200 hover:border-[#D6AF66] hover:bg-amber-50/20'}`}
              onClick={() => mainImageInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  processImage(e.dataTransfer.files[0], "main");
                }
              }}
            >
              <div className="p-3.5 bg-neutral-50 rounded-2xl mb-3 group-hover:bg-[#D6AF66]/10 transition-colors">
                <Upload className="h-8 w-8 text-[#2C2C2C] opacity-40" />
              </div>
              <p className="text-sm font-bold text-[#2C2C2C] font-geist">Drag & Drop or Click to Upload Cover</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 25MB (Auto-compressed to WebP)</p>
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
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm font-semibold text-[#2C2C2C] block font-geist uppercase tracking-wider">
            Gallery Collection ({additionalImages?.length || 0})
          </Label>
          {isUploading && (
            <span className="text-xs font-bold text-[#D6AF66] animate-pulse">
              ⚡ Optimizing & uploading...
            </span>
          )}
        </div>

        <div 
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files) {
              handleGalleryUpload(e.dataTransfer.files);
            }
          }}
        >
          {(additionalImages || []).map((image, index) => (
            <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-neutral-50">
              <img
                src={image}
                alt={`Gallery ${index}`}
                className="w-full h-full object-contain p-1"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                <button
                  type="button"
                  title="Make this the Cover image"
                  onClick={() => handleMakeCover(image, index)}
                  className="bg-white/90 text-neutral-900 p-1.5 rounded-lg hover:bg-white text-[10px] font-bold shadow-sm cursor-pointer"
                >
                  Set Cover
                </button>
                <button
                  type="button"
                  title="Remove image"
                  onClick={() => onAdditionalImagesChange(additionalImages.filter((_, i) => i !== index))}
                  className="bg-rose-500 text-white p-1.5 rounded-lg hover:bg-rose-600 shadow-sm cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}

          {(additionalImages || []).length < 10 && (
            <button
              type="button"
              onClick={() => additionalImagesInputRef.current?.click()}
              className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center hover:border-[#D6AF66] hover:bg-amber-50/10 transition-all text-gray-400 hover:text-[#D6AF66] cursor-pointer p-2"
            >
              <Plus className="h-6 w-6 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-center">Batch Add Photos</span>
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
        <p className="mt-2.5 text-[11px] text-gray-400">
          💡 Drag & drop multiple photos directly here. They are automatically compressed to WebP and uploaded to the CDN.
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
