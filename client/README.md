A react frontend with a node backend serving hard-coded data
- requires login via keycloak auth

# services configured in docker-compose.yml
keycloak identity provider connected to kcdatabase db on pg vm
nginx proxy
- handles client traffic on 3000 and keycloak traffic on 8080
node server
react client

# project file structure
NGINX-REACT-KEYCLOAK
- docker-compose.yml
- client
  - client.Dockerfile
- nginx
  - default.conf
- server
  - server.Dockerfile

# starting
requirements
- access to kcdatabase db on pg vm
- keycloak-auth image
  - ~/checkout/devprojects/keycloak-auth
  - building
    - ./build_docker_image.sh
  - access to kcdatabase db on pg vm
  - vertx realm with vertx-service client with tester user
- /etc/hosts entry for foo.local and keycloak.local on 127.0.0.1
docker compose up -d

https://foo.local
https://keycloak.local
