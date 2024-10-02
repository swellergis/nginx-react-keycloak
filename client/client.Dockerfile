FROM node:18

WORKDIR /app

COPY ./ ./

RUN npm i keycloak-js react-window @react-keycloak/web @mui/material @emotion/react @emotion/styled @mui/x-data-grid @mui/icons-material
RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]
