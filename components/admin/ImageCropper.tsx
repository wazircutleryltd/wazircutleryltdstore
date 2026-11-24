'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '../ui/button';
import { 
  X, 
  Check, 
  RotateCcw, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Grid, 
  RefreshCw,
  Crop as CropIcon,
  Sparkles,
  Layers
} from 'lucide-react';

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
  defaultAspect?: number;
}

interface AspectRatioOption {
  id: string;
  label: string;
  value: number | undefined;
  hint: string;
}

const ASPECT_RATIOS: AspectRatioOption[] = [
  { id: 'free', label: 'Free', value: undefined, hint: 'Custom free-form box' },
  { id: '1-1', label: '1:1 Square', value: 1 / 1, hint: 'Catalog thumbnail & avatars' },
  { id: '3-1', label: '3:1 Sword', value: 3 / 1, hint: 'Long swords, katanas & display props' },
  { id: '2-1', label: '2:1 Knife', value: 2 / 1, hint: 'Hunting knives & chef cutlery' },
  { id: '16-9', label: '16:9 Wide', value: 16 / 9, hint: 'Widescreen hero & banner' },
  { id: '4-3', label: '4:3 Classic', value: 4 / 3, hint: 'Standard product photo' },
  { id: '3-4', label: '3:4 Portrait', value: 3 / 4, hint: 'Vertical story & detail view' },
];

export default function ImageCropper({ 
  image, 
  onCropComplete, 
  onCancel,
  defaultAspect = undefined 
}: ImageCropperProps) {
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(defaultAspect);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const onCropChange = (newCrop: { x: number; y: number }) => {
    setCrop(newCrop);
  };

  const onZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  const onCropCompleteInternal = useCallback((_croppedArea: any, pixels: CropArea) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const rotateBy = (deltaDegrees: number) => {
    setRotation((prev) => {
      const next = (prev + deltaDegrees) % 360;
      return next < 0 ? next + 360 : next;
    });
  };

  const resetAll = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setAspectRatio(defaultAspect);
  };

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

  const getCroppedImg = async (
    imageSrc: string, 
    pixelCrop: CropArea | null, 
    rotationAngle = 0
  ): Promise<Blob | null> => {
    const img: HTMLImageElement = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

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

    const currentCrop = pixelCrop && pixelCrop.width && pixelCrop.height 
      ? pixelCrop 
      : { x: 0, y: 0, width: bBoxWidth, height: bBoxHeight };

    // Set maximum dimension to preserve ultra-fine Damascus pattern details without memory overflow
    const MAX_DIM = 2400;
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
      // First attempt high-efficiency WebP, fallback to JPEG
      outputCanvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            outputCanvas.toBlob(
              (fallbackBlob) => {
                if (fallbackBlob) resolve(fallbackBlob);
                else reject(new Error('Canvas image creation failed'));
              },
              'image/jpeg',
              0.92
            );
          }
        },
        'image/webp',
        0.92
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
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#0A0A0A]/95 backdrop-blur-md select-none">
      {/* Top Header & Aspect Ratio Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 border-b border-white/10 bg-[#121212]/90">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D6AF66]/20 border border-[#D6AF66]/30 flex items-center justify-center flex-shrink-0">
            <CropIcon className="text-[#D6AF66] w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm font-geist flex items-center gap-2">
              Flexible Image Studio
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#D6AF66]/20 text-[#D6AF66] font-bold">
                PRO
              </span>
            </h3>
            <p className="text-neutral-400 text-xs font-geist">
              Choose free-form or preset ratios tailored for swords & cutlery
            </p>
          </div>
        </div>

        {/* Aspect Ratio Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {ASPECT_RATIOS.map((option) => {
            const isSelected = aspectRatio === option.value;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setAspectRatio(option.value)}
                title={option.hint}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#D6AF66] text-[#0A0A0A] shadow-md shadow-[#D6AF66]/20'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/5'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <button 
          onClick={onCancel}
          type="button"
          aria-label="Close image cropper"
          className="p-2 hover:bg-white/10 text-neutral-400 hover:text-white rounded-xl transition-colors self-end sm:self-auto cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Cropper Viewport */}
      <div className="relative flex-grow bg-[#000000]">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={aspectRatio}
          showGrid={showGrid}
          minZoom={1}
          maxZoom={4}
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteInternal}
          onZoomChange={onZoomChange}
        />

        {/* Real-time Dimensions HUD */}
        {croppedAreaPixels && (
          <div className="absolute bottom-4 right-4 pointer-events-none bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[11px] font-mono text-neutral-300 shadow-xl flex items-center gap-2">
            <span className="text-[#D6AF66] font-bold">{Math.round(croppedAreaPixels.width)} × {Math.round(croppedAreaPixels.height)} px</span>
            <span className="text-neutral-500">•</span>
            <span>
              {aspectRatio ? `${aspectRatio >= 1 ? aspectRatio.toFixed(1) : (1 / aspectRatio).toFixed(1)}:1` : 'Free Box'}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Fine-Tuning & Action Controls */}
      <div className="p-4 sm:p-6 bg-[#121212] border-t border-white/10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto items-center">
          {/* Zoom Controls */}
          <div className="space-y-2 bg-white/5 p-3 rounded-xl border border-white/5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-300 font-bold flex items-center gap-1.5 font-geist">
                <ZoomIn className="w-3.5 h-3.5 text-[#D6AF66]" /> Zoom
              </span>
              <span className="text-xs font-mono font-bold text-[#D6AF66]">
                {Math.round(zoom * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(1, z - 0.2))}
                className="p-1 hover:bg-white/10 rounded text-neutral-300 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <input
                type="range"
                value={zoom}
                min={1}
                max={4}
                step={0.05}
                aria-label="Zoom slider"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[#D6AF66]"
              />
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(4, z + 0.2))}
                className="p-1 hover:bg-white/10 rounded text-neutral-300 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Orientation & Rotation Controls */}
          <div className="space-y-2 bg-white/5 p-3 rounded-xl border border-white/5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-300 font-bold flex items-center gap-1.5 font-geist">
                <RotateCw className="w-3.5 h-3.5 text-[#D6AF66]" /> Rotation
              </span>
              <span className="text-xs font-mono font-bold text-[#D6AF66]">
                {rotation}°
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => rotateBy(-90)}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                title="Rotate 90° Counter-Clockwise"
              >
                <RotateCcw className="w-3 h-3" />
                <span>90°</span>
              </button>

              <input
                type="range"
                value={rotation}
                min={0}
                max={360}
                step={1}
                aria-label="Rotation slider"
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[#D6AF66]"
              />

              <button
                type="button"
                onClick={() => rotateBy(90)}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                title="Rotate 90° Clockwise"
              >
                <RotateCw className="w-3 h-3" />
                <span>90°</span>
              </button>
            </div>
          </div>

          {/* Viewport Toggles & Reset */}
          <div className="flex items-center justify-between sm:justify-end gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => setShowGrid((g) => !g)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                showGrid 
                  ? 'bg-[#D6AF66]/20 text-[#D6AF66] border border-[#D6AF66]/30' 
                  : 'bg-white/5 text-neutral-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid {showGrid ? 'ON' : 'OFF'}</span>
            </button>

            <button
              type="button"
              onClick={resetAll}
              className="px-3 py-2 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              title="Reset Crop & Orientation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center sm:justify-end gap-3 pt-3 border-t border-white/10 max-w-6xl mx-auto">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isProcessing}
            className="text-neutral-300 hover:text-white hover:bg-white/10 px-6 h-11 rounded-xl cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleDone}
            disabled={isProcessing}
            className="bg-gradient-to-r from-[#D6AF66] to-[#E5C278] hover:from-[#C49F5A] hover:to-[#D6AF66] text-[#0A0A0A] font-bold px-8 h-11 rounded-xl shadow-lg shadow-[#D6AF66]/20 transition-all hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing Crop...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 text-[#0A0A0A]" />
                <span>Apply & Save Crop</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
