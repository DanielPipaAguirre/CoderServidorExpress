# CoderServidorExpress
Servidor en Express del curso Backend de CoderHouse 🚀

29. Módulo Cluster

- NODEMON CON FORK: nodemon index.js 8000 FORK
- NODEMON CON CLUSTER: nodemon index.js 8000 CLUSTER
- FOREVER CON FORK: forever start -w index.js 8000 FORK
- FOREVER CON FORK: forever start -w index.js 8000 CLUSTER
- PM2 CON FORK: pm2 start index.js -- 8000 FORK
- PM2 CON CLUSTER: pm2 start index.js --watch -i max -- 8000 CLUSTER