import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { environment } from './environment';

const firebaseConfig = environment.firebaseConfig;

firebase.initializeApp(firebaseConfig);
const firebaseStorage = getStorage();
export default firebase;
export { deleteObject, firebaseStorage, getDownloadURL, ref, uploadBytes };

