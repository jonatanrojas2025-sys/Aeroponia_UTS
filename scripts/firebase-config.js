// ============================================================
// FIREBASE CONFIGURATION
// ============================================================

import { initializeApp } from "firebase/app";
import { 
    getDatabase, 
    ref, 
    query, 
    orderByKey, 
    limitToLast,
    onValue,
    set
} from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDuMehgD-CrrSLW6SIz4OMg7LzDGbY9NTw",
    authDomain: "aeroponia-uts.firebaseapp.com",
    databaseURL: "https://aeroponia-uts-default-rtdb.firebaseio.com",
    projectId: "aeroponia-uts",
    storageBucket: "aeroponia-uts.firebasestorage.app",
    messagingSenderId: "553659066320",
    appId: "1:553659066320:web:2fe4b64c723727c8b67bd5"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const valorActualRef = ref(db, "Aeroponia-UTS/Valor_Actual");
const historialRef = query(
    ref(db, "Aeroponia-UTS/Historial"),
    orderByKey(),
    limitToLast(100)
);
const etapaConfigRef = ref(db, "Aeroponia-UTS/Config/etapa");

export {
    db,
    valorActualRef,
    historialRef,
    etapaConfigRef,
    set,
    onValue
};