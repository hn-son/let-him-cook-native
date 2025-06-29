import { FirebaseStorageService } from '@/services/firebase/firebaseService';
import { useState } from 'react';
import { useNotification } from './useNotification';

export const useFirebase = () => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const { showSuccess, showError } = useNotification();

    const uploadImage = async (uri: string, folder?: string): Promise<string | null> => {
        setUploading(true);
        setProgress(0);
        try {
            const validation = await FirebaseStorageService.validateImage(uri);

            if (!validation.isValid) {
                showError(validation.error || 'Ảnh không hợp lệ!');
                return null;
            }

            const downloadURL = await FirebaseStorageService.uploadImageToFirebase(uri, folder);
            setProgress(100);
            showSuccess('Tải ảnh lên thành công!');

            return downloadURL;
        } catch (error) {
            showError('Đã xảy ra lỗi khi tải lên ảnh. Hãy thử lại!');
            return null;
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    const deleteImage = async (
        imageUrl: string,
        allowNotification: boolean = false
    ): Promise<boolean> => {
        try {
            await FirebaseStorageService.deleteImage(imageUrl);
            allowNotification && showSuccess('Xóa ảnh thành công!');
            return true;
        } catch (error) {
            allowNotification && showError('Đã xảy ra lỗi khi xóa ảnh. Hãy thử lại!');
            return false;
        }
    };

    return {
        uploading,
        progress,
        uploadImage,
        deleteImage,
    };
};
