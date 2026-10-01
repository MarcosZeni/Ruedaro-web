# pedidos-autos (nombre provisorio)

Plataforma de compraventa de vehículos (autos, motos, camiones y utilitarios, lanchas) enfocada en revendedores.

La diferencia con los clasificados tradicionales: **el comprador publica qué auto busca y los revendedores le hacen ofertas.** Además, los revendedores publican sus vehículos en un catálogo (pestaña "Buscar").

## Estado

La web está completa como **demostración navegable**: portada, registro, ingreso y los tres paneles (comprador, revendedor y administración), con modo claro y oscuro. Todavía no está conectada a la API:

- Los datos salen de `src/lib/demo-data.ts`. Cada función tiene la forma que va a tener la llamada a la API, para reemplazarla sin tocar las páginas.
- La "sesión" es una cookie con el rol (`src/lib/sesion.ts`). No hay usuarios ni contraseñas reales.
- Publicar, ofertar, guardar la cuenta y moderar muestran la confirmación pero no guardan nada.
- Un aviso amarillo en los paneles lo recuerda y permite cambiar de rol para recorrer todo.

La API (`ApiCore`) tiene la base: `/health`, verificación del schema y la tabla `usuarios`.

## Correr en desarrollo (Windows)

Doble clic en **`iniciar-web.bat`**: instala las dependencias la primera vez, crea `.env.local` y levanta la web en http://localhost:3000. A mano:

```bash
npm install
cp .env.example .env.local   # API_URL de la API .NET
npm run dev
```

Para recorrer la demo: "Publicar pedido" en la portada lleva al registro; elegí "Busco un auto" o "Vendo autos". Desde el aviso amarillo de los paneles se cambia de rol (incluido administración).

## Pantallas

| Ruta | Quién | Qué hace |
|---|---|---|
| `/` | Todos | Portada: qué es, cómo funciona, para revendedores |
| `/vehiculos` | Todos | Catálogo ("Buscar"): pestañas por tipo y filtros |
| `/vehiculos/[id]` | Todos | Detalle y consulta por WhatsApp |
| `/registro`, `/ingresar` | Todos | Crear cuenta (eligiendo rol) y entrar |
| `/mis-pedidos` | Comprador | Sus pedidos, activos y cerrados |
| `/mis-pedidos/nuevo` | Comprador | Publicar un pedido |
| `/mis-pedidos/[id]` | Comprador | Ofertas recibidas, WhatsApp, cerrar pedido |
| `/pedidos` | Revendedor | Pedidos de compradores, con filtros |
| `/pedidos/[id]` | Revendedor | Detalle y formulario de oferta |
| `/mis-ofertas` | Revendedor | Ofertas enviadas y su estado |
| `/mis-avisos`, `/mis-avisos/nuevo` | Revendedor | Sus vehículos en el catálogo: publicar, pausar, marcar vendido |
| `/admin` | Admin | Resumen |
| `/admin/usuarios` | Admin | Moderación de usuarios |
| `/admin/pedidos`, `/admin/ofertas`, `/admin/avisos` | Admin | "Contenido": moderación, con pestañas |
| `/cuenta` | Todos con sesión | Datos, WhatsApp, tema y cerrar sesión |

## Documentación

- [Idea y competencia](docs/idea.md): concepto, diferencial y qué existe hoy en el mercado.
- [Modelo de negocio](docs/negocio.md): cómo generar ingresos, riesgos y cómo arrancar.
- [MVP](docs/mvp.md): alcance de la primera versión y pantallas.
- [Stack técnico](docs/stack.md): tecnologías, estructura y convenciones.
- [Nombres y dominios](docs/nombres.md): opciones de nombre y disponibilidad de dominios.

## Decisiones tomadas

- **Nombre:** provisorio (`pedidos-autos`) hasta elegir marca definitiva.
- **Repositorios:** separados. Este (`Web`) tiene el frontend y la documentación; el backend va en `ApiCore`. Los dos privados, sin licencia (todos los derechos reservados). Es un producto comercial y el código no se comparte.
- **Infraestructura:** propia. Sin Vercel ni Supabase.
- **Stack:** backend .NET 10 (Minimal APIs) + MySQL 8, frontend Next.js + TypeScript + Tailwind, con el mínimo de dependencias. El frontend no accede a la base; todo pasa por la API.
- **Foco:** el pedido del comprador es el centro del producto. El catálogo de revendedores entra en el MVP como la pestaña "Buscar", pero el diferencial sigue siendo el pedido.
- **Tipos de vehículo:** autos y camionetas, motos, camiones y utilitarios, lanchas.
