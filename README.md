# Ruedaro

Sitio: [ruedaro.com.ar](https://ruedaro.com.ar).

Plataforma de compraventa de vehículos (autos, motos, camiones y utilitarios, lanchas) enfocada en revendedores.

La diferencia con los clasificados tradicionales: **el comprador publica qué auto busca y los revendedores le hacen ofertas.** Además, los revendedores publican sus vehículos en un catálogo (pestaña "Buscar").

## Estado

La web funciona completa contra la API: portada, catálogo, registro, ingreso y los tres paneles (comprador, revendedor y administración), con modo claro y oscuro. Lo que falta:

- **Fotos:** todavía no se suben; las tarjetas muestran el ícono del tipo.
- **Paginado:** los listados muestran hasta 100.
- **Filtro de precio:** es en dólares; lo publicado en pesos no aparece con ese filtro puesto.
- **Avisos de ofertas nuevas:** el comprador todavía tiene que entrar a mirar.

Para que la web funcione, la API tiene que estar corriendo (`ApiCore\iniciar-api.bat`). Para ver el panel de administración, hay que pasar una cuenta a admin en la base (ver el README de ApiCore).

## Correr en desarrollo (Windows)

Doble clic en **`iniciar-web.bat`**: instala las dependencias la primera vez, crea `.env.local` y levanta la web en http://localhost:3000. A mano:

```bash
npm install
cp .env.example .env.local   # API_URL de la API .NET
npm run dev
```

Para recorrer: prendé la API (`ApiCore\iniciar-api.bat`) y después la web. "Publicar pedido" en la portada lleva al registro; elegí "Particular" o "Agencia o revendedor". Para probar el otro rol, creá otra cuenta.

## Pantallas

| Ruta | Quién | Qué hace |
|---|---|---|
| `/` | Todos | Portada: qué es, cómo funciona, para revendedores |
| `/vehiculos/agencias`, `/vehiculos/particulares` | Todos | Catálogo ("Buscar") en dos secciones: carrusel de destacados, pestañas por tipo y filtros |
| `/vehiculos/[id]` | Todos | Detalle y consulta por WhatsApp |
| `/registro`, `/ingresar` | Todos | Crear cuenta (eligiendo rol) y entrar |
| `/mis-pedidos` | Particular | Sus pedidos, activos y cerrados |
| `/mis-pedidos/nuevo` | Particular | Publicar un pedido |
| `/mis-pedidos/[id]` | Particular | Ofertas recibidas, WhatsApp, cerrar pedido |
| `/pedidos` | Agencia | Pedidos de compradores, con filtros |
| `/pedidos/[id]` | Agencia | Detalle y formulario de oferta |
| `/mis-ofertas` | Agencia | Ofertas enviadas y su estado |
| `/mis-avisos`, `/mis-avisos/nuevo` | Particular y agencia | Sus vehículos: publicar (con patente), destacar, pausar, marcar vendido |
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
