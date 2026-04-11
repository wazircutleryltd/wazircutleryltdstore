"use client";

import { useRef, useState } from "react";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Upload, X, Trash2, Plus, Image as ImageIcon } from "lucide-react";
import ImageCropper from "../ImageCropper";

export default function ProductMediaManager({ 
  mainImagePreview, 
  additionalImages, 
  onMainImageChange, 
  onAdditionalImagesChange,
  errors 
}) {
  const mainImageInputRef = useRef(null);
  const additionalImagesInputRef = useRef(null);
  const [croppingImage, setCroppingImage] = useState(null);
  const [croppingType, setCroppingType] = useState(""); // "main" or "additional"

  const handleImageValidation = (file) => {
    if (!file.type.startsWith('image/')) return "Please select a valid image file";
    if (file.size > 10 * 1024 * 1024) return "Image size must be less than 10MB";
    return null;
  };

  const processImage = (file, type) => {
    const error = handleImageValidation(file);
    if (error) {
      // In a real app, you'd pass this error back up
      alert(error);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setCroppingImage(e.target.result);
      setCroppingType(type);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = (croppedBlob) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result;
      if (croppingType === "main") {
        onMainImageChange(base64data);
      } else {
        onAdditionalImagesChange([...additionalImages, base64data]);
      }
      setCroppingImage(null);
      setCroppingType("");
    };
    reader.readAsDataURL(croppedBlob);
  };

  return (
    <div className="space-y-6">
      {/* Main Image Section */}
      <div>
        <Label className="text-sm font-semibold text-[#2C2C2C] mb-2 block font-geist uppercase tracking-wider">
          Cover Image <span className="text-rose-500">*</span>
        </Label>
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
                  Change
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
                ${errors.mainImage ? 'border-rose-300 bg-rose-50/30' : 'border-gray-200 hover:border-[#D6AF66] hover:bg-gold-50/10'}`}
              onClick={() => mainImageInputRef.current?.click()}
            >
              <div className="p-4 bg-gray-50 rounded-2xl mb-4 group-hover:bg-[#D6AF66]/10 transition-colors">
                <Upload className="h-10 w-10 text-[#2C2C2C] opacity-40" />
              </div>
              <p className="text-sm font-bold text-[#2C2C2C] font-geist">Upload Principal Image</p>
              <p className="text-xs text-gray-400 mt-1 italic">PNG, JPG or WebP up to 10MB (Auto-compressed)</p>
            </div>
          )}
          <input
            ref={mainImageInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files[0] && processImage(e.target.files[0], "main")}
            className="hidden"
          />
          {errors.mainImage && (
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
          {additionalImages.map((image, index) => (
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
          {additionalImages.length < 8 && (
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
          onChange={(e) => Array.from(e.target.files).forEach(f => processImage(f, "additional"))}
          className="hidden"
        />
        <p className="mt-3 text-[10px] text-gray-400 italic">
          Tip: Use high-resolution shots. We'll automatically optimize them for the web (Sub 1MB).
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
