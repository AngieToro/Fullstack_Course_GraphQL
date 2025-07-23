Correr segun estos comandos: 
- node index.js
- npm run dev

Al correr el servidor, los query se pueden ejecutar:
- Con la URL http://localhost:4000/ se abrira el navegador con Apollo Explorer 
- Con postman:
    1- Accion: Post. 
    2- Url http://localhost:4000/graphql
    3- Body: raw, json, 
        ejemplo: 
            {
                "query": "query { allPersons { name } }"
            }