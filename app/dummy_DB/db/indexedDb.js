// import { v4 as uuidv4 } from "uuid";

// const DB_NAME = "textile_db_not_working";
// const DB_VERSION = 2;
// const STORES = { SETS: "sets", HISTORY: "pipe_history" };

// const openDB = () => {
//     return new Promise((resolve, reject) => {
//         const request = indexedDB.open(DB_NAME, DB_VERSION);
//         request.onupgradeneeded = (e) => {
//             const db = e.target.result;
//             if (!db.objectStoreNames.contains(STORES.SETS)) {
//                 db.createObjectStore(STORES.SETS, { keyPath: "_id" });
//             }
//             if (!db.objectStoreNames.contains(STORES.HISTORY)) {
//                 db.createObjectStore(STORES.HISTORY, { keyPath: "_id" });
//             }
//         };
//         request.onsuccess = () => resolve(request.result);
//         request.onerror = () => reject(request.error);
//     });
// };

// const saveSet = async (data) => {
//     const db = await openDB();
//     const tx = db.transaction(STORES.SETS, "readwrite");
//     const item = { _id: data._id || uuidv4(), ...data, updatedAt: new Date().toISOString() };
//     await tx.objectStore(STORES.SETS).put(item);
//     return item;
// };

// const saveHistory = async (data) => {
//     const db = await openDB();
//     const tx = db.transaction(STORES.HISTORY, "readwrite");
//     const item = { _id: uuidv4(), ...data, updatedAt: new Date().toISOString() };
//     await tx.objectStore(STORES.HISTORY).put(item);
//     return item;
// };

// const getAllFromStore = async (storeName) => {
//     const db = await openDB();
//     return new Promise((resolve, reject) => {
//         const tx = db.transaction(storeName, "readonly");
//         const req = tx.objectStore(storeName).getAll();
//         req.onsuccess = () => resolve(req.result || []);
//         req.onerror = () => reject(req.error);
//     });
// };

// const getAllSets = async () => {
//     const db = await openDB();
//     return new Promise((resolve, reject) => {
//         const tx = db.transaction(STORES.SETS, "readonly");
//         const store = tx.objectStore(STORES.SETS);
//         const req = store.getAll();
//         req.onsuccess = () => resolve(req.result || []);
//         req.onerror = () => reject(req.error);
//     });
// };

// export { STORES, openDB, saveSet, saveHistory, getAllFromStore, getAllSets };