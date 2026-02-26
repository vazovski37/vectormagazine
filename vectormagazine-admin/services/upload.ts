import { supabase } from '@/lib/supabase';
import { UploadResponse } from '@/types/upload';
import { v4 as uuidv4 } from 'uuid';

// Allowed file types
const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];
const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov', 'avi'];

export function isVideoFile(filename: string): boolean {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    return VIDEO_EXTENSIONS.includes(ext);
}

export function isImageFile(filename: string): boolean {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    return IMAGE_EXTENSIONS.includes(ext);
}

function getFileExtension(filename: string): string {
    return filename.split('.').pop() || '';
}

// API Functions
export async function uploadImage(file: File): Promise<UploadResponse> {
    const fileExt = getFileExtension(file.name);
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

    if (error) {
        console.error('Upload Error:', error);
        return {
            success: 0,
            error: error.message
        };
    }

    const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

    return {
        success: 1,
        file: {
            url: publicUrl,
            type: isVideoFile(file.name) ? 'video' : 'image'
        }
    };
}

export async function uploadVideo(file: File): Promise<UploadResponse> {
    return uploadImage(file);
}

export async function uploadMedia(file: File): Promise<UploadResponse> {
    return uploadImage(file);
}

// Image/Video uploader function for Editor.js
export async function editorImageUploader(file: File): Promise<UploadResponse> {
    const result = await uploadImage(file);

    if (result.success !== 1) {
        const errorMessage = typeof result.error === 'string'
            ? result.error
            : result.error?.message || 'Upload failed';
        throw new Error(errorMessage);
    }

    return result;
}
