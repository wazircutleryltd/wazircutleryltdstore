import { supabase } from './supabase';

/**
 * Uploads an image Blob or File to Supabase Storage ('products' bucket).
 * Gracefully falls back to a Base64 data URL if storage bucket is unavailable.
 */
export async function uploadImage(
  fileOrBlob: Blob | File,
  folder = 'products'
): Promise<string> {
  const extension = fileOrBlob.type === 'image/png' ? 'png' : fileOrBlob.type === 'image/webp' ? 'webp' : 'jpg';
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${extension}`;

  try {
    const { data, error } = await supabase.storage
      .from('products')
      .upload(fileName, fileOrBlob, {
        cacheControl: '31536000',
        upsert: false,
        contentType: fileOrBlob.type || 'image/jpeg',
      });

    if (!error && data?.path) {
      const { data: publicUrlData } = supabase.storage
        .from('products')
        .getPublicUrl(data.path);

      if (publicUrlData?.publicUrl) {
        return publicUrlData.publicUrl;
      }
    }

    if (error) {
      console.warn('Supabase storage upload failed, falling back to Base64:', error.message);
    }
  } catch (err) {
    console.warn('Supabase storage not accessible, falling back to Base64:', err);
  }

  // Graceful fallback: return Base64 string so upload never breaks UX
  return blobToBase64(fileOrBlob);
}

/**
 * Converts a Blob or File to Base64 string
 */
export function blobToBase64(blob: Blob | File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Uploads an array of Blobs or Files in parallel
 */
export async function uploadMultipleImages(
  files: (Blob | File)[],
  folder = 'products'
): Promise<string[]> {
  return Promise.all(files.map((file) => uploadImage(file, folder)));
}
