/**
 * IndexedDB Media Storage Service for Chhaya Mobiles
 * Handles large video files and high-res images exceeding localStorage quotas.
 */

const DB_NAME = 'chhaya_media_db_v1';
const DB_VERSION = 1;
const STORE_NAME = 'media_blobs';

let dbInstance = null;

function openDB() {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve) => {
    try {
      if (typeof window === 'undefined' || !window.indexedDB) {
        console.warn('IndexedDB not available in current window environment.');
        return resolve(null);
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        try {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          }
        } catch(err) {
          console.warn('onupgradeneeded error:', err);
        }
      };

      request.onsuccess = (e) => {
        dbInstance = e.target.result;
        resolve(dbInstance);
      };

      request.onerror = (e) => {
        console.warn('Failed to open IndexedDB media database:', e);
        resolve(null);
      };
    } catch(err) {
      console.warn('IndexedDB open error:', err);
      resolve(null);
    }
  });
}

export const MediaDB = {
  /**
   * Save a File or Blob into IndexedDB
   * @param {string} id - e.g. 'hero_video' or 'owner_avatar'
   * @param {Blob|File} blob - The file object
   * @param {Object} metadata - Optional extra fields (e.g. fileName, fileSize)
   */
  async saveFile(id, blob, metadata = {}) {
    const db = await openDB();
    if (!db) return null;
    return new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const record = {
          id,
          blob,
          fileName: metadata.fileName || (blob instanceof File ? blob.name : id),
          fileType: metadata.fileType || blob.type || 'application/octet-stream',
          fileSize: metadata.fileSize || blob.size || 0,
          updatedAt: Date.now()
        };
        const req = store.put(record);
        req.onsuccess = () => resolve(record);
        req.onerror = (e) => reject(e);
      } catch (err) {
        console.warn('saveFile error:', err);
        resolve(null);
      }
    });
  },

  /**
   * Retrieve a record from IndexedDB
   * @param {string} id
   */
  async getFile(id) {
    const db = await openDB();
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch (err) {
        console.warn('getFile error:', err);
        resolve(null);
      }
    });
  },

  /**
   * Get an active Object URL for a stored Blob
   * @param {string} id
   */
  async getObjectURL(id) {
    try {
      const record = await this.getFile(id);
      if (!record || !record.blob) return null;
      return URL.createObjectURL(record.blob);
    } catch (err) {
      console.warn('getObjectURL error:', err);
      return null;
    }
  },

  /**
   * Delete a record from IndexedDB
   * @param {string} id
   */
  async deleteFile(id) {
    const db = await openDB();
    if (!db) return true;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch (err) {
        console.warn('deleteFile error:', err);
        resolve(false);
      }
    });
  },

  /**
   * Helper to compress/read image file as Base64 Data URL
   * @param {File} file
   * @param {number} maxWidth
   * @param {number} quality
   */
  fileToDataURL(file, maxWidth = 1200, quality = 0.85) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(e.target.result); // Fallback to raw data url
        img.src = e.target.result;
      };
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }
};
