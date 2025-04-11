# Usa Node.js como base
FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas os arquivos de configuração primeiro para cache eficiente
COPY frontend/package*.json ./

# Instala dependências
RUN npm install -g @angular/cli && npm install

# Copia o restante do código do frontend
COPY frontend/ ./

# Expõe a porta usada pelo Angular (padrão 4200)
EXPOSE 4200

# Inicia o servidor Angular
CMD ["ng", "serve", "--host", "0.0.0.0", "--disable-host-check"]