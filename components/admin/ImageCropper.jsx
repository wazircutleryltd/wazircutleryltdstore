'use client';

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '../ui/button';
import { X, Check, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageCropper({ image, onCropComplete, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const onCropCompleteInternal = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return null;
    }

    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    // set each dimensions to double largest dimension to allow for a safe area for the
    // image to rotate in without being clipped by canvas boundaries
    canvas.width = safeArea;
    canvas.height = safeArea;

    // translate canvas context to a central point to allow rotating around the center.
    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-safeArea / 2, -safeArea / 2);

    // draw rotated image and store data.
    ctx.drawImage(
      image,
      safeArea / 2 - image.width * 0.5,
      safeArea / 2 - image.height * 0.5
    );
    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    // Intelligent Resizing/Compression
    const MAX_WIDTH = 1000;
    const MAX_HEIGHT = 1000;
    
    let targetWidth = pixelCrop.width;
    let targetHeight = pixelCrop.height;

    // Maintain aspect ratio while downscaling to max dimensions
    if (targetWidth > MAX_WIDTH || targetHeight > MAX_HEIGHT) {
      if (targetWidth > targetHeight) {
        targetHeight = Math.round((targetHeight * MAX_WIDTH) / targetWidth);
        targetWidth = MAX_WIDTH;
      } else {
        targetWidth = Math.round((targetWidth * MAX_HEIGHT) / targetHeight);
        targetHeight = MAX_HEIGHT;
      }
    }

    // set canvas width to final optimized size
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // paste generated rotate image with correct offsets and scaled dimensions
    ctx.putImageData(
      data,
      Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
      Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
    );
    
    // Create a secondary canvas for scaling if needed
    if (targetWidth !== pixelCrop.width) {
        const scalingCanvas = document.createElement('canvas');
        scalingCanvas.width = targetWidth;
        scalingCanvas.height = targetHeight;
        const sCtx = scalingCanvas.getContext('2d');
        sCtx.drawImage(canvas, 0, 0, pixelCrop.width, pixelCrop.height, 0, 0, targetWidth, targetHeight);
        
        return new Promise((resolve) => {
            scalingCanvas.toBlob((file) => {
              resolve(file);
            }, 'image/jpeg', 0.8); // 80% quality for optimal compression
        });
    }

    return new Promise((resolve) => {
      canvas.toBlob((file) => {
        resolve(file);
      }, 'image/jpeg', 0.8); // 80% quality for optimal compression
    });
  };

  const handleDone = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(image, croppedAreaPixels, rotation);
      onCropComplete(croppedImageBlob);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#0E0E0E]/95 backdrop-blur-sm">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#D6AF66]/20 flex items-center justify-center">
            <Check className="text-[#D6AF66] w-6 h-6" />
          </div>
          <div>
            <h3 className="text-white font-medium">Refine Product Image</h3>
            <p className="text-gray-400 text-xs">Adjust for perfect square presentation</p>
          </div>
        </div>
        <button 
          onClick={onCancel}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="text-white w-6 h-6" />
        </button>
      </div>

      <div className="relative flex-grow">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={1 / 1}
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteInternal}
          onZoomChange={onZoomChange}
        />
      </div>

      <div className="p-8 bg-[#1A1A1A] border-t border-white/10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400 font-medium">Zoom</span>
              <span className="text-xs text-[#D6AF66] bg-[#D6AF66]/10 px-2 py-0.5 rounded">{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#D6AF66]"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400 font-medium">Rotation</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setRotation(0)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  title="Reset Rotation"
                >
                  <RotateCcw className="w-3 h-3 text-gray-400" />
                </button>
                <span className="text-xs text-[#D6AF66] bg-[#D6AF66]/10 px-2 py-0.5 rounded">{rotation}°</span>
              </div>
            </div>
            <input
              type="range"
              value={rotation}
              min={0}
              max={360}
              step={1}
              aria-labelledby="Rotation"
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#D6AF66]"
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4 border-t border-white/5">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="text-white hover:bg-white/10 px-8"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDone}
            className="bg-[#D6AF66] hover:bg-[#C5A055] text-[#0E0E0E] font-bold px-12 py-6 rounded-xl shadow-lg shadow-[#D6AF66]/20 transition-all hover:scale-105"
          >
            Finalize Crop
          </Button>
        </div>
      </div>
    </div>
  );
}
