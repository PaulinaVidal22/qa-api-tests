# apiTestingWeekendChallenge

# QA API Tests – TheMealDB & OpenMeteo

## Stack tecnológico

* **TypeScript**
  Lenguaje principal del proyecto. Se utiliza para trabajar con tipado estático y mejorar la organización, mantenibilidad y escalabilidad del código.

* **Mocha**
  Framework de testing utilizado para estructurar y ejecutar las pruebas automatizadas.

* **Chai**
  Librería de aserciones utilizada para validar los resultados esperados en los tests.

* **Axios**
  Cliente HTTP utilizado para realizar las requests a las APIs externas.

* **AJV**
  Librería para validación de JSON Schema, utilizada para verificar la estructura de las respuestas y asegurar el cumplimiento del contrato de las APIs.

* **Mochawesome**
  Generador de reportes HTML que permite visualizar los resultados de ejecución de manera clara y organizada.

---

## APIs utilizadas

* **TheMealDB API**
  Utilizada para obtener información sobre comidas por área y detalles de recetas.

* **OpenMeteo API**
  Utilizada para obtener información meteorológica basada en coordenadas geográficas.

---

## Estructura del proyecto

qa-api-tests/
│
├── src/
│   ├── clients/
│   ├── schemas/
│   ├── tests/
│   └── utils/
│
├── reports/
├── package.json
├── tsconfig.json
└── README.md

---

### src/clients (capa de acceso HTTP)

Contiene las funciones encargadas de realizar las llamadas HTTP a las APIs externas.
Esta capa abstrae la lógica de Axios y permite separar claramente la comunicación con los servicios del resto de la lógica de testing.

---

### src/schemas

Incluye los JSON Schemas utilizados para validar la estructura de las respuestas.
Aquí se definen los contratos esperados (campos obligatorios, tipos de datos y estructura general del JSON).

---

### src/tests

Contiene los archivos de pruebas automatizadas organizados por tipo:

* Tests de API individuales para cada servicio.
* Validaciones de contrato (estructura mediante JSON Schema).
* Validaciones de comportamiento (status codes, coherencia de datos, manejo de errores).
* Tests de integración:

  * Smoke Integration (ejecución paralela de ambas APIs).
  * End-to-End Integration Flow (flujo dependiente entre APIs).

Los archivos están numerados para controlar el orden estratégico de ejecución:

* 01 – Tests de TheMealDB
* 02 – Tests de OpenMeteo
* 03 – Tests de integración

Esto permite validar primero las APIs de forma aislada y luego ejecutar las pruebas de integración.

---

### src/utils

Contiene funciones auxiliares reutilizables, como el validador de esquemas (AJV) y utilidades de soporte.

---

### reports

Carpeta donde se generan los reportes HTML al ejecutar los tests con Mochawesome.

---

## Estrategia de testing aplicada

En el proyecto se implementan distintos niveles de validación:

* Validación de status codes HTTP.
* Validación de headers (Content-Type).
* Validación estructural mediante JSON Schema.
* Validación semántica (coherencia lógica de datos).
* Validación de manejo de errores (casos negativos).
* Validación de consistencia entre endpoints.
* Integración entre APIs (ejecución paralela y flujo dependiente).

La arquitectura mantiene separación clara entre:

* Acceso HTTP (clients)
* Contrato (schemas)
* Comportamiento (tests)
* Lógica reutilizable (utils)

---

## Instalación

Clonar el repositorio y ejecutar:

```bash
npm install
```

Esto instalará todas las dependencias definidas en package.json.

---

## Ejecución de pruebas

Para ejecutar todos los tests:

```bash
npm run test
```

Para generar el reporte HTML:

```bash
npm run test:report
```

El reporte se generará en la carpeta reports/.

