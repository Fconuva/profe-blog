/**
 * Sistema de Rastreo de Errores Mejorado
 * Captura errores JavaScript, problemas de carga, eventos de Bootstrap, y más
 */

class ErrorTracker {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.events = [];
    this.maxLogs = 100;
    this.init();
  }

  init() {
    this.setupErrorHandlers();
    this.setupBootstrapTracking();
    this.setupConsoleOverride();
    this.setupPerformanceTracking();
    this.logSystemInfo();
  }

  // =====================
  // CAPTURA DE ERRORES
  // =====================

  setupErrorHandlers() {
    // Errores JavaScript globales
    window.addEventListener('error', (event) => {
      this.logError({
        type: 'JavaScript Error',
        message: event.message,
        source: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString()
      });
    });

    // Promesas rechazadas sin catch
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        type: 'Unhandled Promise Rejection',
        message: event.reason?.message || event.reason,
        stack: event.reason?.stack,
        timestamp: new Date().toISOString()
      });
    });

    // Errores de recursos (CSS, JS, imágenes)
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.logWarning({
          type: 'Resource Load Error',
          resource: event.target.tagName,
          src: event.target.src || event.target.href,
          timestamp: new Date().toISOString()
        });
      }
    }, true);
  }

  setupBootstrapTracking() {
    // Rastrear todos los eventos de Bootstrap
    const bootstrapEvents = [
      // Collapse
      'show.bs.collapse',
      'shown.bs.collapse',
      'hide.bs.collapse',
      'hidden.bs.collapse',
      // Modal
      'show.bs.modal',
      'shown.bs.modal',
      'hide.bs.modal',
      'hidden.bs.modal',
      // Dropdown
      'show.bs.dropdown',
      'shown.bs.dropdown',
      'hide.bs.dropdown',
      'hidden.bs.dropdown',
      // Tab
      'show.bs.tab',
      'shown.bs.tab',
      'hide.bs.tab',
      'hidden.bs.tab'
    ];

    bootstrapEvents.forEach(eventName => {
      document.addEventListener(eventName, (event) => {
        this.logEvent({
          type: 'Bootstrap Event',
          event: eventName,
          target: event.target.id || event.target.className,
          timestamp: new Date().toISOString()
        });
      });
    });
  }

  setupConsoleOverride() {
    // Guardar referencias originales
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;

    // Override console.error
    console.error = (...args) => {
      this.logError({
        type: 'Console Error',
        message: args.join(' '),
        timestamp: new Date().toISOString()
      });
      originalError.apply(console, args);
    };

    // Override console.warn
    console.warn = (...args) => {
      this.logWarning({
        type: 'Console Warning',
        message: args.join(' '),
        timestamp: new Date().toISOString()
      });
      originalWarn.apply(console, args);
    };

    // Override console.log para debug mode
    if (this.isDebugMode()) {
      console.log = (...args) => {
        this.logEvent({
          type: 'Console Log',
          message: args.join(' '),
          timestamp: new Date().toISOString()
        });
        originalLog.apply(console, args);
      };
    }
  }

  setupPerformanceTracking() {
    // Rastrear tiempos de carga
    window.addEventListener('load', () => {
      const perfData = performance.timing;
      const loadTime = perfData.loadEventEnd - perfData.navigationStart;
      const domReady = perfData.domContentLoadedEventEnd - perfData.navigationStart;

      this.logEvent({
        type: 'Performance',
        loadTime: `${loadTime}ms`,
        domReady: `${domReady}ms`,
        timestamp: new Date().toISOString()
      });
    });
  }

  // =====================
  // LOGGING FUNCTIONS
  // =====================

  logError(error) {
    this.errors.push(error);
    this.trimLogs(this.errors);
    
    console.group(`🔴 ERROR: ${error.type}`);
    console.error('Message:', error.message);
    if (error.source) console.error('Source:', `${error.source}:${error.line}:${error.column}`);
    if (error.stack) console.error('Stack:', error.stack);
    console.error('Time:', error.timestamp);
    console.groupEnd();
  }

  logWarning(warning) {
    this.warnings.push(warning);
    this.trimLogs(this.warnings);
    
    if (this.isDebugMode()) {
      console.group(`⚠️ WARNING: ${warning.type}`);
      console.warn('Details:', warning);
      console.groupEnd();
    }
  }

  logEvent(event) {
    this.events.push(event);
    this.trimLogs(this.events);
    
    if (this.isDebugMode()) {
      console.log(`📌 ${event.type}:`, event);
    }
  }

  logSystemInfo() {
    const info = {
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    console.group('🖥️ SYSTEM INFO');
    console.log('URL:', info.url);
    console.log('Viewport:', info.viewport);
    console.log('User Agent:', info.userAgent);
    console.log('Debug Mode:', this.isDebugMode());
    console.groupEnd();
  }

  // =====================
  // UTILIDADES
  // =====================

  trimLogs(logArray) {
    if (logArray.length > this.maxLogs) {
      logArray.shift();
    }
  }

  isDebugMode() {
    return window.location.search.includes('debug=true') || 
           localStorage.getItem('errorTracker_debug') === 'true';
  }

  // =====================
  // API PÚBLICA
  // =====================

  getErrors() {
    return this.errors;
  }

  getWarnings() {
    return this.warnings;
  }

  getEvents() {
    return this.events;
  }

  getSummary() {
    return {
      totalErrors: this.errors.length,
      totalWarnings: this.warnings.length,
      totalEvents: this.events.length,
      lastError: this.errors[this.errors.length - 1],
      lastWarning: this.warnings[this.warnings.length - 1]
    };
  }

  printSummary() {
    const summary = this.getSummary();
    
    console.group('📊 ERROR TRACKER SUMMARY');
    console.log('Total Errors:', summary.totalErrors);
    console.log('Total Warnings:', summary.totalWarnings);
    console.log('Total Events:', summary.totalEvents);
    
    if (summary.lastError) {
      console.group('Last Error:');
      console.error(summary.lastError);
      console.groupEnd();
    }
    
    console.groupEnd();
  }

  exportLogs() {
    const data = {
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      errors: this.errors,
      warnings: this.warnings,
      events: this.events
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-logs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    console.log('✅ Logs exported successfully');
  }

  clearLogs() {
    this.errors = [];
    this.warnings = [];
    this.events = [];
    console.log('✅ All logs cleared');
  }

  // Activar/desactivar debug mode
  setDebugMode(enabled) {
    localStorage.setItem('errorTracker_debug', enabled.toString());
    console.log(`Debug mode ${enabled ? 'ENABLED' : 'DISABLED'}`);
    console.log('Reload page to apply changes');
  }
}

// =====================
// INICIALIZACIÓN
// =====================

const errorTracker = new ErrorTracker();

// Exponer API globalmente para uso en consola
window.errorTracker = errorTracker;

// Mostrar comandos disponibles
console.log('%c🔍 ERROR TRACKER LOADED', 'color: #4CAF50; font-weight: bold; font-size: 14px;');
console.log('%cComandos disponibles:', 'color: #2196F3; font-weight: bold;');
console.log('  errorTracker.printSummary()     - Ver resumen de errores');
console.log('  errorTracker.getErrors()        - Obtener lista de errores');
console.log('  errorTracker.getWarnings()      - Obtener lista de warnings');
console.log('  errorTracker.getEvents()        - Obtener lista de eventos');
console.log('  errorTracker.exportLogs()       - Exportar logs a archivo JSON');
console.log('  errorTracker.clearLogs()        - Limpiar todos los logs');
console.log('  errorTracker.setDebugMode(true) - Activar modo debug');
console.log('%cPara ver logs detallados: añade ?debug=true a la URL', 'color: #FF9800;');
