openssl genrsa -des3 -out wurk.local.rootCA.key 2048

openssl req -x509 -new -nodes -key wurk.local.rootCA.key -sha256 -days 1024 -out wurk.local.rootCA.pem

openssl req -new -nodes -out wurk.local.server.csr -newkey rsa:2048 -keyout wurk.local.server.key 

openssl x509 -req -in wurk.local.server.csr -CA wurk.local.rootCA.pem -CAkey wurk.local.rootCA.key -CAcreateserial -out wurk.local.server.crt -days 500 -sha256 -extfile v3.ext 



