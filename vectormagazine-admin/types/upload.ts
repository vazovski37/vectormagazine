export interface UploadResponse {
    success: 1 | 0;
    file?: {
        url: string;
        type?: 'image' | 'video';
    };
    error?: {
        message: string;
    };
}
