const CACHE='lmt-v2';
const ASSETS=['/'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ASSETS);}));
  self.skipWaiting();
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }));
  self.clients.claim();
});
self.addEventListener('fetch',function(e){
  e.respondWith(
    caches.match(e.request).then(function(cached){
      if(cached)return cached;
      return fetch(e.request).then(function(resp){
        if(e.request.url.startsWith('http')){
          var clone=resp.clone();
          caches.open(CACHE).then(function(c){c.put(e.request,clone);});
        }
        return resp;
      }).catch(function(){return cached;});
    })
  );
});
