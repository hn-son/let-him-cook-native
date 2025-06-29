import { deleteObject, firebaseStorage, getDownloadURL, ref, uploadBytes } from '@/config/firebase';

export class FirebaseStorageService {
    static async uploadImageToFirebase(uri: string, folder: string = 'recipes'): Promise<string> {
        try {
            const filename = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;

            const response = await fetch(uri);
            const blob = await response.blob();

            const storageRef = ref(firebaseStorage, filename);
            const snapshot = await uploadBytes(storageRef, blob);

            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL;
        } catch (error) {
            console.error('Error uploading image to Firebase:', error);
            throw error;
        }
    }

    static async deleteImage(imageUrl: string): Promise<void> {
        try {
            const imageRef = ref(firebaseStorage, imageUrl);
            await deleteObject(imageRef);
        } catch (error) {
            console.error('Error deleting image from Firebase:', error);
            throw error;
        }
    }

    static async getFileSize(uri: string): Promise<number> {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            return blob.size;
        } catch (error) {
            console.error('Error getting file size:', error);
            return 0;
        }
    }

    static async validateImage(uri: string): Promise<{ isValid: boolean; error?: string }> {
        try {
            const size = await this.getFileSize(uri);
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (size > maxSize) {
                return {
                    isValid: false,
                    error: 'Ảnh quá lớn. Vui lòng chọn ảnh có dung lượng nhỏ hơn 5MB.',
                };
            }

            return { isValid: true };
        } catch (error) {
            return { isValid: false, error: 'Đã xảy ra lỗi khi xác thực ảnh.' };
        }
    }
}
