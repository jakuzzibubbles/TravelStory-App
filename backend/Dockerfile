FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./


# Install build dependencies and bcrypt correctly for the container
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && npm install \
    && npm rebuild bcrypt \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY . .

EXPOSE 8000

CMD ["npm", "start"]



