# Stack técnico

Basado en lo que ya usamos en Tidies24 (LoginServer + Web) y Descubrir Turismo (ApiNC6 + web), para mantener las mismas herramientas y convenciones.

## Repositorios

Separados, como en Tidies24:

- `Web-Autos/Web`: frontend Next.js y documentación general del proyecto.
- `Web-Autos/ApiCore`: backend .NET 10.

## Principios

- **Infraestructura propia.** Sin Vercel, Supabase ni servicios similares.
- **Toda la lógica y el acceso a datos pasan por el backend .NET.** A diferencia de Tidies24 y Descubrir Turismo, el frontend **no** accede a la base (sin Prisma en el front). Next.js solo consume la API.

## Backend: .NET 10

Mismo estilo que `Tidies24/LoginServer`.

- **Minimal APIs** (sin controllers ni MediatR). Endpoints agrupados en clases estáticas dentro de `Endpoints/`, registrados con métodos de extensión (`app.MapPedidos()`, `app.MapOfertas()`).
- **Rutas versionadas:** `/api/v1/...`. Endpoint `/health` que verifica la conexión a la base.
- **Acceso a datos:** MySqlConnector directo (`MySqlCommand` + reader), sin ORM ni Dapper, igual que LoginServer. Repositorios en `Data/`. Se eligió así por seguridad: un paquete de terceros menos y, si una columna no coincide, falla con error en vez de dejar el campo vacío sin avisar.
  - **Siempre parámetros** (`@nombre`). Nunca concatenar ni interpolar (`$"..."`) valores en el SQL. Lo único dinámico permitido son nombres de columna u orden tomados de una lista fija en el código (por ejemplo, un `switch` para el `ORDER BY` de los filtros).
  - **Dos usuarios de MySQL:** la API se conecta con uno que solo tiene `SELECT`/`INSERT`/`UPDATE`/`DELETE` sobre su base. Los scripts de `sql/` se corren con otro usuario que sí tiene `CREATE`/`ALTER`/`DROP`. Así, si la API queda comprometida, no puede borrar tablas ni cambiar el esquema.
  - MySQL no se expone a internet: solo escucha en la red interna de Docker.
- **Migraciones:** scripts SQL numerados a mano en `sql/` (`001_usuarios.sql`, `002_pedidos.sql`...). Un `SchemaCheck` valida la base al arrancar.
- **DTOs:** `sealed record` en `Models/`.
- **Clases:** primary constructors (`public sealed class PedidoRepository(Database db)`).
- **csproj:** `Nullable`, `ImplicitUsings`, `TreatWarningsAsErrors`.
- **Seguridad:**
  - Contraseñas con Argon2id (mismo `PasswordHasher` que LoginServer).
  - Sesión: token opaco guardado hasheado (SHA-256) en la base y enviado en cookie `httpOnly`. A definir si se usa JWT.
  - Rate limiting en login y en la creación de pedidos y ofertas.
  - Registro de intentos de login (`login_attempts`) con freno por IP y por usuario contando en la tabla, como `AttemptThrottle` de LoginServer.
  - **Geolocalización offline** con `GeoIpResolver` de LoginServer: país de la IP contra `GeoLite2-Country.mmdb` de MaxMind, nunca una API HTTP. Sin el archivo guarda `ZZ` y arranca igual. El país se congela al insertar. El `.mmdb` no va al repo (`*.mmdb` en `.gitignore`); en Docker se monta como volumen.
  - **IP real del cliente.** La mayoría de las llamadas a la API salen del contenedor de Next (Server Components y Server Actions), no del navegador. Sin cuidado, la API ve siempre la IP de la web y el rate limit y la geolocalización dejan de servir. La web reenvía la IP del usuario en `X-Forwarded-For` y la API solo lo acepta de redes de confianza (`ForwardedHeaders` con `KnownIPNetworks` de la red de Docker, configurado en `TrustedNetworks`, porque las IPs de los contenedores cambian).
  - **La API no se expone a internet.** Solo la llama el contenedor de Next (Server Components y Server Actions); el navegador nunca habla con ella. Por eso no hay CORS: si algún día hace falta exponerla, se agrega con orígenes explícitos.
  - Cabeceras de seguridad en todas las respuestas (`nosniff`, `X-Frame-Options`, CSP cerrada, `no-store`), cuerpo máximo de 1 MB y rate limit global por IP. HSTS lo pone nginx.
- **Configuración:** `appsettings.json` sin secretos + `appsettings.Local.json` (no versionado) + variables de entorno.
- **OpenAPI:** por ahora no. En .NET 10 requiere el paquete `Microsoft.AspNetCore.OpenApi`; se consulta si hace falta.

Estructura propuesta:

```
ApiCore/
├── Config/
├── Data/          (Database.cs, repositorios)
├── Endpoints/     (AuthEndpoints, PedidoEndpoints, OfertaEndpoints, AdminEndpoints)
├── Models/        (DTOs)
├── Security/      (PasswordHasher, sesiones, throttle)
├── sql/           (migraciones numeradas)
├── Program.cs
└── appsettings.json
```

## Base de datos: MySQL 8

La misma que Tidies24. Tablas y columnas en español, en `snake_case`.

## Frontend: Next.js

Mismo estilo que `Tidies24/Web`.

- **Next.js 16** (App Router) + React 19 + TypeScript (strict), código en `src/`.
- **UI:** Tailwind CSS y componentes propios (botón, input, card, modal) en `src/components/ui/`. Sin librerías de componentes.
- **Formularios:** nativos + Server Actions, validados con zod.
- **Datos:** fetch nativo hacia la API .NET. Server Components para leer y Server Actions para escribir.
- **Rutas en español**, en dos grupos de rutas (no cambian la URL):
  - `(publico)`: `/` (pestañas Buscar / Publicar pedido), `/vehiculos` y `/vehiculos/[id]` (catálogo, filtros en la URL), `/registro`, `/ingresar`. Header y footer del sitio.
  - `(panel)`: un solo layout para los tres roles; la navegación sale del rol de la sesión. Comprador: `/mis-pedidos`, `/mis-pedidos/nuevo`, `/mis-pedidos/[id]`. Revendedor: `/pedidos`, `/pedidos/[id]`, `/mis-ofertas`, `/mis-avisos`, `/mis-avisos/nuevo`. Admin: `/admin`, `/admin/usuarios` y "Contenido" (`/admin/pedidos`, `/admin/ofertas`, `/admin/avisos`, con pestañas). Todos: `/cuenta`.
- **Sesión:** `getSesion()` y `requireRol(...)` de `src/lib/sesion.ts`. Cada página del panel pide su rol (el layout no se vuelve a ejecutar al navegar). Es comodidad, no seguridad: la API es la que autoriza.
- **Modo claro y oscuro:** colores solo con tokens (`bg-primary`, `text-muted`...) definidos en `globals.css`; el oscuro redefine los mismos tokens. Por defecto sigue al sistema; el usuario puede forzarlo desde `/cuenta` o el footer. La elección va en la cookie `tema` y el servidor pone `data-theme` en `<html>`: sin parpadeo y sin script.
- **UI para gente de 25 a 50 años, no necesariamente técnica:** una acción principal por pantalla, textos de 16px o más, etiquetas siempre visibles arriba de los campos, estados escritos con palabras (el color solo refuerza), íconos siempre con texto, confirmación clara después de cada acción. En celular, barra de navegación abajo como en las apps. Listas cortas para elegir en vez de texto libre donde se pueda (marca, zona, años).
- **Organización:** componentes de cada ruta junto a la ruta (`src/app/<ruta>/components/`), compartidos en `src/components/`, helpers en `src/lib/`.
- **Llamadas a la API:** siempre con `apiFetch` de `src/lib/api.ts` (solo servidor). Reenvía la IP del usuario y usa `API_URL`, que no lleva `NEXT_PUBLIC_`.
- **Archivos** en kebab-case, componentes en PascalCase con named export.
- **Build:** `output: 'standalone'`.
- **Lint:** ESLint con la configuración básica de Next. Sin Prettier ni plugins extra.
- **Responsive, mobile-first.** Buena parte de compradores y revendedores va a entrar desde el celular. Se diseña primero para pantalla chica (clases de Tailwind sin prefijo) y se amplía con `sm:`/`md:`/`lg:`. Áreas táctiles de al menos 44px, inputs con el `type`/`inputMode` correcto (teclado numérico en precio, año y kilometraje), sin scroll horizontal y fotos con `next/image` en tamaños adaptados.

## Dependencias

Regla: **no agregar dependencias que no sean necesarias.** Si algo se resuelve con pocas líneas propias, se hace a mano.

| Proyecto | Producción | Solo desarrollo |
|---|---|---|
| Web | `next`, `react`, `react-dom`, `zod` | `typescript`, `@types/*`, `tailwindcss`, `@tailwindcss/postcss`, `eslint`, `eslint-config-next` |
| ApiCore | `MySqlConnector`, `Konscious.Security.Cryptography.Argon2`, `MaxMind.GeoIP2` | — |

Descartadas por ahora: Dapper (ver "Acceso a datos"), shadcn/ui y Radix, react-hook-form, SWR, sonner, lucide, Prettier, Swashbuckle y `server-only` (Next ya lo trae incluido). Si más adelante hace falta un componente complejo (select con búsqueda, modal accesible), se suma solo esa pieza.

## Imágenes

Fotos de los autos en las ofertas. Para el MVP puede alcanzar con ImgBB (como en Tidies24). Más adelante conviene almacenamiento propio en el servidor o un bucket compatible con S3, porque vamos a tener muchas fotos.

## Despliegue

- VPS propio con **Linux**. Todo corre en contenedores Linux, aunque se desarrolle en Windows:
  - Nombres de archivo case-sensitive: respetar mayúsculas en imports y rutas.
  - `Path.Combine` / `path.join` en vez de separadores escritos a mano.
  - Zonas horarias con IDs IANA (`America/Argentina/Buenos_Aires`), no los de Windows.
  - `.gitattributes` con `* text=auto eol=lf` en ambos repos, para que `Dockerfile`, scripts `.sh` y SQL no fallen por CRLF.
- Docker: un contenedor para la API (multi-stage, imagen final `aspnet:10.0-noble-chiseled-extra`: sin shell y sin root) y otro para la web (multi-stage `node` con standalone).
- `docker-compose` con MySQL, API, web y nginx: pendiente para el paso de despliegue. **Docker es solo para el servidor.**
- **Desarrollo local en Windows, sin Docker ni Linux.** La API corre con `dotnet run` (o `iniciar-api.bat`) contra una instancia propia de MySQL 8 como servicio de Windows, y la web con `npm run dev`. Todo el código tiene que funcionar igual en Windows y en Linux: nada que dependa solo de uno de los dos.
- Reverse proxy (nginx) delante de la web, con HSTS y `X-Real-IP` escrito con la IP de la conexión (pisando lo que mande el cliente). La API y MySQL quedan solo en la red interna de Docker.

## Convenciones

- **Dominio en español:** pedidos, ofertas, revendedores, compradores.
- **.NET:** identificadores técnicos en inglés al estilo C#; comentarios y mensajes en español.
- **Comentarios:** en español, explicando el porqué.
- **Secretos** nunca en archivos versionados.
