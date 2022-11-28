openssl genrsa -des3 -out homeassistant.local.rootCA.key 2048

openssl req -x509 -new -nodes -key homeassistant.local.rootCA.key -sha256 -days 3650 -out homeassistant.local.rootCA.pem

openssl req -new -nodes -out homeassistant.local.server.csr -newkey rsa:2048 -keyout homeassistant.local.server.key 

openssl x509 -req -in homeassistant.local.server.csr -CA homeassistant.local.rootCA.pem -CAkey homeassistant.local.rootCA.key -CAcreateserial -out homeassistant.local.server.crt -days 500 -sha256 -extfile v3.ext 

