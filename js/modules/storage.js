/**
 * MÓDULO DE ALMACENAMIENTO
 * Maneja toda la persistencia de datos local y sincronización
 */

class StorageManager {
    constructor() {
        this.storageKeys = {
            gradebook: 'gradebookDataLocal',
            gradebookUser: 'gradebookUserInfo',
            checklist: 'checklistDataLocal',
            checklistUser: 'checklistUserInfo',
            appSettings: 'appSettings',
            backups: 'dataBackups'
        };
        
        this.maxBackups = 5;
        this.init();
    }

    /**
     * Inicializa el gestor de almacenamiento
     */
    init() {
        this.setupStorageQuotaMonitoring();
        this.setupAutoBackup();
        console.log('💾 Storage Manager inicializado');
    }

    /**
     * Guarda datos en localStorage con validación
     */
    save(key, data) {
        try {
            const serializedData = JSON.stringify(data);
            const dataSize = new Blob([serializedData]).size;
            
            // Verificar espacio disponible
            if (this.checkStorageQuota(dataSize)) {
                localStorage.setItem(key, serializedData);
                this.updateLastModified(key);
                console.log(`💾 Datos guardados: ${key} (${this.formatBytes(dataSize)})`);
                return true;
            } else {
                console.warn('⚠️ Espacio de almacenamiento insuficiente');
                this.handleStorageQuotaExceeded();
                return false;
            }
        } catch (error) {
            console.error('❌ Error guardando datos:', error);
            return false;
        }
    }

    /**
     * Carga datos desde localStorage con validación
     */
    load(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            if (data === null) {
                return defaultValue;
            }
            
            const parsedData = JSON.parse(data);
            console.log(`📖 Datos cargados: ${key}`);
            return parsedData;
        } catch (error) {
            console.error(`❌ Error cargando datos de ${key}:`, error);
            return defaultValue;
        }
    }

    /**
     * Elimina datos específicos
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            console.log(`🗑️ Datos eliminados: ${key}`);
            return true;
        } catch (error) {
            console.error(`❌ Error eliminando ${key}:`, error);
            return false;
        }
    }

    /**
     * Limpia todos los datos de la aplicación
     */
    clearAll() {
        try {
            Object.values(this.storageKeys).forEach(key => {
                localStorage.removeItem(key);
            });
            console.log('🧹 Todos los datos eliminados');
            return true;
        } catch (error) {
            console.error('❌ Error limpiando datos:', error);
            return false;
        }
    }

    /**
     * Crea un backup de todos los datos
     */
    createBackup(description = '') {
        try {
            const backupData = {
                id: this.generateBackupId(),
                timestamp: new Date().toISOString(),
                description: description,
                data: {}
            };

            // Recopilar todos los datos
            Object.entries(this.storageKeys).forEach(([name, key]) => {
                const data = this.load(key);
                if (data) {
                    backupData.data[name] = data;
                }
            });

            // Guardar backup
            const backups = this.load(this.storageKeys.backups, []);
            backups.unshift(backupData);

            // Mantener solo los últimos backups
            if (backups.length > this.maxBackups) {
                backups.splice(this.maxBackups);
            }

            this.save(this.storageKeys.backups, backups);
            
            console.log(`💾 Backup creado: ${backupData.id}`);
            return backupData.id;
        } catch (error) {
            console.error('❌ Error creando backup:', error);
            return null;
        }
    }

    /**
     * Restaura datos desde un backup
     */
    restoreBackup(backupId) {
        try {
            const backups = this.load(this.storageKeys.backups, []);
            const backup = backups.find(b => b.id === backupId);
            
            if (!backup) {
                console.error('❌ Backup no encontrado:', backupId);
                return false;
            }

            // Restaurar datos
            Object.entries(backup.data).forEach(([name, data]) => {
                const key = this.storageKeys[name];
                if (key) {
                    this.save(key, data);
                }
            });

            console.log(`🔄 Backup restaurado: ${backupId}`);
            return true;
        } catch (error) {
            console.error('❌ Error restaurando backup:', error);
            return false;
        }
    }

    /**
     * Lista todos los backups disponibles
     */
    listBackups() {
        const backups = this.load(this.storageKeys.backups, []);
        return backups.map(backup => ({
            id: backup.id,
            timestamp: backup.timestamp,
            description: backup.description,
            size: this.calculateBackupSize(backup)
        }));
    }

    /**
     * Exporta todos los datos a un archivo JSON
     */
    exportData() {
        try {
            const exportData = {
                version: '1.0.0',
                exportDate: new Date().toISOString(),
                data: {}
            };

            // Recopilar todos los datos
            Object.entries(this.storageKeys).forEach(([name, key]) => {
                if (key !== this.storageKeys.backups) { // No incluir backups en export
                    const data = this.load(key);
                    if (data) {
                        exportData.data[name] = data;
                    }
                }
            });

            return exportData;
        } catch (error) {
            console.error('❌ Error exportando datos:', error);
            return null;
        }
    }

    /**
     * Importa datos desde un archivo JSON
     */
    importData(importData) {
        try {
            if (!importData || !importData.data) {
                throw new Error('Formato de datos inválido');
            }

            // Crear backup antes de importar
            this.createBackup('Antes de importación');

            // Importar datos
            Object.entries(importData.data).forEach(([name, data]) => {
                const key = this.storageKeys[name];
                if (key) {
                    this.save(key, data);
                }
            });

            console.log('📥 Datos importados correctamente');
            return true;
        } catch (error) {
            console.error('❌ Error importando datos:', error);
            return false;
        }
    }

    /**
     * Verifica el espacio de almacenamiento disponible
     */
    async checkStorageQuota(additionalSize = 0) {
        try {
            if ('storage' in navigator && 'estimate' in navigator.storage) {
                const estimate = await navigator.storage.estimate();
                const used = estimate.usage || 0;
                const quota = estimate.quota || 0;
                const available = quota - used;
                
                console.log(`💾 Almacenamiento: ${this.formatBytes(used)}/${this.formatBytes(quota)} usado`);
                
                return available > additionalSize;
            }
            return true; // Asumir que hay espacio si no se puede verificar
        } catch (error) {
            console.error('❌ Error verificando cuota de almacenamiento:', error);
            return true;
        }
    }

    /**
     * Configura monitoreo de cuota de almacenamiento
     */
    setupStorageQuotaMonitoring() {
        // Verificar cuota cada 5 minutos
        setInterval(() => {
            this.checkStorageQuota();
        }, 5 * 60 * 1000);
    }

    /**
     * Maneja cuando se excede la cuota de almacenamiento
     */
    handleStorageQuotaExceeded() {
        console.warn('⚠️ Cuota de almacenamiento excedida');
        
        // Limpiar backups antiguos
        const backups = this.load(this.storageKeys.backups, []);
        if (backups.length > 2) {
            backups.splice(2); // Mantener solo 2 backups
            this.save(this.storageKeys.backups, backups);
        }

        // Mostrar notificación al usuario
        this.showStorageWarning();
    }

    /**
     * Muestra advertencia de almacenamiento
     */
    showStorageWarning() {
        const warning = document.createElement('div');
        warning.className = 'fixed top-4 left-4 right-4 bg-yellow-600 text-white p-4 rounded-lg shadow-lg z-50';
        warning.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <h4 class="font-semibold">Espacio de almacenamiento bajo</h4>
                    <p class="text-sm opacity-90">Considera exportar y limpiar datos antiguos</p>
                </div>
                <button onclick="this.parentNode.parentNode.remove()" class="text-white opacity-75 hover:opacity-100 p-2">
                    ✕
                </button>
            </div>
        `;
        
        document.body.appendChild(warning);
        
        // Auto-remover después de 10 segundos
        setTimeout(() => {
            if (warning.parentNode) {
                warning.parentNode.removeChild(warning);
            }
        }, 10000);
    }

    /**
     * Configura backup automático
     */
    setupAutoBackup() {
        // Crear backup automático cada hora
        setInterval(() => {
            this.createBackup('Backup automático');
        }, 60 * 60 * 1000);

        // Crear backup al cerrar la página
        window.addEventListener('beforeunload', () => {
            this.createBackup('Backup al cerrar');
        });
    }

    /**
     * Actualiza timestamp de última modificación
     */
    updateLastModified(key) {
        const metadata = this.load('storageMetadata', {});
        metadata[key] = {
            lastModified: new Date().toISOString(),
            version: '1.0.0'
        };
        localStorage.setItem('storageMetadata', JSON.stringify(metadata));
    }

    /**
     * Genera ID único para backup
     */
    generateBackupId() {
        return `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Calcula el tamaño de un backup
     */
    calculateBackupSize(backup) {
        try {
            const serialized = JSON.stringify(backup);
            return new Blob([serialized]).size;
        } catch (error) {
            return 0;
        }
    }

    /**
     * Formatea bytes en formato legible
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Obtiene estadísticas de uso de almacenamiento
     */
    getStorageStats() {
        const stats = {
            totalItems: 0,
            totalSize: 0,
            itemSizes: {}
        };

        Object.entries(this.storageKeys).forEach(([name, key]) => {
            const data = localStorage.getItem(key);
            if (data) {
                const size = new Blob([data]).size;
                stats.totalItems++;
                stats.totalSize += size;
                stats.itemSizes[name] = size;
            }
        });

        return stats;
    }

    /**
     * Sincroniza datos con servidor (futuro)
     */
    async syncWithServer() {
        // Placeholder para futura implementación de sincronización con servidor
        console.log('🔄 Sincronización con servidor (no implementado)');
        return Promise.resolve(true);
    }
}

// Crear instancia global
const storageManager = new StorageManager();

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
} else {
    window.StorageManager = StorageManager;
    window.storageManager = storageManager;
}
