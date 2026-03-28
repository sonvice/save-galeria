# Galería de Imágenes

Galería de fotos construida con Vite + Vanilla JS que consume la API de [Picsum Photos](https://picsum.photos). Permite explorar, guardar y gestionar imágenes favoritas.

![preview](public/images/hero-desktop.jpg)

## Funcionalidades

- Explorar 15 páginas de fotos (30 por página)
- Añadir/quitar favoritos con toggle desde la galería
- Vista dedicada de favoritos con confirmación al eliminar
- Favoritos persistidos en `localStorage`
- Carga lazy de imágenes

## Tecnologías

- [Vite](https://vite.dev) — build tool y dev server
- Vanilla JS con ES Modules
- CSS custom properties + fluid typography (Utopia)
- Picsum Photos API

## Instalación

```bash
# 1. Clona el repositorio
git clone https://github.com/sonvice/save-galeria.git
cd save-galeria

# 2. Instala dependencias
npm install

# 3. Inicia el servidor de desarrollo
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en el navegador.

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Preview del build de producción |

## Estructura del proyecto

```
├── index.html
├── public/
│   └── images/          # Imágenes estáticas (hero, etc.)
└── src/
    ├── main.js           # Punto de entrada
    ├── style.css
    └── modules/
        ├── api.js        # Fetch a Picsum con validación
        ├── constants.js  # Configuración centralizada
        ├── dom.js        # Renderizado seguro (sin innerHTML)
        ├── icons.js      # SVGs creados via DOM API
        └── storage.js    # localStorage con sanitización
```
