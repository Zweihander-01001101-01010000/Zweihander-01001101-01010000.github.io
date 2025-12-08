// ==================== CONFIGURACIÓN ====================
const CACHE_NAME = 'hawkeye-v2.0';
const API_CACHE_NAME = 'hawkeye-api-cache';

// URLs para cachear (archivos estáticos)
const STATIC_URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/map.html',
  '/manifest.json',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-regular-400.woff2',
  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
];

// Dominios de API que vamos a cachear (solo respuestas GET)
const API_DOMAINS_TO_CACHE = [
  'hawkeye-api.onrender.com',
  'localhost:5000',
  '127.0.0.1:5000'
];

// ==================== INSTALACIÓN ====================
self.addEventListener('install', event => {
  console.log('🦅 Service Worker: Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Cache abierto, agregando archivos estáticos...');
        return cache.addAll(STATIC_URLS_TO_CACHE);
      })
      .then(() => {
        console.log('✅ Service Worker instalado correctamente');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Error durante la instalación:', error);
      })
  );
});

// ==================== ESTRATEGIA DE CACHÉ ====================
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Evitar cachear solicitudes POST, PUT, DELETE
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Para solicitudes de API, usar estrategia "Network First, Cache Fallback"
  if (isApiRequest(url)) {
    event.respondWith(
      handleApiRequest(event.request)
    );
  } 
  // Para archivos estáticos, usar estrategia "Cache First, Network Fallback"
  else {
    event.respondWith(
      handleStaticRequest(event.request)
    );
  }
});

// Verifica si es una solicitud a la API
function isApiRequest(url) {
  return API_DOMAINS_TO_CACHE.some(domain => url.hostname.includes(domain));
}

// Maneja solicitudes de API
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);
  const url = new URL(request.url);
  
  try {
    // Intenta obtener la respuesta desde la red primero
    const networkResponse = await fetch(request);
    
    // Si la respuesta es exitosa, actualiza la caché
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      cache.put(request, responseClone);
      
      // Para ubicaciones, establecer un tiempo de expiración
      if (url.pathname.includes('/location/')) {
        setTimeout(async () => {
          await cache.delete(request);
        }, 10000); // Expirar ubicaciones después de 10 segundos
      }
      
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
    
  } catch (networkError) {
    console.log('🌐 Red no disponible, usando caché para API:', request.url);
    
    // Busca en la caché
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('✅ Respuesta obtenida de caché API');
      return cachedResponse;
    }
    
    // Si no hay nada en caché, retorna una respuesta de fallback
    return new Response(
      JSON.stringify({ 
        error: 'Sin conexión a la API', 
        message: 'Los datos están almacenados localmente',
        offline: true 
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Maneja solicitudes de archivos estáticos
async function handleStaticRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  
  // Primero busca en caché
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Verifica si la respuesta en caché no está expirada
    if (isCacheFresh(cachedResponse)) {
      console.log('📁 Archivo estático desde caché:', request.url);
      return cachedResponse;
    }
  }
  
  try {
    // Si no está en caché o está expirado, busca en la red
    const networkResponse = await fetch(request);
    
    // Si la respuesta es exitosa, actualiza la caché
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      cache.put(request, responseClone);
    }
    
    return networkResponse;
    
  } catch (networkError) {
    console.log('🌐 Red no disponible para archivo estático:', request.url);
    
    // Si no hay red y no hay en caché, retorna una página de error
    if (request.mode === 'navigate') {
      return cache.match('/index.html');
    }
    
    return cachedResponse || networkError;
  }
}

// Verifica si el caché está "fresco" (menos de 24 horas)
function isCacheFresh(cachedResponse) {
  const cachedDate = new Date(cachedResponse.headers.get('date'));
  const now = new Date();
  const hoursDiff = (now - cachedDate) / (1000 * 60 * 60);
  
  // Considerar fresco si tiene menos de 24 horas
  return hoursDiff < 24;
}

// ==================== ACTIVACIÓN ====================
self.addEventListener('activate', event => {
  console.log('🦅 Service Worker: Activando...');
  
  event.waitUntil(
    Promise.all([
      // Limpiar caches antiguos
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
              console.log('🧹 Eliminando cache antiguo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Tomar control de todos los clients inmediatamente
      self.clients.claim()
    ])
    .then(() => {
      console.log('✅ Service Worker activado y listo');
      
      // Enviar mensaje a todos los clients
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_ACTIVATED',
            version: '2.0',
            timestamp: new Date().toISOString()
          });
        });
      });
    })
  );
});

// ==================== SINCRONIZACIÓN EN SEGUNDO PLANO ====================
self.addEventListener('sync', event => {
  console.log('🔄 Evento de sincronización:', event.tag);
  
  if (event.tag === 'sync-locations') {
    event.waitUntil(syncPendingLocations());
  }
});

// Función para sincronizar ubicaciones pendientes
async function syncPendingLocations() {
  try {
    // Aquí podrías implementar la lógica para sincronizar
    // ubicaciones pendientes cuando se recupera la conexión
    console.log('🔄 Sincronizando ubicaciones pendientes...');
    
    // Ejemplo: recuperar ubicaciones de IndexedDB y enviarlas
    // const pendingLocations = await getPendingLocationsFromIDB();
    // await sendLocationsToAPI(pendingLocations);
    
    return Promise.resolve();
  } catch (error) {
    console.error('❌ Error en sincronización:', error);
    return Promise.reject(error);
  }
}

// ==================== MENSAJES ====================
self.addEventListener('message', event => {
  console.log('📨 Mensaje recibido en Service Worker:', event.data);
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME);
    caches.delete(API_CACHE_NAME);
    event.ports[0].postMessage({ success: true });
  }
  
  if (event.data && event.data.type === 'GET_CACHE_INFO') {
    caches.keys().then(cacheNames => {
      event.ports[0].postMessage({ 
        caches: cacheNames,
        version: '2.0'
      });
    });
  }
});

// ==================== PUSH NOTIFICATIONS ====================
self.addEventListener('push', event => {
  console.log('🔔 Evento push recibido:', event);
  
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Nueva actualización de ubicación',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/',
        deviceId: data.deviceId
      },
      actions: [
        {
          action: 'view',
          title: 'Ver en mapa'
        },
        {
          action: 'close',
          title: 'Cerrar'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || '🦅 HawkEye', options)
    );
  }
});

self.addEventListener('notificationclick', event => {
  console.log('🖱️ Notificación clickeada:', event);
  
  event.notification.close();
  
  if (event.action === 'view') {
    const url = event.notification.data.url || '/map.html';
    event.waitUntil(
      clients.openWindow(url)
    );
  }
});

// ==================== MANEJO OFFLINE ====================
// Intercepta solicitudes de navegación y sirve página offline si es necesario
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/index.html');
        })
    );
    return;
  }
});

// ==================== FUNCIONES UTILITARIAS ====================

// Función para guardar datos en caché manualmente
async function cacheData(request, response) {
  const cache = await caches.open(API_CACHE_NAME);
  await cache.put(request, response);
}

// Función para obtener datos de caché
async function getCachedData(request) {
  const cache = await caches.open(API_CACHE_NAME);
  return await cache.match(request);
}

// Función para limpiar caché específico
async function clearSpecificCache(cacheName) {
  return await caches.delete(cacheName);
}

// Registro en consola para debugging
console.log('🦅 HawkEye Service Worker v2.0 cargado');
console.log('📍 Dominios de API a cachear:', API_DOMAINS_TO_CACHE);