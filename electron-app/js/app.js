/**
 * HERRAMIENTA DE EVALUACIÓN DOCENTE - APLICACIÓN PRINCIPAL
 * Archivo principal que maneja la PWA y la navegación entre herramientas
 */

class EvaluationApp {
    constructor() {
        this.isInstalled = false;
        this.deferredPrompt = null;
        this.currentTool = null;
        this.serviceWorkerRegistration = null;
        
        this.init();
    }

    /**
     * Inicializa la aplicación
     */
    async init() {
        console.log('🚀 Iniciando Herramienta de Evaluación Docente');
        
        // Verificar si la app está instalada
        this.checkInstallStatus();
        
        // Registrar Service Worker
        await this.registerServiceWorker();
        
        // Configurar eventos
        this.setupEventListeners();
        
        // Configurar PWA
        this.setupPWA();
        
        // Cargar datos iniciales
        this.loadInitialData();
        
        // Actualizar estado de conexión
        this.updateOnlineStatus();
        
        console.log('✅ Aplicación inicializada correctamente');
    }

    /**
     * Verifica si la aplicación está instalada
     */
    checkInstallStatus() {
        if (window.matchMedia('(display-mode: standalone)').matches || 
            window.navigator.standalone) {
            this.isInstalled = true;
            console.log('📱 Aplicación ejecutándose como PWA instalada');
        }
    }

    /**
     * Registra el Service Worker
     */
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js');
                console.log('🔧 Service Worker registrado:', this.serviceWorkerRegistration);
                
                // Escuchar actualizaciones del SW
                this.serviceWorkerRegistration.addEventListener('updatefound', () => {
                    console.log('🔄 Nueva versión del Service Worker disponible');
                    this.handleServiceWorkerUpdate();
                });
                
                this.updateSyncTime();
            } catch (error) {
                console.error('❌ Error registrando Service Worker:', error);
            }
        }
    }

    /**
     * Maneja actualizaciones del Service Worker
     */
    handleServiceWorkerUpdate() {
        const newWorker = this.serviceWorkerRegistration.installing;
        
        newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Nueva versión disponible
                this.showUpdateNotification();
            }
        });
    }

    /**
     * Muestra notificación de actualización disponible
     */
    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 left-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50';
        notification.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <h4 class="font-semibold">Nueva versión disponible</h4>
                    <p class="text-sm opacity-90">Recarga la página para actualizar</p>
                </div>
                <button onclick="window.location.reload()" class="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium">
                    Actualizar
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remover después de 10 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 10000);
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        // Eventos de instalación PWA
        window.addEventListener('beforeinstallprompt', (e) => this.handleInstallPrompt(e));
        
        // Eventos de conexión
        window.addEventListener('online', () => this.updateOnlineStatus());
        window.addEventListener('offline', () => this.updateOnlineStatus());
        
        // Eventos de visibilidad (para actualizar datos al volver)
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
        
        // Eventos de botones
        this.setupButtonEvents();
        
        // Eventos de teclado para accesibilidad
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
    }

    /**
     * Configura eventos de botones
     */
    setupButtonEvents() {
        // Botón de instalación
        const installBtn = document.getElementById('install-btn');
        if (installBtn) {
            installBtn.addEventListener('click', () => this.installApp());
        }

        // Botón de cerrar prompt de instalación
        const dismissInstall = document.getElementById('dismiss-install');
        if (dismissInstall) {
            dismissInstall.addEventListener('click', () => this.dismissInstallPrompt());
        }

        // Botón de sincronización
        const syncBtn = document.getElementById('sync-btn');
        if (syncBtn) {
            syncBtn.addEventListener('click', () => this.syncData());
        }

        // Botón de limpiar datos
        const clearDataBtn = document.getElementById('clear-data-btn');
        if (clearDataBtn) {
            clearDataBtn.addEventListener('click', () => this.clearAllData());
        }

        // Botón de exportar todo
        const exportAllBtn = document.getElementById('export-all-btn');
        if (exportAllBtn) {
            exportAllBtn.addEventListener('click', () => this.exportAllData());
        }

        // Botón de acerca de
        const aboutBtn = document.getElementById('about-btn');
        if (aboutBtn) {
            aboutBtn.addEventListener('click', () => this.showAbout());
        }
    }

    /**
     * Configura la funcionalidad PWA
     */
    setupPWA() {
        // Configurar meta tags dinámicamente si es necesario
        this.updatePWAMetaTags();
        
        // Configurar shortcuts de teclado
        this.setupKeyboardShortcuts();
    }

    /**
     * Actualiza meta tags de PWA
     */
    updatePWAMetaTags() {
        // Theme color basado en la hora del día
        const hour = new Date().getHours();
        const isDark = hour < 7 || hour > 19;
        const themeColor = isDark ? '#1f2937' : '#4f46e5';
        
        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (themeColorMeta) {
            themeColorMeta.content = themeColor;
        }
    }

    /**
     * Configura atajos de teclado
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K para búsqueda rápida (futuro)
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                console.log('🔍 Búsqueda rápida (funcionalidad futura)');
            }
            
            // Ctrl/Cmd + S para sincronizar
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.syncData();
            }
        });
    }

    /**
     * Maneja el prompt de instalación
     */
    handleInstallPrompt(e) {
        e.preventDefault();
        this.deferredPrompt = e;
        
        if (!this.isInstalled) {
            this.showInstallPrompt();
        }
    }

    /**
     * Muestra el prompt de instalación
     */
    showInstallPrompt() {
        const installPrompt = document.getElementById('install-prompt');
        if (installPrompt) {
            installPrompt.style.display = 'block';
        }
    }

    /**
     * Instala la aplicación
     */
    async installApp() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            
            const choiceResult = await this.deferredPrompt.userChoice;
            
            if (choiceResult.outcome === 'accepted') {
                console.log('✅ Usuario aceptó la instalación');
                this.dismissInstallPrompt();
                this.trackEvent('pwa_installed', { method: 'prompt' });
            } else {
                console.log('❌ Usuario rechazó la instalación');
            }
            
            this.deferredPrompt = null;
        }
    }

    /**
     * Cierra el prompt de instalación
     */
    dismissInstallPrompt() {
        const installPrompt = document.getElementById('install-prompt');
        if (installPrompt) {
            installPrompt.style.display = 'none';
        }
    }

    /**
     * Actualiza el estado de conexión
     */
    updateOnlineStatus() {
        const statusIndicator = document.getElementById('status-indicator');
        if (!statusIndicator) return;

        if (navigator.onLine) {
            statusIndicator.className = 'status-indicator status-online';
            statusIndicator.textContent = '🟢 En línea';
            this.handleOnlineStatus();
        } else {
            statusIndicator.className = 'status-indicator status-offline';
            statusIndicator.textContent = '🔴 Sin conexión';
            this.handleOfflineStatus();
        }
    }

    /**
     * Maneja el estado online
     */
    handleOnlineStatus() {
        console.log('🌐 Conexión restaurada');
        // Aquí se podría implementar sincronización automática
        this.syncData();
    }

    /**
     * Maneja el estado offline
     */
    handleOfflineStatus() {
        console.log('📴 Sin conexión - modo offline activado');
        // Mostrar notificación de modo offline
        this.showOfflineNotification();
    }

    /**
     * Muestra notificación de modo offline
     */
    showOfflineNotification() {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 left-4 right-4 bg-yellow-600 text-white p-3 rounded-lg shadow-lg z-40';
        notification.innerHTML = `
            <div class="flex items-center">
                <span class="mr-2">⚠️</span>
                <span class="text-sm">Modo offline activado. Los datos se guardan localmente.</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    /**
     * Maneja cambios de visibilidad de la página
     */
    handleVisibilityChange() {
        if (!document.hidden) {
            // La página volvió a ser visible
            this.loadStats();
            this.updateSyncTime();
            this.updateOnlineStatus();
        }
    }

    /**
     * Maneja navegación por teclado
     */
    handleKeyboardNavigation(e) {
        // Escape para cerrar modales
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                activeModal.classList.remove('active');
            }
        }
        
        // Enter para activar elementos focusados
        if (e.key === 'Enter' && e.target.classList.contains('app-card')) {
            e.target.click();
        }
    }

    /**
     * Navega a una herramienta específica
     */
    navigateToTool(tool) {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
        
        // Simular carga para mejor UX
        setTimeout(() => {
            if (tool === 'nota-proceso') {
                window.location.href = 'nota de proceso.html';
            } else if (tool === 'pauta-cotejo') {
                window.location.href = 'pauta de cotejo.html';
            }
        }, 500);
        
        // Tracking
        this.trackEvent('tool_navigation', { tool: tool });
    }

    /**
     * Sincroniza datos
     */
    async syncData() {
        console.log('🔄 Sincronizando datos...');
        
        try {
            // Aquí se implementaría la lógica de sincronización real
            // Por ahora solo actualizamos la hora
            this.updateSyncTime();
            
            // Simular sincronización
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('✅ Sincronización completada');
            this.showSyncSuccess();
            
        } catch (error) {
            console.error('❌ Error en sincronización:', error);
            this.showSyncError();
        }
    }

    /**
     * Muestra mensaje de sincronización exitosa
     */
    showSyncSuccess() {
        const message = document.createElement('div');
        message.className = 'fixed top-4 right-4 bg-green-600 text-white p-3 rounded-lg shadow-lg z-50';
        message.textContent = '✅ Datos sincronizados';
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 3000);
    }

    /**
     * Muestra mensaje de error de sincronización
     */
    showSyncError() {
        const message = document.createElement('div');
        message.className = 'fixed top-4 right-4 bg-red-600 text-white p-3 rounded-lg shadow-lg z-50';
        message.textContent = '❌ Error al sincronizar';
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 3000);
    }

    /**
     * Actualiza la hora de sincronización
     */
    updateSyncTime() {
        const syncTimeElement = document.getElementById('sync-time');
        if (syncTimeElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            syncTimeElement.textContent = timeString;
        }
    }

    /**
     * Carga datos iniciales y estadísticas
     */
    loadInitialData() {
        this.loadStats();
        this.updateSyncTime();
    }

    /**
     * Carga estadísticas de uso
     */
    loadStats() {
        try {
            // Cargar datos de nota de proceso
            const gradebookData = JSON.parse(localStorage.getItem('gradebookDataLocal')) || { courses: {} };
            const courses = Object.keys(gradebookData.courses).length;
            
            let totalStudents = 0;
            let totalAssignments = 0;
            
            Object.values(gradebookData.courses).forEach(course => {
                totalStudents += Object.keys(course.students || {}).length;
                totalAssignments += Object.keys(course.assignments || {}).length;
            });

            // Cargar datos de pauta de cotejo
            const checklistData = JSON.parse(localStorage.getItem('checklistDataLocal')) || { pautas: {} };
            const checklists = Object.keys(checklistData.pautas || {}).length;

            // Actualizar UI
            this.updateStatElement('total-courses', courses);
            this.updateStatElement('total-students', totalStudents);
            this.updateStatElement('total-assignments', totalAssignments);
            this.updateStatElement('total-checklists', checklists);
            
        } catch (error) {
            console.error('❌ Error cargando estadísticas:', error);
        }
    }

    /**
     * Actualiza un elemento de estadística
     */
    updateStatElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            // Animación de conteo
            const currentValue = parseInt(element.textContent) || 0;
            this.animateCounter(element, currentValue, value);
        }
    }

    /**
     * Anima un contador
     */
    animateCounter(element, start, end) {
        const duration = 1000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * progress);
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    /**
     * Limpia todos los datos
     */
    clearAllData() {
        if (confirm('¿Estás seguro de que quieres eliminar todos los datos? Esta acción no se puede deshacer.')) {
            try {
                localStorage.clear();
                this.loadStats();
                
                // Mostrar confirmación
                const message = document.createElement('div');
                message.className = 'fixed top-4 right-4 bg-red-600 text-white p-3 rounded-lg shadow-lg z-50';
                message.textContent = '🗑️ Todos los datos han sido eliminados';
                
                document.body.appendChild(message);
                
                setTimeout(() => {
                    if (message.parentNode) {
                        message.parentNode.removeChild(message);
                    }
                }, 3000);
                
                this.trackEvent('data_cleared');
                
            } catch (error) {
                console.error('❌ Error limpiando datos:', error);
            }
        }
    }

    /**
     * Exporta todos los datos
     */
    exportAllData() {
        try {
            const allData = {
                gradebook: JSON.parse(localStorage.getItem('gradebookDataLocal')) || {},
                gradebookUserInfo: JSON.parse(localStorage.getItem('gradebookUserInfo')) || {},
                checklist: JSON.parse(localStorage.getItem('checklistDataLocal')) || {},
                checklistUserInfo: JSON.parse(localStorage.getItem('checklistUserInfo')) || {},
                exportDate: new Date().toISOString(),
                appVersion: '1.0.0'
            };

            const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            
            a.href = url;
            a.download = `herramienta-evaluacion-completa-${new Date().toISOString().split('T')[0]}.json`;
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            
            this.trackEvent('data_exported', { type: 'complete' });
            
        } catch (error) {
            console.error('❌ Error exportando datos:', error);
        }
    }

    /**
     * Muestra información sobre la aplicación
     */
    showAbout() {
        const aboutText = `Herramienta de Evaluación Docente v1.0.0

Desarrollada para facilitar el registro y gestión de notas de proceso educativo.

Características:
• Funciona sin conexión a internet
• Exportación a PDF de reportes
• Respaldo automático de datos
• Interfaz responsive para móviles
• Instalable como aplicación

Desarrollado con ❤️ para educadores.`;

        alert(aboutText);
    }

    /**
     * Rastrea eventos para analytics (futuro)
     */
    trackEvent(eventName, properties = {}) {
        console.log('📊 Evento:', eventName, properties);
        
        // Aquí se podría implementar Google Analytics, Mixpanel, etc.
        // Por ahora solo guardamos en localStorage para debugging
        try {
            const events = JSON.parse(localStorage.getItem('app_events')) || [];
            events.push({
                event: eventName,
                properties: properties,
                timestamp: new Date().toISOString()
            });
            
            // Mantener solo los últimos 100 eventos
            if (events.length > 100) {
                events.splice(0, events.length - 100);
            }
            
            localStorage.setItem('app_events', JSON.stringify(events));
        } catch (error) {
            console.error('❌ Error guardando evento:', error);
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.evaluationApp = new EvaluationApp();
});

// Función global para navegación (llamada desde HTML)
function navigateToTool(tool) {
    if (window.evaluationApp) {
        window.evaluationApp.navigateToTool(tool);
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EvaluationApp;
}
