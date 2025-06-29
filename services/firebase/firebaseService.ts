import { deleteObject, firebaseStorage, getDownloadURL, ref, uploadBytes } from '@/config/firebase';
import { v4 as uuidv4 } from 'uuid';

export class FirebaseStorageService {
    static async uploadImageToFirebase(file: File) {
        try {
            const filename = `recipes/${uuidv4()}_${file.name}`;
            const storageRef = ref(firebaseStorage, filename);

            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL;
        } catch (error) {
            console.error('Error uploading image to Firebase:', error);
            throw error;
        }
    }

    static async deleteImageFromFirebase(imageUrl: string) {
        try {
            if (!imageUrl || !imageUrl.includes('firebasestorage.googleapis.com')) {
                console.warn('Invalid image URL:', imageUrl);
                return;
            }

            const url = new URL(imageUrl);
            const pathMatch = url.pathname.match(/\/o\/(.+)\?/);

            if (!pathMatch) {
                console.error('Could not extract from URL: ', imageUrl);
                return;
            }

            const filePath = decodeURIComponent(pathMatch[1]);

            const storageRef = ref(firebaseStorage, filePath);
            await deleteObject(storageRef);
            console.log('Deleted image from Firebase');
        } catch (error) {
            console.error('Error deleting image from Firebase:', error);
            throw error;
        }
    }

    static async uploadImageToFirebaseWithPath(file: File) {
        try {
            const filename = `recipes/${uuidv4()}_${file.name}`;
            const storageRef = ref(firebaseStorage, filename);

            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            return {
                url: downloadURL,
                path: filename, // Trả về path để dễ dàng xóa sau này
            };
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }

    static async deleteImageByPath(path: string) {
        try {
            if (!path) return;

            const storageRef = ref(firebaseStorage, path);
            await deleteObject(storageRef);

            console.log('Successfully deleted image at path:', path);
        } catch (error) {
            console.error('Error deleting image:', error);
            throw error;
        }
    }
}
