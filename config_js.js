// Configuración del Sistema - Ingenio Mahuixtlán
const CONFIG = {
    // Información de la empresa
    empresa: {
        nombre: "Ingenio Mahuixtlán",
        marca: "ZUCARMEX®",
        sistema: "Avance Físico de Labores Agrícolas"
    },

    // Configuración de usuarios (en producción usar base de datos)
    usuarios: {
        'admin': { 
            password: 'admin123', 
            rol: 'administrador',
            permisos: ['crear', 'editar', 'eliminar', 'exportar', 'reportes']
        },
        'usuario': { 
            password: 'pass123', 
            rol: 'capturista',
            permisos: ['crear', 'editar', 'reportes']
        },
        'demo': { 
            password: 'demo', 
            rol: 'demo',
            permisos: ['crear', 'reportes']
        }
    },

    // Configuración de labores agrícolas
    labores: {
        preparacion: [
            { id: 'desmonte', nombre: 'Desmonte', orden: 1 },
            { id: 'primer_barbecho', nombre: '1er. Barbecho', orden: 2 },
            { id: 'segundo_barbecho', nombre: '2do. Barbecho', orden: 3 },
            { id: 'ap_encalado', nombre: 'Ap./Encalado', orden: 4 },
            { id: 'primera_rastra', nombre: '1ra. Rastra', orden: 5 },
            { id: 'surco', nombre: 'Surco', orden: 6 }
        ],
        siembra: [
            { id: 'siembra_amp', nombre: 'Siembra-Amp.', orden: 7 },
            { id: 'siembra_rep', nombre: 'Siembra-Rep.', orden: 8 },
            { id: 'jta_quema', nombre: 'Jta. Quema', orden: 9 }
        ],
        cultivo: [
            { id: 'primer_cultivo', nombre: '1er. Cultivo', orden: 10 },
            { id: 'primer_cultivo_yta', nombre: '1er. Cultivo/Yta.', orden: 11 },
            { id: 'subsuelo_ctral', nombre: 'Subsuelo/Ctral.', orden: 15 }
        ],
        fertilizacion: [
            { id: 'primera_ap_fertilizante', nombre: '1ra. Ap/Fertilizante', orden: 12 },
            { id: 'primera_ap_fert_mec', nombre: '1ra. Ap/Fert.Mec.', orden: 13 },
            { id: 'segunda_ap_ferti', nombre: '2da. Ap/Ferti.', orden: 18 }
        ],
        riego: [
            { id: 'primer_riego', nombre: '1er. Riego', orden: 14 },
            { id: 'segundo_riego', nombre: '2do. Riego', orden: 19 }
        ],
        limpieza: [
            { id: 'primera_limpia', nombre: '1ra. Limpia', orden: 16 },
            { id: 'segunda_limpia', nombre: '2da. Limpia', orden: 20 }
        ],
        herbicidas: [
            { id: 'primera_ap_herbicida', nombre: '1ra. Ap/Herbicida', orden: 17 },
            { id: 'segunda_ap_herbicida', nombre: '2da. Ap/Herbicida', orden: 21 }
        ],
        otros: [
            { id: 'resiembra', nombre: 'Resiembra', orden: 22 }
        ]
    },

    // Configuración de zonas
    zonas: {
        min: 1,
        max: 20,
        activas: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },

    // Configuración de zafras
    zafras: [
        '2023-2024',
        '2024-2025',
        '2025-2026',
        '2026-2027',
        '2027-2028'
    ],

    // Configuración de ciclos
    ciclos: {
        'P': { nombre: 'Plantilla', descripcion: 'Primer año de cultivo' },
        'S': { nombre: 'Soca', descripcion: 'Segundo año de cultivo' },
        'R': { nombre: 'Resoca', descripcion: 'Tercer año de cultivo' }
    },

    // Configuración de régimen
    regimenes: {
        'R': { nombre: 'Riego', descripcion: 'Cultivo con sistema de riego' },
        'T': { nombre: 'Temporal', descripcion: 'Cultivo de temporal (lluvia)' }
    },

    // Configuración de la aplicación
    app: {
        version: '1.0.0',
        fechaCreacion: '2025-01-01',
        desarrollador: 'Sistema Interno',
        autoGuardado: true,
        intervaloAutoGuardado: 300000, // 5 minutos en milisegundos
        maxRegistrosExportacion: 10000
    },

    // Configuración de validación
    validacion: {
        superficie: {
            min: 0.1,
            max: 1000,
            decimales: 2
        },
        nombreProductor: {
            minLength: 3,
            maxLength: 100,
            autoUppercase: true
        },
        campo: {
            maxLength: 20,
            patron: /^[A-Z0-9-_]+$/i
        },
        idProductor: {
            maxLength: 15,
            patron: /^[0-9]+$/
        }
    },

    // Colores del tema
    colores: {
        primario: 'rgb(34,116,71)',
        primarioClaro: 'rgba(34,116,71,0.1)',
        primarioOscuro: 'rgba(34,116,71,0.9)',
        exito: '#28a745',
        error: '#dc3545',
        advertencia: '#ffc107',
        info: '#17a2b8'
    },

    // Mensajes del sistema
    mensajes: {
        login: {
            exitoso: 'Bienvenido al sistema',
            error: 'Usuario o contraseña incorrectos',
            camposVacios: 'Complete todos los campos'
        },
        guardado: {
            exitoso: 'Registro guardado exitosamente',
            error: 'Error al guardar el registro',
            camposRequeridos: 'Por favor complete todos los campos requeridos (*)'
        },
        eliminacion: {
            confirmacion: '¿Está seguro de que desea eliminar este registro?',
            exitoso: 'Registro eliminado exitosamente',
            error: 'Error al eliminar el registro'
        },
        exportacion: {
            exitoso: 'Datos exportados exitosamente',
            error: 'Error al exportar los datos',
            sinDatos: 'No hay datos para exportar'
        }
    }
};

// Función para obtener todas las labores como array plano
CONFIG.getAllLabores = function() {
    const todas = [];
    Object.values(this.labores).forEach(categoria => {
        todas.push(...categoria);
    });
    return todas.sort((a, b) => a.orden - b.orden);
};

// Función para validar permisos de usuario
CONFIG.tienePermiso = function(usuario, accion) {
    const userConfig = this.usuarios[usuario];
    return userConfig && userConfig.permisos.includes(accion);
};

// Función para obtener configuración de color
CONFIG.getColor = function(tipo) {
    return this.colores[tipo] || this.colores.primario;
};

// Función para obtener mensaje del sistema
CONFIG.getMensaje = function(categoria, tipo) {
    return this.mensajes[categoria] && this.mensajes[categoria][tipo] || 'Mensaje no encontrado';
};

// Exportar configuración (si se usa módulos ES6)
// export default CONFIG;

// Para uso directo en HTML
window.CONFIG = CONFIG;
