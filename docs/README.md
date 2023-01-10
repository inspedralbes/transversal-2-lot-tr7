# Documentació

### Desplegament aplicació

Per a desplegar l'aplicació s'ha de moure el contingut de la carpeta web, al servidor del labs a la següent ruta /web/trivial7.alumnes.inspedralbes.cat/public_html

### Càrrega BD

Per a carregar la BD cal entrar al phpmyadmin del labs, i importar el script create.sql situat a la carpeta back

### Configuració cron

Per a configurar el cron s'ha d'entrar al labs i anar a l'apartat de "tareas" afegir una nova tasca programada amb l'ordre cd /home/a22arncatsan/web/trivial7.alumnes.inspedralbes.cat/public_html/laravel && php artisan schedule:run >> /dev/null 2>&1 amb l'interval de temps (* * * * *).
