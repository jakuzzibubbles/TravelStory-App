FROM node:22-alpine

# Install build dependencies (required for Rollup)
RUN apk add --no-cache \
    bash \
    python3 \
    make \
    g++ \
    libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./

# Install all dependencies (not just production)
RUN npm install

COPY . .

EXPOSE 5173

CMD ["./node_modules/.bin/vite", "--host"]
