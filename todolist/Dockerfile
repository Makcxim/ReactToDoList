# Использование последней версии Node.js
FROM node:22 as base
# Задаётся рабочая директория в контейнере
WORKDIR /app
# Копируются package.json и package-lock.json
COPY package*.json ./
# Установка зависимостей
RUN npm ci
# Копирование всех файлов из локального каталога в контейнер
COPY . .


FROM base as development
# Тестовая среда

# Открывает порт 5173 в контейнере (порт Vite по умолчанию)
EXPOSE 5173
# Запуск Dev Server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

FROM base as production_build
# Промежуточная стадия
RUN npm run build

# Использует Nginx для обслуживания статических файлов
FROM nginx:stable-alpine AS production

# Копирует результат сборки с предыдущего этапа.
COPY --from=production_build /app/dist /usr/share/nginx/html
# Открывает порт 80
EXPOSE 80
# Запуск Nginx на переднем плане
CMD ["nginx", "-g", "daemon off;"]
