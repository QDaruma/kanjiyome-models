/* Chargement du dictionnaire : télécharge data/jmdict-web-<v>.db.gz UNE fois
   (progression), décompresse (DecompressionStream), met en cache IndexedDB
   décompressé (2e visite : ouverture directe). */
const KY_DB_VERSION = 'v16';
const KY_DB_URL = 'data/jmdict-web-' + KY_DB_VERSION + '.db.gz';

function kyIdb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('kanjiyome', 1);
    req.onupgradeneeded = () => req.result.createObjectStore('dict');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function kyIdbGet(db, key) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('dict').objectStore('dict').get(key);
    tx.onsuccess = () => resolve(tx.result);
    tx.onerror = () => reject(tx.error);
  });
}

function kyIdbSet(db, key, value) {
  return new Promise((resolve, reject) => {
    const store = db.transaction('dict', 'readwrite').objectStore('dict');
    store.clear(); // une seule version en cache
    const tx = store.put(value, key);
    tx.onsuccess = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function kyGunzip(gzBytes) {
  const ds = new DecompressionStream('gzip');
  const stream = new Blob([gzBytes]).stream().pipeThrough(ds);
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/* onProgress(fraction|null) : null = indéterminé. Renvoie Uint8Array (db). */
async function kyLoadDictionary(onProgress, baseUrl) {
  const url = (baseUrl || '') + KY_DB_URL;
  let idb = null;
  try {
    idb = await kyIdb();
    const cached = await kyIdbGet(idb, KY_DB_VERSION);
    if (cached && cached.byteLength > 1 << 20) return new Uint8Array(cached);
  } catch (e) { /* IndexedDB indisponible (navigation privée) : on télécharge. */ }

  const resp = await fetch(url);
  if (!resp.ok) throw new Error('HTTP ' + resp.status);
  const total = Number(resp.headers.get('Content-Length')) || 0;
  const reader = resp.body.getReader();
  const chunks = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.byteLength;
    onProgress(total ? Math.min(received / total, 1) : null);
  }
  const gz = new Uint8Array(received);
  let off = 0;
  for (const c of chunks) { gz.set(c, off); off += c.byteLength; }
  const raw = await kyGunzip(gz);
  if (idb) {
    try { await kyIdbSet(idb, KY_DB_VERSION, raw.buffer); } catch (e) { /* cache best-effort */ }
  }
  return raw;
}
