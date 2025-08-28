# ✨ Hilosaki - E-commerce de Belleza y Bienestar

[![React](https://img.shields.io/badge/React-18.0.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-blue.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green.svg)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployment-black.svg)](https://vercel.com/)

## 🎯 Descripción del Proyecto

**Hilosaki** es una plataforma de e-commerce moderna y elegante especializada en productos de belleza y servicios de bienestar. La aplicación ofrece una experiencia de compra fluida y personalizada para mujeres modernas que buscan productos premium y servicios especializados.

## ✨ Características Principales

### 🛍️ **E-commerce Completo**
- Catálogo de productos con categorías organizadas
- Sistema de carrito de compras intuitivo
- Proceso de checkout optimizado
- Gestión de pedidos en tiempo real

### 🎨 **Diseño y UX**
- Interfaz moderna y responsiva
- Diseño adaptativo para móvil y desktop
- Animaciones fluidas con Framer Motion
- Paleta de colores elegante (rosa, púrpura, rosa)

### 🔐 **Sistema de Autenticación**
- Registro e inicio de sesión de usuarios
- Panel de administración protegido
- Gestión de roles (usuario/admin)
- Autenticación segura con Supabase

### 👑 **Panel de Administración**
- Dashboard con estadísticas en tiempo real
- Gestión completa de productos
- Administración de categorías
- Control de pedidos y usuarios
- Sistema de notificaciones

### 📱 **Responsive Design**
- Optimizado para dispositivos móviles
- Navegación adaptativa
- Componentes UI responsivos
- Experiencia consistente en todas las pantallas

## 🚀 Tecnologías Utilizadas

### **Frontend**
- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para mayor robustez
- **Tailwind CSS** - Framework CSS utility-first
- **Framer Motion** - Animaciones y transiciones
- **React Router** - Enrutamiento del lado del cliente
- **React Hot Toast** - Notificaciones elegantes

### **Backend & Base de Datos**
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Base de datos relacional
- **Row Level Security** - Seguridad a nivel de fila
- **Edge Functions** - Funciones serverless

### **Herramientas de Desarrollo**
- **Vite** - Build tool rápido
- **ESLint** - Linting de código
- **PostCSS** - Procesamiento de CSS
- **Git** - Control de versiones

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── admin/          # Panel de administración
│   ├── auth/           # Autenticación
│   ├── cart/           # Carrito de compras
│   ├── layout/         # Componentes de layout
│   ├── products/       # Gestión de productos
│   ├── services/       # Servicios ofrecidos
│   └── ui/             # Componentes UI base
├── hooks/               # Custom hooks
├── lib/                 # Configuraciones y utilidades
├── utils/               # Funciones auxiliares
└── App.tsx             # Componente principal
```

## 🛠️ Instalación y Configuración

### **Prerrequisitos**
- Node.js 18+ 
- npm o yarn
- Cuenta en Supabase

### **1. Clonar el repositorio**
```bash
git clone https://github.com/HectorSandate/Hilosaki.git
cd Hilosaki
```

### **2. Instalar dependencias**
```bash
npm install
```

### **3. Configurar variables de entorno**
Crea un archivo `.env.local` en la raíz del proyecto:
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### **4. Ejecutar en desarrollo**
```bash
npm run dev
```

### **5. Construir para producción**
```bash
npm run build
```

## 🌐 Despliegue

### **Vercel (Recomendado)**
1. Conecta tu repositorio de GitHub a Vercel
2. Configura las variables de entorno
3. Deploy automático en cada push

### **GitLab Pages**
1. Configura CI/CD en GitLab
2. Build y deploy automático
3. Configuración de dominio personalizado

## 📱 Funcionalidades por Rol

### **👤 Usuario Regular**
- Navegación por productos y servicios
- Agregar productos al carrito
- Proceso de checkout
- Historial de pedidos
- Gestión de perfil

### **👑 Administrador**
- Dashboard completo con estadísticas
- CRUD de productos y categorías
- Gestión de pedidos
- Administración de usuarios
- Reportes y analytics

## 🎨 Paleta de Colores

- **Primario**: Rosa (#EC4899, #F43F5E)
- **Secundario**: Púrpura (#8B5CF6, #A855F7)
- **Acentos**: Rosa claro (#FCE7F3, #FDF2F8)
- **Neutros**: Grises (#6B7280, #9CA3AF)

## 🔒 Seguridad

- Autenticación JWT con Supabase
- Row Level Security (RLS)
- Validación de roles y permisos
- Sanitización de inputs
- HTTPS obligatorio en producción

## 📊 Estado del Proyecto

- ✅ **Frontend**: Completado
- ✅ **Backend**: Completado
- ✅ **Base de Datos**: Configurada
- ✅ **Autenticación**: Implementada
- ✅ **Panel Admin**: Funcional
- ✅ **Responsive**: Optimizado
- ✅ **Deploy**: Configurado

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Hector Sandate**
- GitHub: [@HectorSandate](https://github.com/HectorSandate)
- GitLab: [@hectorsandate1](https://gitlab.com/hectorsandate1)

## 🙏 Agradecimientos

- **Supabase** por la infraestructura backend
- **Tailwind CSS** por el framework de estilos
- **Framer Motion** por las animaciones
- **React Team** por la biblioteca principal

## 📞 Soporte

Si tienes alguna pregunta o necesitas ayuda:
- Abre un issue en GitHub
- Contacta a través de GitLab
- Email: [tu-email@ejemplo.com]

---

<div align="center">
  <p>✨ <strong>Hilosaki</strong> - Belleza y bienestar para la mujer moderna ✨</p>
  <p>Made with ❤️ and ☕</p>
</div>
