# Build stage
FROM node:18-alpine as build

WORKDIR /app

# package.json, package-lock.json 복사 (먼저!)
COPY package*.json ./

# 의존성 설치 (이때만 설치, 이후 COPY로 덮어쓰기 금지)
RUN npm install

# 이후 나머지 소스 복사 (이때 node_modules 절대 덮어쓰기 안 함)
COPY public ./public
COPY src ./src

# 빌드
RUN npm run build

# Production stage
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
