# Koxol backend (Node + TypeScript + Prisma + MySQL)

Este backend es un scaffold mínimo para manejar autenticación, pedidos, membresías y productos.

Pasos rápidos para arrancar (local)

1. Instala dependencias:

```bash
cd backend
npm install
```

2. Copia el .env.example a .env y ajusta `DATABASE_URL` y `JWT_SECRET`.

3. Genera Prisma Client y ejecuta migración:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

4. Ejecuta en modo desarrollo:

```bash
npm run dev
```

Endpoints expuestos (resumen)
- GET /health
- POST /api/auth/register
- POST /api/auth/login
- GET /api/products
- POST /api/orders
- GET /api/orders?mine=true
- PATCH /api/orders/:id/confirm (admin)
- POST /api/memberships/redeem

Integración con frontend
- Ajusta `VITE_API_BASE` en tu frontend para apuntar a `http://localhost:4000`.
- `AuthContext` debe guardar el token devuelto por `/api/auth/login` y usarlo en Authorization header para llamadas protegidas.
