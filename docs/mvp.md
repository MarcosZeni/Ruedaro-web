# MVP (primera versión)

Objetivo: lo mínimo para validar que los compradores publican pedidos y que los revendedores ofertan.

## Roles

- **Comprador:** publica pedidos y recibe ofertas.
- **Revendedor:** ve pedidos, oferta y publica sus vehículos en el catálogo.
- **Administrador:** modera usuarios, pedidos, ofertas y avisos del catálogo.

## Tipos de vehículo

Decidido el 30/09/2026: autos y camionetas, motos, camiones y utilitarios, y lanchas. Es el primer filtro en todo el sitio (pestañas). Cada tipo tiene su lista de marcas; en las lanchas el uso se mide en horas de motor en vez de kilómetros.

## Dos pestañas

- **Buscar:** catálogo de vehículos en venta, en **dos secciones separadas**: **Agencias** (revendedores) y **Particulares** (dueños), cada una con su carrusel de destacados y su listado (decidido el 01/10/2026). Público, sin cuenta. Entró al MVP el 30/09/2026.
- **Publicar:** el comprador publica qué busca (pedido) y recibe ofertas. Es el diferencial.

## Reglas de los avisos (01/10/2026)

- **Publican particulares y agencias**, sin límite de avisos. En pantalla los roles se llaman "Particular" y "Agencia" (en la base siguen siendo `comprador` y `revendedor`).
- **Patente obligatoria** (matrícula en lanchas), única entre avisos vigentes: evita publicar el mismo vehículo varias veces y que alguien publique uno ajeno. Si ya existe, aparece un aviso que lo explica. **No se muestra al público**; la ven el dueño y los admins.
- **Destacados:** 1 gratis por usuario, hasta 10 con el plan (ver negocio.md). El carrusel muestra hasta 10 al azar entre los destacados de esa sección y, si faltan, se completa con otros avisos. Pasa solo cada 5 segundos.
- **Multas y deudas:** decidido no consultarlas desde el sitio (01/10/2026). Los organismos no tienen API abierta (portales con captcha) y los proveedores privados cobran por consulta. El detalle del vehículo y las ofertas muestran un consejo: pedirle la patente al vendedor y revisar multas, deuda, prendas y embargos en los sitios oficiales antes de señar.
- **Dólar oficial del BCRA:** todo monto (pedido, oferta, aviso) guarda su equivalente en dólares y la cotización usada al publicarlo. Se muestra "≈ USD 9.888 · dólar a $1.517 al publicar", y el filtro de precio compara pesos y dólares juntos.

## Funciones

1. Registro e inicio de sesión con elección de rol (comprador o revendedor).
2. **Publicar pedido:** tipo de vehículo, marca, modelo, rango de años, presupuesto, zona y comentarios.
3. **Listado de pedidos** para revendedores, con filtros (tipo, zona, marca, presupuesto).
4. **Ofertar:** el revendedor responde a un pedido con fotos, precio, datos del vehículo y link.
5. **Ver ofertas:** el comprador compara las ofertas recibidas en su pedido.
6. **Contacto:** botón de WhatsApp entre comprador y revendedor.
7. **Panel de administración** para moderar.
8. **Catálogo:** el revendedor publica sus vehículos (fotos, precio, datos); cualquiera los busca por tipo, marca, zona, precio y año, y consulta por WhatsApp.

## Reglas

- Límite de ofertas por pedido, para evitar spam al comprador.
- Un revendedor oferta una sola vez por pedido.
- El pedido se puede cerrar (ya lo encontré / ya no busco).

## Fuera del MVP

- Pagos, créditos y planes.
- Verificación de revendedores (DNI, CUIT) y reseñas.
- Chat interno (se usa WhatsApp).
- Publicidad en redes para revendedores.

## Stack técnico

Backend .NET 10 + MySQL 8, frontend Next.js, todo en infraestructura propia. Detalle en [stack.md](stack.md).
