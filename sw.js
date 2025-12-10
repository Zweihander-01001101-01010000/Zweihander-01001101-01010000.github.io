<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HawkEye - Rastreador de Dispositivos</title>
    <link rel="manifest" href="manifest.json">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #f1f5f9;
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        
        header {
            text-align: center;
            margin-bottom: 40px;
            padding: 20px;
        }
        
        .logo {
            font-size: 2.5rem;
            color: #3b82f6;
            margin-bottom: 10px;
        }
        
        h1 {
            font-size: 2rem;
            margin-bottom: 10px;
            color: #e2e8f0;
        }
        
        .subtitle {
            color: #94a3b8;
            font-size: 1.1rem;
            margin-bottom: 30px;
        }
        
        .status-bar {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 25px;
            border: 1px solid rgba(59, 130, 246, 0.3);
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
        }
        
        .status-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
            min-width: 120px;
        }
        
        .status-value {
            font-size: 1.4rem;
            font-weight: 700;
            color: #3b82f6;
            margin-bottom: 5px;
        }
        
        .status-label {
            font-size: 0.8rem;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .status-connected {
            color: #10b981;
        }
        
        .status-disconnected {
            color: #ef4444;
        }
        
        .device-list {
            display: grid;
            gap: 15px;
            margin-bottom: 30px;
        }
        
        .device-card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 20px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s ease;
        }
        
        .device-card:hover {
            transform: translateY(-2px);
            border-color: rgba(59, 130, 246, 0.5);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }
        
        .device-info h3 {
            font-size: 1.2rem;
            margin-bottom: 5px;
            color: #e2e8f0;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .device-id {
            font-size: 0.85rem;
            color: #94a3b8;
            font-family: monospace;
            background: rgba(0, 0, 0, 0.2);
            padding: 3px 8px;
            border-radius: 4px;
            margin-top: 5px;
            display: inline-block;
        }
        
        .device-status {
            font-size: 0.75rem;
            padding: 3px 8px;
            border-radius: 12px;
            margin-left: 10px;
        }
        
        .status-online {
            background: rgba(16, 185, 129, 0.2);
            color: #10b981;
        }
        
        .status-offline {
            background: rgba(239, 68, 68, 0.2);
            color: #ef4444;
        }
        
        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 0.9rem;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
        }
        
        .btn-primary:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
        }
        
        .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.15);
        }
        
        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.15);
        }
        
        .btn-success {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
        }
        
        .btn-danger {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
        }
        
        .btn-warning {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
        }
        
        .actions {
            display: flex;
            gap: 10px;
        }
        
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #94a3b8;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 12px;
            border: 2px dashed rgba(255, 255, 255, 0.1);
        }
        
        .empty-state i {
            font-size: 3.5rem;
            margin-bottom: 20px;
            color: #475569;
        }
        
        .empty-state h3 {
            font-size: 1.4rem;
            margin-bottom: 10px;
            color: #e2e8f0;
        }
        
        .empty-state p {
            font-size: 1rem;
            max-width: 400px;
            margin: 0 auto 25px;
            line-height: 1.6;
        }
        
        .main-actions {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 30px;
            flex-wrap: wrap;
        }
        
        .instructions {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 12px;
            padding: 20px;
            margin-top: 30px;
            border-left: 4px solid #3b82f6;
        }
        
        .instructions h4 {
            color: #e2e8f0;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .instructions ol {
            margin-left: 20px;
            line-height: 1.8;
            color: #cbd5e1;
        }
        
        .instructions li {
            margin-bottom: 8px;
        }
        
        .instructions code {
            background: rgba(0, 0, 0, 0.3);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
            color: #fbbf24;
        }
        
        footer {
            text-align: center;
            margin-top: 50px;
            color: #64748b;
            font-size: 0.9rem;
            padding: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .api-status {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 0.8rem;
            margin-top: 10px;
        }
        
        .api-connected {
            background: rgba(16, 185, 129, 0.2);
            color: #10b981;
            border: 1px solid rgba(16, 185, 129, 0.3);
        }
        
        .api-disconnected {
            background: rgba(239, 68, 68, 0.2);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 350px;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .notification-success {
            border-left: 4px solid #10b981;
        }
        
        .notification-error {
            border-left: 4px solid #ef4444;
        }
        
        .notification-info {
            border-left: 4px solid #3b82f6;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            font-size: 1.2rem;
            padding: 0;
            margin-left: auto;
        }
        
        @media (max-width: 600px) {
            .device-card {
                flex-direction: column;
                gap: 15px;
                text-align: center;
            }
            
            .device-info h3 {
                justify-content: center;
            }
            
            .actions {
                width: 100%;
                justify-content: center;
            }
            
            .btn {
                flex: 1;
                justify-content: center;
                min-width: 120px;
            }
            
            .status-bar {
                flex-direction: column;
                text-align: center;
            }
            
            .status-item {
                min-width: 100%;
            }
            
            .notification {
                left: 20px;
                right: 20px;
                max-width: none;
            }
        }
        
        .loading {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(15, 23, 42, 0.9);
            z-index: 1000;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }
        
        .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(59, 130, 246, 0.3);
            border-radius: 50%;
            border-top-color: #3b82f6;
            animation: spin 1s linear infinite;
            margin-bottom: 15px;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .auto-refresh-indicator {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            font-size: 0.8rem;
            color: #94a3b8;
            margin-left: 10px;
        }
        
        .blink {
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .device-actions {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
    </style>
</head>
<body>
    <div class="loading" id="loadingScreen">
        <div class="spinner"></div>
        <p id="loadingText">Cargando dispositivos...</p>
    </div>
    
    <div id="notificationContainer"></div>
    
    <div class="container">
        <header>
            <div class="logo">
                <i class="fas fa-map-marker-alt"></i>
            </div>
            <h1>HawkEye</h1>
            <p class="subtitle">Rastreador de dispositivos en tiempo real</p>
            
            <div class="api-status" id="apiStatus">
                <i class="fas fa-circle"></i>
                <span>Conectando a API...</span>
            </div>
        </header>
        
        <div class="status-bar">
            <div class="status-item">
                <div class="status-value" id="totalDevices">0</div>
                <div class="status-label">Dispositivos</div>
            </div>
            <div class="status-item">
                <div class="status-value status-connected" id="onlineDevices">0</div>
                <div class="status-label">En Línea</div>
            </div>
            <div class="status-item">
                <div class="status-value" id="lastUpdate">--:--</div>
                <div class="status-label">Última Actualización</div>
            </div>
            <div class="status-item">
                <div class="status-value" id="apiUrl">API</div>
                <div class="status-label">Servidor</div>
            </div>
        </div>
        
        <main>
            <div id="device-list" class="device-list">
                <!-- Los dispositivos se cargarán aquí -->
                <div class="empty-state" id="emptyState">
                    <i class="fas fa-map-marked-alt"></i>
                    <h3>No hay dispositivos registrados</h3>
                    <p>Agrega tu primer dispositivo para comenzar a rastrear en tiempo real</p>
                    <button class="btn btn-primary" onclick="addDevice()">
                        <i class="fas fa-plus"></i> Agregar Primer Dispositivo
                    </button>
                </div>
            </div>
            
            <div class="main-actions">
                <button class="btn btn-primary" onclick="addDevice()">
                    <i class="fas fa-plus"></i> Agregar Dispositivo
                </button>
                <button class="btn btn-success" onclick="addAndroidDevice()">
                    <i class="fas fa-mobile-alt"></i> Agregar Android
                </button>
                <button class="btn btn-warning" onclick="forceRefresh()" id="refreshBtn">
                    <i class="fas fa-redo"></i> <span>Actualizar Ahora</span>
                    <span class="auto-refresh-indicator" id="autoRefreshIndicator">
                        <i class="fas fa-sync blink"></i> Auto
                    </span>
                </button>
                <button class="btn btn-secondary" onclick="openSettings()">
                    <i class="fas fa-cog"></i> Configuración
                </button>
            </div>
            
            <div class="instructions">
                <h4><i class="fas fa-info-circle"></i> Cómo conectar tu dispositivo Android</h4>
                <ol>
                    <li>Descarga la app <strong>HawkEye</strong> en tu teléfono Android</li>
                    <li>Abre la app y anota tu <strong>ID de Dispositivo</strong></li>
                    <li>En esta página, haz clic en <strong>"Agregar Android"</strong></li>
                    <li>Ingresa el ID de tu dispositivo Android</li>
                    <li>¡Listo! Tu ubicación aparecerá en el mapa en tiempo real</li>
                </ol>
                <p style="margin-top: 10px; font-size: 0.9rem; color: #94a3b8;">
                    <i class="fas fa-link"></i> URL de tu API: <code id="currentApiUrl">https://hawkeye-api-nreo.onrender.com</code>
                </p>
                <p style="margin-top: 5px; font-size: 0.8rem; color: #64748b;">
                    <i class="fas fa-sync-alt"></i> Actualización automática cada 10 segundos
                </p>
            </div>
        </main>
        
        <footer>
            <p>HawkEye v2.1 • Sistema de rastreo en tiempo real</p>
            <p>Frontend: GitHub Pages | Backend: API Flask | App: Android Kotlin</p>
            <p id="connectionInfo">Estado de conexión: Verificando...</p>
        </footer>
    </div>

    <script>
        // ==================== CONFIGURACIÓN ====================
        const API_BASE = "https://hawkeye-api-nreo.onrender.com";
        const GITHUB_PAGES_URL = "https://zwihander-01001101-01010000.github.io";
        
        // Estado de la aplicación
        let devices = [];
        let apiStatus = 'checking';
        let lastUpdateTime = null;
        let autoRefreshInterval = null;
        let isAutoRefreshEnabled = true;
        let eventSources = {};
        
        // ==================== FUNCIONES DE NOTIFICACIÓN ====================
        
        function showNotification(message, type = 'info', duration = 5000) {
            const container = document.getElementById('notificationContainer');
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            
            let icon = 'fas fa-info-circle';
            if (type === 'success') icon = 'fas fa-check-circle';
            if (type === 'error') icon = 'fas fa-exclamation-circle';
            
            notification.innerHTML = `
                <i class="${icon}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            container.appendChild(notification);
            
            if (duration > 0) {
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, duration);
            }
            
            return notification;
        }
        
        // ==================== FUNCIONES DE CONEXIÓN API ====================
        
        async function checkApiConnection() {
            try {
                showLoading('Conectando a la API...');
                const response = await fetch(`${API_BASE}/`, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                    cache: 'no-cache'
                });
                
                if (response.ok) {
                    const data = await response.json();
                    apiStatus = 'connected';
                    updateApiStatusDisplay();
                    console.log("✅ API conectada:", data);
                    showNotification('API conectada exitosamente', 'success', 3000);
                    return true;
                } else {
                    throw new Error(`API responded with ${response.status}`);
                }
            } catch (error) {
                apiStatus = 'disconnected';
                updateApiStatusDisplay();
                console.error("❌ Error conectando a API:", error.message);
                showNotification('No se pudo conectar a la API. Modo offline activado.', 'error', 5000);
                return false;
            } finally {
                hideLoading();
            }
        }
        
        // ==================== FUNCIONES DE GESTIÓN DE DISPOSITIVOS ====================
        
        async function loadDevices() {
            showLoading('Cargando dispositivos...');
            
            try {
                // Cargar desde localStorage primero
                const localDevices = JSON.parse(localStorage.getItem("devices") || "[]");
                
                // Si API está conectada, cargar y actualizar
                if (apiStatus === 'connected') {
                    try {
                        // 1. Obtener dispositivos de la API
                        const apiResponse = await fetch(`${API_BASE}/api/devices`, {
                            method: 'GET',
                            headers: { 'Accept': 'application/json' }
                        });
                        
                        if (apiResponse.ok) {
                            const apiDevices = await apiResponse.json();
                            
                            // 2. Verificar estado de cada dispositivo
                            const devicesWithStatus = await Promise.all(
                                apiDevices.map(async (device) => {
                                    try {
                                        const statusResponse = await fetch(
                                            `${API_BASE}/api/device/status/${device.id}`,
                                            { 
                                                method: 'GET',
                                                headers: { 'Accept': 'application/json' },
                                                signal: AbortSignal.timeout(5000)
                                            }
                                        );
                                        
                                        let isOnline = false;
                                        let lastSeen = device.created_at || new Date().toISOString();
                                        
                                        if (statusResponse && statusResponse.ok) {
                                            const statusData = await statusResponse.json();
                                            isOnline = statusData.is_online || false;
                                            lastSeen = statusData.last_seen || lastSeen;
                                        }
                                        
                                        return {
                                            id: device.id,
                                            name: device.name,
                                            source: 'api',
                                            isOnline: isOnline,
                                            lastSeen: lastSeen,
                                            timestamp: device.created_at || new Date().toISOString()
                                        };
                                    } catch (statusError) {
                                        console.warn(`⚠️ Error verificando estado de ${device.id}:`, statusError.message);
                                        return {
                                            id: device.id,
                                            name: device.name,
                                            source: 'api',
                                            isOnline: false,
                                            lastSeen: device.created_at || new Date().toISOString(),
                                            timestamp: device.created_at || new Date().toISOString()
                                        };
                                    }
                                })
                            );
                            
                            // Filtrar dispositivos nulos
                            const validDevices = devicesWithStatus.filter(d => d !== null);
                            
                            // Combinar con dispositivos locales
                            const localDeviceIds = localDevices.map(d => d.id);
                            const apiDeviceIds = validDevices.map(d => d.id);
                            
                            // Mantener dispositivos locales que no están en API
                            localDevices.forEach(localDevice => {
                                if (!apiDeviceIds.includes(localDevice.id)) {
                                    validDevices.push({
                                        ...localDevice,
                                        source: 'local'
                                    });
                                }
                            });
                            
                            devices = validDevices;
                            
                            // Iniciar suscripciones a eventos
                            validDevices.forEach(device => {
                                if (!eventSources[device.id]) {
                                    subscribeToDeviceEvents(device.id);
                                }
                            });
                            
                        } else {
                            throw new Error('API response not ok');
                        }
                    } catch (apiError) {
                        console.warn("⚠️ Error cargando de API, usando solo locales:", apiError.message);
                        devices = localDevices;
                    }
                } else {
                    devices = localDevices;
                }
                
                // Guardar dispositivos actualizados en localStorage
                localStorage.setItem("devices", JSON.stringify(devices));
                
                renderDevices();
                updateStats();
                lastUpdateTime = new Date();
                updateLastUpdateDisplay();
                
                showNotification(`${devices.length} dispositivos cargados`, 'success', 2000);
                
            } catch (error) {
                console.error("❌ Error cargando dispositivos:", error);
                showNotification('Error cargando dispositivos', 'error', 3000);
            } finally {
                hideLoading();
            }
        }
        
        // Función para verificar estado de un dispositivo específico
        async function checkDeviceStatus(deviceId) {
            try {
                const response = await fetch(`${API_BASE}/api/device/status/${deviceId}`, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                    signal: AbortSignal.timeout(3000)
                });
                
                if (response.ok) {
                    const data = await response.json();
                    return {
                        isOnline: data.is_online || false,
                        lastSeen: data.last_seen || null
                    };
                }
                return { isOnline: false, lastSeen: null };
            } catch (error) {
                console.warn(`⚠️ Error verificando estado de ${deviceId}:`, error.message);
                return { isOnline: false, lastSeen: null };
            }
        }
        
        // Función para actualizar estado de todos los dispositivos
        async function updateAllDevicesStatus() {
            if (devices.length === 0 || apiStatus !== 'connected') return;
            
            let changed = false;
            
            for (let i = 0; i < devices.length; i++) {
                const device = devices[i];
                const newStatus = await checkDeviceStatus(device.id);
                
                if (device.isOnline !== newStatus.isOnline) {
                    devices[i].isOnline = newStatus.isOnline;
                    devices[i].lastSeen = newStatus.isOnline ? (newStatus.lastSeen || new Date().toISOString()) : device.lastSeen;
                    changed = true;
                    
                    // Mostrar notificación si dispositivo cambió a online
                    if (newStatus.isOnline) {
                        showNotification(`${device.name} está en línea`, 'success', 3000);
                    }
                } else if (newStatus.isOnline && newStatus.lastSeen) {
                    // Actualizar lastSeen si está online
                    devices[i].lastSeen = newStatus.lastSeen;
                    changed = true;
                }
            }
            
            if (changed) {
                localStorage.setItem("devices", JSON.stringify(devices));
                renderDevices();
                updateStats();
                lastUpdateTime = new Date();
                updateLastUpdateDisplay();
            }
        }
        
        // ==================== FUNCIONES DE RENDERIZADO ====================
        
        function renderDevices() {
            const container = document.getElementById("device-list");
            const emptyState = document.getElementById("emptyState");
            
            if (devices.length === 0) {
                emptyState.style.display = "block";
                container.innerHTML = "";
                return;
            }
            
            emptyState.style.display = "none";
            container.innerHTML = "";
            
            // Ordenar dispositivos: primero los online, luego por nombre
            const sortedDevices = [...devices].sort((a, b) => {
                if (a.isOnline && !b.isOnline) return -1;
                if (!a.isOnline && b.isOnline) return 1;
                return a.name.localeCompare(b.name);
            });
            
            sortedDevices.forEach((device, index) => {
                const isOnline = device.isOnline || false;
                const source = device.source || 'local';
                const lastSeen = device.lastSeen || device.timestamp || null;
                
                const card = document.createElement("div");
                card.className = "device-card";
                card.id = `device-${device.id}`;
                card.innerHTML = `
                    <div class="device-info">
                        <h3>
                            ${device.name}
                            <span class="device-status ${isOnline ? 'status-online' : 'status-offline'}">
                                ${isOnline ? '🟢 En línea' : '🔴 Sin conexión'}
                            </span>
                            ${source === 'api' ? '<i class="fas fa-cloud" title="Sincronizado con API"></i>' : 
                              source === 'android' ? '<i class="fas fa-mobile-alt" title="Dispositivo Android"></i>' :
                              '<i class="fas fa-laptop" title="Dispositivo local"></i>'}
                        </h3>
                        <div class="device-id">ID: ${device.id}</div>
                        ${lastSeen ? `<div style="font-size: 0.75rem; color: ${isOnline ? '#10b981' : '#64748b'}; margin-top: 5px;">
                            <i class="far fa-clock"></i> Última vez: ${formatTimeAgo(lastSeen)}
                        </div>` : ''}
                    </div>
                    <div class="device-actions">
                        <div class="actions">
                            <button class="btn btn-secondary" onclick="viewDevice('${device.id}')" title="Ver en mapa">
                                <i class="fas fa-map"></i> Mapa
                            </button>
                            <button class="btn btn-secondary" onclick="copyDeviceId('${device.id}')" title="Copiar ID">
                                <i class="fas fa-copy"></i> Copiar
                            </button>
                        </div>
                        <div class="actions">
                            <button class="btn btn-secondary" onclick="refreshDeviceStatus('${device.id}')" title="Actualizar estado">
                                <i class="fas fa-sync-alt"></i> Estado
                            </button>
                            <button class="btn btn-danger" onclick="removeDevice('${device.id}')" title="Eliminar dispositivo">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        }
        
        // ==================== FUNCIONES DE GESTIÓN ====================
        
        function addDevice() {
            const name = prompt("Nombre del dispositivo (ej: Mi Teléfono, Mi Auto):", "");
            if (!name) return;
            
            const id = prompt("ID del dispositivo (deja vacío para generar automático):", "");
            const deviceId = id || crypto.randomUUID();
            
            const newDevice = {
                id: deviceId,
                name: name,
                source: 'local',
                isOnline: false,
                timestamp: new Date().toISOString(),
                lastSeen: null
            };
            
            devices.push(newDevice);
            localStorage.setItem("devices", JSON.stringify(devices));
            
            // Actualizar UI inmediatamente
            renderDevices();
            updateStats();
            
            // Intentar registrar en la API (en segundo plano)
            if (apiStatus === 'connected') {
                registerDeviceInApi(deviceId, name).then(() => {
                    showNotification(`Dispositivo ${name} registrado en la API`, 'success', 3000);
                    // Actualizar estado después de 2 segundos
                    setTimeout(() => refreshDeviceStatus(deviceId), 2000);
                }).catch(error => {
                    console.warn("No se pudo registrar en API:", error);
                });
            }
            
            showNotification(`Dispositivo ${name} agregado`, 'success', 3000);
        }
        
        function addAndroidDevice() {
            const name = prompt("Nombre del dispositivo Android:", `Android ${navigator.userAgent.match(/Android[\w\s\.]+/)?.[0] || 'Device'}`);
            if (!name) return;
            
            const id = prompt("ID del dispositivo Android (obtenlo desde la app):", "");
            if (!id) {
                showNotification('Debes ingresar el ID del dispositivo Android', 'error', 3000);
                return;
            }
            
            const newDevice = {
                id: id,
                name: name,
                source: 'android',
                isOnline: false,
                timestamp: new Date().toISOString(),
                lastSeen: null
            };
            
            devices.push(newDevice);
            localStorage.setItem("devices", JSON.stringify(devices));
            
            // Actualizar UI inmediatamente
            renderDevices();
            updateStats();
            
            // Intentar registrar en la API
            if (apiStatus === 'connected') {
                registerDeviceInApi(id, name).then(() => {
                    showNotification(`Dispositivo Android ${name} registrado`, 'success', 3000);
                    setTimeout(() => refreshDeviceStatus(id), 2000);
                });
            }
            
            const mapUrl = `${GITHUB_PAGES_URL}/map.html?id=${id}&name=${encodeURIComponent(name)}`;
            showNotification(`Android agregado. <a href="${mapUrl}" style="color: #3b82f6;">Ver en mapa</a>`, 'success', 5000);
        }
        
        async function registerDeviceInApi(deviceId, deviceName) {
            try {
                const response = await fetch(`${API_BASE}/api/device/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        id: deviceId,
                        name: deviceName
                    })
                });
                
                if (response.ok) {
                    console.log(`✅ Dispositivo registrado en API: ${deviceId}`);
                    return true;
                } else {
                    throw new Error(`API responded with ${response.status}`);
                }
            } catch (error) {
                console.warn(`⚠️ No se pudo registrar en API: ${error.message}`);
                throw error;
            }
        }
        
        async function refreshDeviceStatus(deviceId) {
            const deviceIndex = devices.findIndex(d => d.id === deviceId);
            if (deviceIndex === -1) return;
            
            const oldStatus = devices[deviceIndex].isOnline;
            const newStatus = await checkDeviceStatus(deviceId);
            
            devices[deviceIndex].isOnline = newStatus.isOnline;
            devices[deviceIndex].lastSeen = newStatus.isOnline ? (newStatus.lastSeen || new Date().toISOString()) : devices[deviceIndex].lastSeen;
            
            localStorage.setItem("devices", JSON.stringify(devices));
            
            // Actualizar UI específica
            const deviceCard = document.getElementById(`device-${deviceId}`);
            if (deviceCard) {
                const statusSpan = deviceCard.querySelector('.device-status');
                const timeSpan = deviceCard.querySelector('.far.fa-clock')?.parentElement;
                
                if (statusSpan) {
                    statusSpan.className = `device-status ${newStatus.isOnline ? 'status-online' : 'status-offline'}`;
                    statusSpan.textContent = newStatus.isOnline ? '🟢 En línea' : '🔴 Sin conexión';
                }
                
                if (timeSpan && newStatus.lastSeen) {
                    timeSpan.innerHTML = `<i class="far fa-clock"></i> Última vez: ${formatTimeAgo(newStatus.lastSeen)}`;
                    timeSpan.style.color = newStatus.isOnline ? '#10b981' : '#64748b';
                }
            }
            
            updateStats();
            
            // Mostrar notificación si cambió el estado
            if (oldStatus !== newStatus.isOnline) {
                const deviceName = devices[deviceIndex].name;
                const message = newStatus.isOnline ? 
                    `${deviceName} está ahora en línea` : 
                    `${deviceName} se desconectó`;
                showNotification(message, newStatus.isOnline ? 'success' : 'error', 3000);
            }
        }
        
        async function removeDevice(deviceId) {
            const device = devices.find(d => d.id === deviceId);
            if (!device) return;
            
            if (!confirm(`¿Eliminar el dispositivo "${device.name}"?\n\nEsta acción no se puede deshacer.`)) {
                return;
            }
            
            // Cerrar EventSource si existe
            if (eventSources[deviceId]) {
                eventSources[deviceId].close();
                delete eventSources[deviceId];
            }
            
            // Intentar eliminar de la API
            if (apiStatus === 'connected') {
                try {
                    await fetch(`${API_BASE}/api/device/${deviceId}`, {
                        method: 'DELETE'
                    });
                } catch (error) {
                    console.warn("No se pudo eliminar de API:", error);
                }
            }
            
            // Eliminar localmente
            devices = devices.filter(d => d.id !== deviceId);
            localStorage.setItem("devices", JSON.stringify(devices));
            
            // Actualizar UI
            const deviceCard = document.getElementById(`device-${deviceId}`);
            if (deviceCard) {
                deviceCard.style.opacity = '0.5';
                deviceCard.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    renderDevices();
                    updateStats();
                }, 300);
            } else {
                renderDevices();
                updateStats();
            }
            
            showNotification(`Dispositivo ${device.name} eliminado`, 'success', 3000);
        }
        
        function viewDevice(id) {
            const device = devices.find(d => d.id === id);
            if (device) {
                window.location.href = `map.html?id=${id}&name=${encodeURIComponent(device.name)}`;
            }
        }
        
        function copyDeviceId(id) {
            navigator.clipboard.writeText(id).then(() => {
                showNotification('ID copiado al portapapeles', 'success', 2000);
            }).catch(err => {
                console.error('Error al copiar:', err);
                showNotification('Error al copiar ID', 'error', 3000);
            });
        }
        
        function forceRefresh() {
            showLoading('Actualizando dispositivos...');
            updateAllDevicesStatus().finally(() => {
                hideLoading();
                showNotification('Dispositivos actualizados', 'success', 2000);
            });
        }
        
        // ==================== FUNCIONES DE WEBSOCKET/EVENTOS ====================
        
        function subscribeToDeviceEvents(deviceId) {
            if (!('EventSource' in window) || apiStatus !== 'connected') return;
            
            // Cerrar suscripción anterior si existe
            if (eventSources[deviceId]) {
                eventSources[deviceId].close();
            }
            
            // Crear nueva suscripción
            try {
                const eventSource = new EventSource(`${API_BASE}/api/device/events/${deviceId}`);
                
                eventSource.onmessage = function(event) {
                    try {
                        const data = JSON.parse(event.data);
                        console.log("📡 Evento recibido para", deviceId, ":", data);
                        
                        // Actualizar dispositivo
                        const deviceIndex = devices.findIndex(d => d.id === deviceId);
                        if (deviceIndex !== -1) {
                            const wasOnline = devices[deviceIndex].isOnline;
                            devices[deviceIndex].isOnline = true;
                            devices[deviceIndex].lastSeen = new Date().toISOString();
                            
                            if (!wasOnline) {
                                showNotification(`${devices[deviceIndex].name} está en línea`, 'success', 3000);
                            }
                            
                            renderDevices();
                            updateStats();
                        }
                    } catch (e) {
                        console.error("Error procesando evento:", e);
                    }
                };
                
                eventSource.onerror = function(error) {
                    console.error(`❌ Error en EventSource para ${deviceId}:`, error);
                    eventSource.close();
                    delete eventSources[deviceId];
                    
                    // Reintentar después de 30 segundos
                    setTimeout(() => {
                        if (devices.find(d => d.id === deviceId)) {
                            subscribeToDeviceEvents(deviceId);
                        }
                    }, 30000);
                };
                
                eventSources[deviceId] = eventSource;
                
            } catch (error) {
                console.error(`❌ No se pudo crear EventSource para ${deviceId}:`, error);
            }
        }
        
        function unsubscribeFromDeviceEvents(deviceId) {
            if (eventSources[deviceId]) {
                eventSources[deviceId].close();
                delete eventSources[deviceId];
            }
        }
        
        // ==================== FUNCIONES UTILITARIAS ====================
        
        function updateStats() {
            const total = devices.length;
            const online = devices.filter(d => d.isOnline).length;
            
            document.getElementById('totalDevices').textContent = total;
            document.getElementById('onlineDevices').textContent = online;
            document.getElementById('onlineDevices').className = 
                online > 0 ? 'status-value status-connected' : 'status-value status-disconnected';
            
            // Actualizar URL de API
            document.getElementById('apiUrl').textContent = 
                API_BASE.includes('localhost') ? 'Local' : 
                API_BASE.includes('render.com') ? 'Render' :
                API_BASE.includes('herokuapp.com') ? 'Heroku' : 'API';
            
            document.getElementById('currentApiUrl').textContent = API_BASE;
        }
        
        function updateApiStatusDisplay() {
            const apiStatusEl = document.getElementById('apiStatus');
            const connectionInfo = document.getElementById('connectionInfo');
            
            if (apiStatus === 'connected') {
                apiStatusEl.innerHTML = '<i class="fas fa-circle"></i> <span>API Conectada</span>';
                apiStatusEl.className = 'api-status api-connected';
                connectionInfo.innerHTML = `<i class="fas fa-wifi"></i> Conectado a: ${API_BASE.replace('https://', '')}`;
                document.getElementById('autoRefreshIndicator').style.display = 'inline-flex';
            } else if (apiStatus === 'disconnected') {
                apiStatusEl.innerHTML = '<i class="fas fa-circle"></i> <span>API Desconectada</span>';
                apiStatusEl.className = 'api-status api-disconnected';
                connectionInfo.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Modo offline - Los datos se guardan localmente`;
                document.getElementById('autoRefreshIndicator').style.display = 'none';
            } else {
                apiStatusEl.innerHTML = '<i class="fas fa-circle"></i> <span>Conectando...</span>';
                apiStatusEl.className = 'api-status api-disconnected';
                document.getElementById('autoRefreshIndicator').style.display = 'none';
            }
        }
        
        function updateLastUpdateDisplay() {
            if (lastUpdateTime) {
                const timeStr = lastUpdateTime.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                document.getElementById('lastUpdate').textContent = timeStr;
            }
        }
        
        function formatTimeAgo(timestamp) {
            if (!timestamp) return 'Nunca';
            
            const date = new Date(timestamp);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            
            if (diffMins < 1) return 'Ahora mismo';
            if (diffMins < 60) return `Hace ${diffMins} min`;
            
            const diffHours = Math.floor(diffMins / 60);
            if (diffHours < 24) return `Hace ${diffHours} h`;
            
            const diffDays = Math.floor(diffHours / 24);
            if (diffDays === 1) return 'Ayer';
            if (diffDays < 7) return `Hace ${diffDays} días`;
            
            return date.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short'
            });
        }
        
        function showLoading(text = 'Cargando...') {
            document.getElementById('loadingScreen').style.display = 'flex';
            document.getElementById('loadingText').textContent = text;
        }
        
        function hideLoading() {
            document.getElementById('loadingScreen').style.display = 'none';
        }
        
        function startAutoRefresh() {
            // Limpiar intervalo anterior si existe
            if (autoRefreshInterval) {
                clearInterval(autoRefreshInterval);
            }
            
            // Configurar nuevo intervalo
            autoRefreshInterval = setInterval(() => {
                if (isAutoRefreshEnabled && apiStatus === 'connected' && devices.length > 0) {
                    updateAllDevicesStatus();
                }
            }, 10000); // 10 segundos
            
            console.log("🔄 Actualización automática iniciada (cada 10 segundos)");
        }
        
        function toggleAutoRefresh() {
            isAutoRefreshEnabled = !isAutoRefreshEnabled;
            const indicator = document.getElementById('autoRefreshIndicator');
            
            if (isAutoRefreshEnabled) {
                startAutoRefresh();
                indicator.innerHTML = '<i class="fas fa-sync blink"></i> Auto';
                showNotification('Actualización automática activada', 'success', 2000);
            } else {
                clearInterval(autoRefreshInterval);
                indicator.innerHTML = '<i class="fas fa-sync"></i> Manual';
                showNotification('Actualización automática desactivada', 'info', 2000);
            }
        }
        
        function openSettings() {
            const settings = `
                Configuración de HawkEye:
                
                • URL API: ${API_BASE}
                • Actualización automática: ${isAutoRefreshEnabled ? 'Activada' : 'Desactivada'}
                • Dispositivos almacenados: ${devices.length}
                • Estado API: ${apiStatus === 'connected' ? 'Conectada' : 'Desconectada'}
                • Última actualización: ${lastUpdateTime ? lastUpdateTime.toLocaleString() : 'Nunca'}
                
                Opciones:
                1. Cambiar URL API
                2. ${isAutoRefreshEnabled ? 'Desactivar' : 'Activar'} actualización automática
                3. Limpiar caché local
                4. Exportar dispositivos
            `;
            
            const choice = prompt(settings + "\n\nIngresa el número de opción (1-4):", "2");
            
            switch(choice) {
                case '1':
                    const newApi = prompt("Nueva URL de la API:", API_BASE);
                    if (newApi && newApi !== API_BASE) {
                        if (confirm(`¿Cambiar API a ${newApi}?\nLa página se recargará.`)) {
                            localStorage.setItem('HAWKEYE_API_URL', newApi);
                            location.reload();
                        }
                    }
                    break;
                case '2':
                    toggleAutoRefresh();
                    break;
                case '3':
                    if (confirm("¿Limpiar todos los datos locales?\nEsto eliminará dispositivos guardados en este navegador.")) {
                        localStorage.removeItem("devices");
                        devices = [];
                        renderDevices();
                        updateStats();
                        showNotification('Datos locales eliminados', 'success', 3000);
                    }
                    break;
                case '4':
                    const exportData = JSON.stringify(devices, null, 2);
                    navigator.clipboard.writeText(exportData).then(() => {
                        showNotification('Dispositivos copiados al portapapeles', 'success', 3000);
                    });
                    break;
            }
        }
        
        // ==================== INICIALIZACIÓN ====================
        
        async function initializeApp() {
            console.log("🚀 Inicializando HawkEye v2.1...");
            console.log("🌐 URL API:", API_BASE);
            console.log("🏠 GitHub Pages:", GITHUB_PAGES_URL);
            
            // Verificar si hay URL API personalizada
            const customApi = localStorage.getItem('HAWKEYE_API_URL');
            if (customApi && customApi !== API_BASE) {
                if (confirm(`¿Usar API personalizada?\n\nActual: ${API_BASE}\nPersonalizada: ${customApi}`)) {
                    window.API_BASE = customApi;
                    location.reload();
                    return;
                }
            }
            
            showLoading('Inicializando...');
            
            // Probar conexión con API
            await checkApiConnection();
            
            // Cargar dispositivos
            await loadDevices();
            
            // Iniciar actualización automática
            startAutoRefresh();
            
            // Actualizar UI de última actualización cada minuto
            setInterval(updateLastUpdateDisplay, 60000);
            
            hideLoading();
            
            console.log("✅ Aplicación inicializada correctamente");
            
            // Configurar botón de refresh
            document.getElementById('refreshBtn').addEventListener('click', forceRefresh);
            document.getElementById('autoRefreshIndicator').addEventListener('click', function(e) {
                e.stopPropagation();
                toggleAutoRefresh();
            });
        }
        
        // ==================== MANEJO DE EVENTOS ====================
        
        document.addEventListener('DOMContentLoaded', initializeApp);
        
        // Registrar service worker para PWA
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('sw.js').then(registration => {
                    console.log('✅ Service Worker registrado:', registration);
                }).catch(error => {
                    console.log('❌ Error registrando Service Worker:', error);
                });
            });
        }
        
        // Manejar teclas de acceso rápido
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                forceRefresh();
            }
            if (e.key === 'F5') {
                e.preventDefault();
                forceRefresh();
            }
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                addDevice();
            }
            if (e.ctrlKey && e.key === 'a') {
                e.preventDefault();
                addAndroidDevice();
            }
        });
        
        // Manejar visibilidad de la página
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && apiStatus === 'connected') {
                // Cuando la página vuelve a ser visible, actualizar
                setTimeout(() => {
                    updateAllDevicesStatus();
                }, 1000);
            }
        });
        
        // Mostrar información de versión
        console.log("%c🦅 HawkEye v2.1", "color: #3b82f6; font-size: 16px; font-weight: bold;");
        console.log("%cSistema de rastreo en tiempo real", "color: #94a3b8;");
        console.log("Frontend: GitHub Pages | Backend: API Flask | App: Android Kotlin");
        console.log("Actualización automática: Activada (10 segundos)");
    </script>
</body>
</html>
