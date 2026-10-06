'use client';

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '../ui/button';
import { X, Check, RotateCcw } from 'lucide-react';

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

export default function ImageCropper({ image, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [, setIsProcessing] = useState<boolean>(false);

  const onCropChange = (newCrop: { x: number; y: number }) => {
    setCrop(newCrop);
  };

  const onZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  const onCropCompleteInternal = useCallback((_croppedArea: any, pixels: any) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener('load', () => resolve(img));
      img.addEventListener('error', (error) => reject(error));
      if (typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'))) {
        img.setAttribute('crossOrigin', 'anonymous');
      }
      img.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: any, rotationAngle = 0): Promise<Blob | null> => {
    const img: HTMLImageElement = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return null;
    }

    const currentCrop = pixelCrop && pixelCrop.width && pixelCrop.height 
      ? pixelCrop 
      : { x: 0, y: 0, width: img.width, height: img.height };

    const rotRad = ((rotationAngle || 0) * Math.PI) / 180;

    const sin = Math.abs(Math.sin(rotRad));
    const cos = Math.abs(Math.cos(rotRad));
    const bBoxWidth = Math.floor(img.width * cos + img.height * sin);
    const bBoxHeight = Math.floor(img.width * sin + img.height * cos);

    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.translate(-img.width / 2, -img.height / 2);
    ctx.drawImage(img, 0, 0);

    const MAX_DIM = 1200;
    let targetWidth = currentCrop.width;
    let targetHeight = currentCrop.height;

    if (targetWidth > MAX_DIM || targetHeight > MAX_DIM) {
      if (targetWidth > targetHeight) {
        targetHeight = Math.round((targetHeight * MAX_DIM) / targetWidth);
        targetWidth = MAX_DIM;
      } else {
        targetWidth = Math.round((targetWidth * MAX_DIM) / targetHeight);
        targetHeight = MAX_DIM;
      }
    }

    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = targetWidth;
    outputCanvas.height = targetHeight;
    const outCtx = outputCanvas.getContext('2d');

    if (!outCtx) return null;

    outCtx.imageSmoothingEnabled = true;
    outCtx.imageSmoothingQuality = 'high';

    outCtx.drawImage(
      canvas,
      currentCrop.x,
      currentCrop.y,
      currentCrop.width,
      currentCrop.height,
      0,
      0,
      targetWidth,
      targetHeight
    );

    return new Promise((resolve, reject) => {
      outputCanvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas image creation failed'));
            return;
          }
          resolve(blob);
        },
        'image/jpeg',
        0.85
      );
    });
  };

  const handleDone = async () => {
    try {
      setIsProcessing(true);
      const croppedImageBlob = await getCroppedImg(image, croppedAreaPixels, rotation);
      if (croppedImageBlob) {
        onCropComplete(croppedImageBlob);
      }
    } catch (e) {
      console.error('Error generating cropped image:', e);
    } finally {
      setIsProcessing(false);
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
