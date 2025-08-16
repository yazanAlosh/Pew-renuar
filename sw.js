// Service Worker بسيط للأصول الأساسية (PWA)
const CACHE = "renuar-pwa-v1";
const ASSETS = ["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png"];

self.addEventListener("install", e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE && caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e=>{
  const req = e.request;
  if(req.method !== "GET") return;
  e.respondWith(
    caches.match(req).then(cached=>{
      const net = fetch(req).then(res=>{
        try{
          const url = new URL(req.url);
          if(url.origin === location.origin){
            const clone = res.clone();
            caches.open(CACHE).then(c=>c.put(req, clone));
          }
        }catch(_){}
        return res;
      }).catch(()=> cached || caches.match("./"));
      return cached || net;
    })
  );
});
