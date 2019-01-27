Led controller emulator to use with Mandarin Nest home automator
-----

``
npm install
``

``
npm run build
``

``
node demo-server.js
``

Update Mandarin Nest home automator by setting 

```
useEmulator: false,

ledControllerAddress: 'http://192.168.1.47:8080/',

ledEmulatorAdress: 'http://localhost:8081',
```

http://localhost:8081/?red=90&green=15&blue=150

