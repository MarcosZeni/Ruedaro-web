# pedidos-autos (nombre provisorio)

Marketplace de compraventa de vehículos (autos y camionetas, motos, camiones y utilitarios, lanchas) enfocado en revendedores (Argentina). Diferencial: **el comprador publica qué busca y los revendedores le ofertan.** Dos pestañas: **Buscar** (catálogo en dos secciones separadas, Agencias y Particulares) y **Publicar** (pedido del comprador). Negocio: destacados en el carrusel (1 gratis, 10 con plan pago que activa el admin). Reglas en `docs/mvp.md`.

## Repositorios

Carpeta de trabajo `D:\Github\Web-Autos\`, con dos repos separados (privados, sin licencia):

- `Web/`: frontend Next.js + documentación general del proyecto (este repo).
- `ApiCore/`: backend .NET 10.

## Documentación (leer antes de trabajar)

- `docs/idea.md`: concepto, diferencial y competencia (MercadoLibre, deRuedas, Kavak).
- `docs/negocio.md`: monetización, riesgos y cómo arrancar.
- `docs/mvp.md`: alcance del MVP, roles, funciones y reglas.
- `docs/stack.md`: stack, estructura, dependencias y convenciones. **Fuente de verdad técnica.**
- `docs/nombres.md`: nombres candidatos y dominios consultados (candidato principal: Loconsigo, `.com.ar` y `.ar` libres al 30/09/2026).

## Reglas del proyecto

- **Mínimo de dependencias.** No agregar paquetes si se resuelve con pocas líneas propias. Lista permitida en `docs/stack.md`; cualquier dependencia nueva se consulta antes.
- **Infraestructura propia.** Nada de Vercel, Supabase ni servicios administrados similares. En producción, VPS **Linux** con Docker y nginx.
- **Desarrollo local en Windows, sin Docker ni Linux.** La API tiene que poder correr con `dotnet run` en Windows contra un MySQL local. Cuidar case-sensitivity, finales de línea LF y zonas horarias IANA para que funcione igual en los dos.
- **Web responsive, mobile-first.** Tiene que funcionar bien desde el celular.
- **UI muy simple e intuitiva.** Los usuarios tienen entre 25 y 50 años y no son necesariamente técnicos. Criterios concretos en `docs/stack.md` (Frontend).
- **El frontend no accede a la base.** Todo pasa por la API .NET (sin Prisma en el front).
- **Base de datos MySQL 8.** Migraciones como scripts SQL numerados a mano en `ApiCore/sql/`; nada de EF Migrations.
- **Secretos** nunca en archivos versionados (`appsettings.Local.json` y `.env*` fuera de git).

## Convenciones

Tomadas de los proyectos existentes del usuario (`D:\Github\Tidies24\LoginServer` y `Tidies24\Web`), que sirven de referencia:

- Dominio en español: pedidos, ofertas, revendedores, compradores. Rutas de URL en español.
- .NET: identificadores técnicos en inglés al estilo C#, comentarios y mensajes en español. Minimal APIs en `Endpoints/`, repositorios en `Data/`, DTOs `sealed record`, primary constructors.
- Front: archivos en kebab-case, componentes PascalCase con named export, componentes de ruta junto a la ruta.
- Comentarios en español explicando el porqué.

## Usuario

- Habla español rioplatense; responder en español.
- Desarrollador .NET y Next.js.
- Commits solo cuando lo pide.

## Estado (30/09/2026)

- Base de los dos proyectos creada, **sin commitear** (ni la documentación).
- ApiCore: Minimal API con `/health`, `SchemaCheck` al arrancar, IP real vía `TrustedNetworks`, rate limit global, cabeceras de seguridad, Dockerfile chiseled. SQL: `000` (base y dos usuarios de MySQL con contraseña aleatoria) y `001_usuarios`. Probada contra MySQL real (200 en `/health`).
- MySQL local: instancia propia `MySQL8Autos` en `127.0.0.1:3308` (`D:\MySQL\my-3308.ini`, datos en `D:\MySQL\data3308`, claves en `D:\MySQL\credenciales-3308.txt`). `000` y `001` ya aplicados. `ApiCore\iniciar-api.bat` prende la base (`iniciar-mysql.bat`, que instala el servicio con UAC la primera vez) y después la API.
- Web: Next.js 16 + React 19 + Tailwind 4 en `src/`, `output: standalone`, cabeceras de seguridad, `src/lib/api.ts` (`apiFetch`, solo servidor). Build y lint OK.
- Web, estructura y portada: estilo claro con índigo como color principal (tokens en `globals.css`: `primary`, `muted`, `surface`, `border`...). Componentes `Button`/`ButtonLink` y `Card` en `src/components/ui/`, header con menú móvil (`mobile-menu.tsx`, único componente cliente), footer, portada y 404 en español. Nombre del sitio en `src/lib/site.ts` (Loconsigo, provisorio). `iniciar-web.bat` levanta `npm run dev`. Probado a 360 y 390 px sin scroll horizontal.
- Web completa como **demo navegable** (sin API): portada, `/registro`, `/ingresar`, paneles de comprador, revendedor y admin, `/cuenta`, modo claro/oscuro (cookie `tema`). Grupos `(publico)` y `(panel)`.
  - **Todo es real, sin datos de ejemplo**: registro, sesión, Mi cuenta, pedidos, ofertas, avisos del catálogo y moderación van contra la API. Lecturas en `src/lib/datos.ts`, escrituras en `src/lib/contenido-actions.ts` y `src/lib/sesion-actions.ts`. Formularios largos con `ActionForm` (muestra el error de la API, marca el campo y no borra lo escrito). Admin: `UPDATE usuarios SET rol = 'admin' WHERE email = '...'`.
  - `MAX_OFERTAS_POR_PEDIDO = 10` provisorio (en `ApiCore/Models/Catalogo.cs` y `src/lib/catalogo.ts`; las listas de tipos, marcas y zonas están en los dos lados y hay que cambiarlas juntas).
  - Tipos de vehículo (`auto`, `moto`, `camion`, `lancha`) en `src/lib/catalogo.ts`: marcas por tipo y uso en km (u horas de motor en lanchas, campo `uso`). Publicar pedido y aviso arrancan eligiendo el tipo.
  - Catálogo público `/vehiculos` (pestañas por tipo + filtros) y `/vehiculos/[id]` con WhatsApp. Revendedor: `/mis-avisos`. Admin: "Contenido" con pestañas pedidos/ofertas/avisos.
  - Falta: fotos (los formularios dicen "muy pronto"), cambiar y recuperar contraseña, paginado (listados con tope de 100), cotización para filtrar pesos y dólares juntos, avisos por email/WhatsApp de ofertas nuevas.
- ApiCore con auth: Argon2id + HashGate + GeoIpResolver (de LoginServer), sesiones opacas (SHA-256 en `sesiones`), `login_attempts` con freno por IP y por email, `.RequireSesion()`. SQL `002_sesiones` y `003_login_attempts` aplicados en la base local. `GeoLite2-Country.mmdb` copiado al lado del `.csproj` (fuera de git).
- ApiCore con contenido: SQL `004_pedidos`, `005_ofertas`, `006_publicaciones` aplicados en la base local. Endpoints de catálogo, comprador, revendedor y admin con `.RequireRol(...)`.
- 01/10/2026: dólar oficial BCRA (SQL `007`), patente única y destacados con plan (SQL `008`), dos secciones de catálogo, carruseles, roles en pantalla "Particular"/"Agencia". Aplicado en la base local.
- **Próximo paso:** a definir con el usuario (candidatos: fotos, avisos de ofertas nuevas, cruce catálogo↔pedidos, Mercado Pago para el plan).

## Next.js

@AGENTS.md
