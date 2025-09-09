# Sistema de Captura de Datos - Ingenio Mahuixtlán

Sistema web para el avance físico de labores agrícolas del Ingenio Mahuixtlán - ZUCARMEX®.

## 📋 Descripción del Proyecto

Este sistema permite:
- **Captura de datos** de avance de labores agrícolas por productor
- **Informes detallados** de superficie trabajada por labor y zona
- **Gestión de registros** con funciones de editar/eliminar
- **Exportación a Excel** para análisis externos
- **Sistema de usuarios** con autenticación básica

## 📁 Estructura de Archivos

```
ingenio-mahuixtlan/
├── index.html          # Estructura HTML principal
├── styles.css          # Estilos CSS
├── app.js             # Lógica JavaScript
├── README.md          # Este archivo
└── .gitignore         # Archivos a ignorar en Git
```

## 🚀 Deployment en GitHub Pages

### Paso 1: Crear Repositorio en GitHub

1. Ve a [github.com](https://github.com) y crea una cuenta si no tienes una
2. Haz clic en "New repository" (botón verde)
3. Nombra tu repositorio: `ingenio-mahuixtlan-sistema`
4. Marca la opción "Public"
5. Marca "Add a README file"
6. Haz clic en "Create repository"

### Paso 2: Subir los Archivos

1. En tu repositorio, haz clic en "uploading an existing file"
2. Arrastra los archivos: `index.html`, `styles.css`, `app.js`
3. En el campo de commit escribe: "Primera versión del sistema"
4. Haz clic en "Commit changes"

### Paso 3: Activar GitHub Pages

1. En tu repositorio, ve a "Settings" (pestaña superior)
2. Busca "Pages" en el menú izquierdo
3. En "Source", selecciona "Deploy from a branch"
4. Selecciona "main" como branch
5. Deja "/ (root)" como folder
6. Haz clic en "Save"

### Paso 4: Acceder a tu Aplicación

En unos minutos tu aplicación estará disponible en:
`https://tu-usuario.github.io/ingenio-mahuixtlan-sistema/`

## 👤 Usuarios de Prueba

El sistema incluye estos usuarios predefinidos:

| Usuario | Contraseña | Descripción |
|---------|------------|-------------|
| `admin` | `admin123` | Administrador del sistema |
| `usuario` | `pass123` | Usuario estándar |
| `demo` | `demo` | Usuario de demostración |

## 💾 Almacenamiento de Datos

⚠️ **Importante**: Los datos se almacenan localmente en el navegador (localStorage). Para usar en producción, considera implementar:

- Base de datos en la nube (Firebase, MongoDB Atlas)
- Backend con API REST (Node.js, PHP, Python)
- Autenticación robusta

## 📊 Funcionalidades del Sistema

### Captura de Datos
- Datos del productor (ID, nombre, zona, campo, superficie)
- 22 tipos de labores agrícolas diferentes
- Validación de campos requeridos
- Observaciones adicionales

### Informes
- Estadísticas generales (superficie total, productores activos)
- Superficie trabajada por cada labor
- Avance por zona geográfica
- Comparativa por ciclo de cultivo (Plantilla/Soca/Resoca)

### Gestión de Datos
- Tabla con todos los registros
- Búsqueda en tiempo real
- Edición y eliminación de registros
- Exportación completa a CSV/Excel

## 🔧 Personalización

### Agregar Nuevas Labores
Edita el archivo `app.js` y modifica el objeto `laborNames` para incluir nuevas labores agrícolas.

### Cambiar Colores
Edita `styles.css` y busca `rgb(34,116,71)` para cambiar el color principal del sistema.

### Modificar Usuarios
En `app.js`, edita el objeto `validUsers` para cambiar usuarios y contraseñas.

## 📱 Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge (versiones recientes)
- ✅ Dispositivos móviles (responsive design)
- ✅ Tablets y desktop
- ❌ Internet Explorer (no compatible)

## 🔐 Seguridad

**Para uso en producción, implementa:**

1. **Autenticación robusta** con hash de contraseñas
2. **HTTPS** obligatorio
3. **Validación del lado del servidor**
4. **Backup automático** de datos
5. **Control de acceso por roles**

## 📞 Soporte

Para soporte técnico o modificaciones:
- Documenta cualquier error que encuentres
- Incluye capturas de pantalla si es necesario
- Especifica navegador y sistema operativo

## 📄 Licencia

Sistema desarrollado para uso interno del Ingenio Mahuixtlán - ZUCARMEX®.

---

**Versión:** 1.0  
**Última actualización:** Enero 2025  
**Desarrollado para:** Ingenio Mahuixtlán - Sistema de Avance Físico de Labores Agrícolas
