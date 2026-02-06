import { fetchFormData } from './api';
import { API_ENDPOINTS } from './endpoints';

// Types
import { UploadResponse } from '@/types/upload';

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

// API Functions
export async function uploadImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);

    return fetchFormData<UploadResponse>(API_ENDPOINTS.UPLOAD.BASE, formData);
}

export async function uploadVideo(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file); // Backend uses 'image' field for all uploads

    return fetchFormData<UploadResponse>(API_ENDPOINTS.UPLOAD.BASE, formData);
}

export async function uploadMedia(file: File): Promise<UploadResponse> {
    // Unified upload function for both images and videos
    return uploadImage(file);
}

// Image/Video uploader function for Editor.js
export async function editorImageUploader(file: File): Promise<UploadResponse> {
    const result = await uploadImage(file);

    if (result.success !== 1) {
        throw new Error(result.error?.message || 'Upload failed');
    }

    return result;
}
