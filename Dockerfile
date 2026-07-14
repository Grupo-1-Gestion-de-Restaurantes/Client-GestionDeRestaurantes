# =============================================================================
# Client-GestionDeRestaurantes (Admin SPA) — Vite multi-stage
# Build context: ./Client-GestionDeRestaurantes
# VITE_* se inyectan en BUILD (no en runtime de nginx)
# =============================================================================

FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.29.3 --activate

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ----- Dev: Vite HMR -----
FROM base AS development
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml ./
COPY . .
EXPOSE 5174
CMD ["pnpm", "exec", "vite", "--host", "0.0.0.0", "--port", "5174"]

# ----- Build estático -----
FROM base AS build
ARG VITE_AUTH_URL
ARG VITE_ADMIN_URL
ARG VITE_CLOUDINARY_BASE__URL
ENV VITE_AUTH_URL=$VITE_AUTH_URL \
    VITE_ADMIN_URL=$VITE_ADMIN_URL \
    VITE_CLOUDINARY_BASE__URL=$VITE_CLOUDINARY_BASE__URL
COPY --from=deps /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml ./
COPY . .
RUN pnpm build

# ----- Producción: nginx -----
FROM nginx:1.27-alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=15s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
