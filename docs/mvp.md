# MVP (primera versión)

Objetivo: lo mínimo para validar que los compradores publican pedidos y que los revendedores ofertan.

## Roles

- **Comprador:** publica pedidos y recibe ofertas.
- **Revendedor:** ve pedidos, oferta y publica sus vehículos en el catálogo.
- **Administrador:** modera usuarios, pedidos, ofertas y avisos del catálogo.

## Tipos de vehículo

Decidido el 30/09/2026: autos y camionetas, motos, camiones y utilitarios, y lanchas. Es el primer filtro en todo el sitio (pestañas). Cada tipo tiene su lista de marcas; en las lanchas el uso se mide en horas de motor en vez de kilómetros.

## Dos pestañas

- **Buscar:** catálogo de los vehículos que publican los revendedores. Público, sin cuenta. Entró al MVP el 30/09/2026 (antes estaba afuera).
- **Publicar:** el comprador publica qué busca (pedido) y recibe ofertas. Es el diferencial.

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
