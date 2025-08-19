const CACHE = 'health-tracker-v1';
const ASSETS = ['./','./index.html','./manifest.webmanifest'];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});

self.addEventListener('activate', e=>{
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(res =>
      res || fetch(e.request).then(r=>{
        if(e.request.method==='GET' && r.status===200){
          const copy = r.clone();
          caches.open(CACHE).then(c=> c.put(e.request, copy));
        }
        return r;
      }).catch(()=>res)
    )
  );
});
