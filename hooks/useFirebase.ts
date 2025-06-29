import { FirebaseStorageService } from '@/services/firebase/firebaseService';
import { useState } from 'react';
import { useNotification } from './useNotification';

export const useFirebase = () => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const { showSuccess, showError } = useNotification();

    const uploadImage = async (file: File) => {
        setUploading(true)
        setProgress(0);
        try 
        {
            const result = await FirebaseStorageService.uploadImageToFirebase(file);
            showSuccess('Ảnh đã được tải lên thành công!');
            return result;

        } catch (error) {
            showError('Đã xảy ra lỗi khi tải lên ảnh. Hãy thử lại!');
            return null
        } finally {
            setUploading(false);
            setProgress(0);
        }
    }

    const deleteByPath = async (path: string) => {
        try {
            if (!path) return

            await FirebaseStorageService.deleteImageByPath(path)
        } catch (error) {
            throw error
        }
    }


    return {
        uploading,
        progress,
        uploadImage,
        deleteByPath
    }
};
