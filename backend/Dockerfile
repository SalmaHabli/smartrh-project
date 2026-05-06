FROM node:18

# dossier de travail
WORKDIR /app

# copier package.json
COPY package*.json ./

# installer les dépendances
RUN npm install

# copier le reste du projet
COPY . .

# exposer le port
EXPOSE 5000

# lancer l'application
CMD ["npm", "start"]