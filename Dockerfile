FROM node:22-bullseye-slim

WORKDIR /usr/app

# Install dependencies
COPY package.json ./
COPY tsconfig.json ./
RUN npm install

# Copy the rest of the source files
COPY . .

# Build the TypeScript code
RUN npm run build

EXPOSE 8080
CMD ["npm", "start"]
