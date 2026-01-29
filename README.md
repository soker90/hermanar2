# Hermanar - Sistema de Gestión de Hermandades

<div align="center">

![Hermanar Logo](./assets/demo.png)

**Sistema moderno de gestión para hermandades y cofradías**

[![Tauri](https://img.shields.io/badge/Tauri-2.0-blue.svg)](https://tauri.app)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://typescriptlang.org)
[![Rust](https://img.shields.io/badge/Rust-1.70+-orange.svg)](https://rust-lang.org)

[Características](#características) • [Instalación](#instalación) • [Desarrollo](#desarrollo) • [Compilación](#compilación)

</div>

---

## 📋 Descripción

Hermanar es una aplicación de escritorio multiplataforma diseñada para facilitar la gestión administrativa de hermandades y cofradías. Permite llevar un control completo de hermanos, familias y cuotas de manera eficiente y segura.

## ✨ Características

### 👥 Gestión de Hermanos

- ✅ Registro completo de hermanos con datos personales y de contacto
- ✅ Control de estado (activo/inactivo)
- ✅ Asignación a familias
- ✅ Vista detallada de información individual
- ✅ Búsqueda y filtrado avanzado

### 🏠 Gestión de Familias

- ✅ Organización de hermanos por unidades familiares
- ✅ Dirección principal de contacto
- ✅ Gestión de miembros de cada familia

### 💶 Gestión de Cuotas

- ✅ Generación automática de cuotas anuales
- ✅ Control de pagos y pendientes
- ✅ Pago masivo de cuotas
- ✅ Dashboard con estadísticas detalladas
- ✅ Filtrado por año y estado de pago
- ✅ Registro de método de pago y observaciones

### 📊 Panel de Control

- ✅ Estadísticas en tiempo real
- ✅ Resumen de hermanos activos/inactivos
- ✅ Métricas de cuotas del año actual
- ✅ Porcentaje de recaudación

## 🚀 Instalación

### Descarga Directa

Descarga la última versión desde la [página de releases](https://github.com/tu-usuario/hermanar2/releases):

- **Windows**: `Hermanar_x.x.x_x64-setup.exe`
- **Linux**: `hermanar_x.x.x_amd64.AppImage` o `.deb`
- **macOS**: `Hermanar_x.x.x_x64.dmg` (Intel) o `Hermanar_x.x.x_aarch64.dmg` (Apple Silicon)

### Requisitos del Sistema

- **Windows**: Windows 10/11 con WebView2
- **Linux**: Distribución moderna con GTK 3 y WebKit2GTK
- **macOS**: macOS 10.15+ (Catalina o superior)

## 💻 Desarrollo

### Prerrequisitos

- [Node.js](https://nodejs.org) 20 o superior
- [pnpm](https://pnpm.io) 9 o superior
- [Rust](https://rustup.rs) 1.70 o superior
- Dependencias específicas de [Tauri](https://tauri.app/v1/guides/getting-started/prerequisites)

### Configuración del Entorno

1. **Clonar el repositorio**

    ```bash
    git clone https://github.com/tu-usuario/hermanar2.git
    cd hermanar2
    ```

2. **Instalar dependencias**

    ```bash
    pnpm install
    ```

3. **Iniciar en modo desarrollo**
    ```bash
    pnpm dev
    ```

La aplicación se abrirá automáticamente en modo desarrollo con hot-reload.

## 🔨 Compilación

### Compilar para tu plataforma

```bash
pnpm tauri build
```

El ejecutable se generará en `src-tauri/target/release/bundle/`

### Compilación cruzada

**Para Windows (desde Linux):**

```bash
pnpm tauri build --target x86_64-pc-windows-gnu
```

**Para macOS (Apple Silicon):**

```bash
pnpm tauri build --target aarch64-apple-darwin
```

**Para macOS (Intel):**

```bash
pnpm tauri build --target x86_64-apple-darwin
```

## 🛠️ Tecnologías

### Frontend

- **React 19** - Biblioteca de UI
- **React Router 7** - Enrutamiento
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Estilos
- **Vite** - Build tool
- **Lucide React** - Iconos

### Backend

- **Tauri 2** - Framework de aplicaciones de escritorio
- **Rust** - Lenguaje del backend
- **SQLite** - Base de datos local
- **Rusqlite** - Driver de SQLite para Rust

### Herramientas de Desarrollo

- **ESLint 9** - Linter
- **Prettier** - Formateador de código
- **Husky** - Git hooks
- **Lint-staged** - Pre-commit hooks

## 📁 Estructura del Proyecto

```
hermanar2/
├── src/                      # Código frontend
│   ├── app/
│   │   ├── routes/          # Rutas de la aplicación
│   │   │   ├── hermanos/    # Módulo de hermanos
│   │   │   ├── familias/    # Módulo de familias
│   │   │   └── cuotas/      # Módulo de cuotas
│   │   ├── global.css       # Estilos globales
│   │   └── router.tsx       # Configuración de rutas
│   ├── components/
│   │   └── ui/              # Componentes UI reutilizables
│   ├── lib/                 # Utilidades
│   └── types/               # Definiciones TypeScript
├── src-tauri/               # Código backend (Rust)
│   ├── src/
│   │   ├── commands.rs      # Comandos Tauri
│   │   ├── db/              # Módulos de base de datos
│   │   └── main.rs          # Punto de entrada
│   └── tauri.conf.json      # Configuración de Tauri
└── .github/
    └── workflows/           # GitHub Actions para CI/CD
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu funcionalidad (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Inicia la app en modo desarrollo
pnpm dev-web          # Solo el servidor web (sin Tauri)

# Compilación
pnpm build            # Compila el frontend
pnpm tauri build      # Compila la aplicación completa

# Calidad de código
pnpm lint             # Ejecuta ESLint
pnpm format           # Formatea el código con Prettier
pnpm type-check       # Verifica tipos TypeScript
```

## 📄 Base de Datos

La aplicación utiliza SQLite para almacenar todos los datos de forma local. La base de datos se crea automáticamente en la primera ejecución y se almacena en:

- **Windows**: `%APPDATA%\com.hermanar.app\hermanar.db`
- **Linux**: `~/.local/share/com.hermanar.app/hermanar.db`
- **macOS**: `~/Library/Application Support/com.hermanar.app/hermanar.db`

### Esquema de Base de Datos

- **hermanos**: Información de hermanos
- **familias**: Grupos familiares
- **cuotas**: Registro de cuotas y pagos

## 🔒 Seguridad y Privacidad

- ✅ Todos los datos se almacenan localmente
- ✅ No se envía información a servidores externos
- ✅ La aplicación funciona completamente offline
- ✅ Base de datos encriptable (próximamente)

## 🐛 Reporte de Errores

Si encuentras un error, por favor [abre un issue](https://github.com/tu-usuario/hermanar2/issues) con:

- Descripción detallada del problema
- Pasos para reproducirlo
- Sistema operativo y versión de la aplicación
- Capturas de pantalla si es posible

## 📜 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

Desarrollado con ❤️ para la gestión eficiente de hermandades y cofradías.

---

<div align="center">

**[⬆ Volver arriba](#hermanar---sistema-de-gestión-de-hermandades)**

</div>
