# Frontend
## Instalar
`cd frontend`

`npm install -g expo-cli`

`npm i`
## Ejecución
`npx expo start`

# Backend
`python -m venv venv`

`venv\Scripts\activate` o activar en vscode ctrl+shift+p python: select interpreter

`pip install -r requirements.txt`

## Migraciones de la Base de Datos
`python manage.py makemigrations` si hay cambios en modelos

`python manage.py migrate` subir a la base de datos

## Ejecutar el Servidor de Desarrollo
`python manage.py runserver 0.0.0.0:8000` localhost:8000

## En caso de usar el dispositivo movil y un cliente externo ejecutar lo siguiente
`python manage.py runserver 0.0.0.0:8000`


## [Opcional] Crear un superusuario para acceder al panel de administración

`python manage.py createsuperuser` localhost:8000/admin (los modelos se registran en api/admin.py)
