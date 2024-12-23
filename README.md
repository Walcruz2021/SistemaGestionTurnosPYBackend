### Build a MERN (MongoDB | Express | ReactJS | Nodejs)

<p align="center">
  <a href="https://www.pymesya.com/tecnologias/sistemaGestionTurnos/" target="blank"><img src="../BackendAppOmar/LogoNew.png" width="200" alt="SISTEMA DE GESTION DE TURNO PY" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar
```
npm install
```

5 Paquetes Instalados
```
express.js
graphql
supertest
jest
mongoose
```
6 Clonar el archivo ```.env.template``` y renombrar la copia a ```.env```

7 Llenar las variables de entorno definidas en el
```
.env
```
8 Ejecutar la aplicacion en dev
```
npm start
```

# 📂 Descripción Proyecto

Sistema de Gestion de Turnos PY optimiza la administración en establecimientos dedicados al cuidado de mascotas, incluyendo:

- ✅ **Gestión de turnos**:  Programación eficiente y automatizada para clientes..  
- ✅ **Manejo de clientes**: Base de datos organizada para un seguimiento detallado..  
- ✅ **Control de inventarios**: Gestión precisa de productos y suministros.  
- ✅ **Generación de informes**: Análisis de gastos, ventas y rendimiento del negocio.   
- 🚀 **Impacto**: Este sistema mejora significativamente la productividad y la experiencia del cliente, aportando herramientas clave para la toma de decisiones estratégicas. 

# 📝 Características del Backend

- ✅ **Framework**: Node.js (Express.js para REST y Apollo Server para GraphQL).  
- ✅ **Base de datos**: MongoDB con **Mongoose** para modelado y validación de datos.  
- ✅ **Pruebas automatizadas**: Configuración con **Jest** para pruebas unitarias e integración continua.  
- ✅ **Control de acceso**: Middleware de autenticación y autorización con **JSON Web Tokens (JWT)**.  
- ✅ **Gestión de errores**: Sistema centralizado para manejo de errores en el servidor.  
- ✅ **Despliegue**: Backend implementado en servidores escalables con soporte para ambientes de desarrollo y producción.  
  
# 🚀 Implementaciones Nuevas


 Para mejorar la calidad y escalabilidad del backend, se han introducido las siguientes implementaciones en ramas dedicadas, las cuales posteriormente se integran a la rama principal (master):  

1. **Integración de GraphQL**:  
   - Se está implementando un esquema de GraphQL para manejar las consultas y mutaciones, ofreciendo a los consumidores del API una experiencia más flexible y eficiente al acceder a los datos.  
   - Esto permite optimizar las solicitudes al backend reduciendo la carga en endpoints REST tradicionales.  

2. **Pruebas unitarias y de integración**:  
   - Se utilizan herramientas modernas como **Jest** para asegurar la calidad del código mediante la creación de pruebas automatizadas para rutas y lógica de negocio.  
   - Las pruebas se ejecutan en cada iteración para detectar errores antes de que lleguen a producción, garantizando la estabilidad del sistema.  

3. **Estrategias de control de versiones y colaboración**:  
   - Todas las nuevas características se desarrollan en ramas específicas siguiendo las mejores prácticas de control de versiones con **Git**.  
   - Esto asegura que los cambios sean revisados, probados, y fusionados de manera estructurada.  




