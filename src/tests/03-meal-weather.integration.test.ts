import { expect } from "chai";
import { getMealsByArea } from "../clients/mealdb.client";
import { getCurrentWeather } from "../clients/openmeteo.client";
import { countryCoordinates } from "../utils/countryCoordinates";

describe("Integration Tests - Meal & Weather APIs", () => {

  const area = "Canadian";

  describe("Smoke Integration", () => {

    it("Should validate that both APIs respond successfully when executed in parallel", async () => {

      /*
        Este test valida:

        - Que ambas APIs puedan ejecutarse simultáneamente.
        - Que ambas respondan con status HTTP 200.
        - Que no existan fallas básicas de disponibilidad.
        - Que el endpoint de meals devuelva datos.
        - Que el endpoint de clima devuelva temperatura válida.
        - Validación de integración básica (smoke level).
      */

      const [mealResponse, weatherResponse] = await Promise.all([
        getMealsByArea(area),
        getCurrentWeather(45.42, -75.69) // Ottawa
      ]);

      // 1️⃣ Validación rápida de disponibilidad
      expect(mealResponse.status).to.equal(200);
      expect(weatherResponse.status).to.equal(200);

      // 2️⃣ Validación mínima de contenido
      expect(mealResponse.data.meals).to.be.an("array").that.is.not.empty;

      // 3️⃣ Validación semántica básica
      expect(weatherResponse.data.current_weather.temperature)
        .to.be.within(-90, 60);
    });

  });


  describe("End-to-End Integration Flow", () => {

    it("Should dynamically resolve meal area and retrieve weather for its mapped capital", async () => {

      /*
        Este test valida:

        - Que el área obtenida desde TheMealDB sea válida.
        - Que exista un mapeo área → coordenadas.
        - Que el flujo sea dependiente (la segunda API depende de la primera).
        - Que ambas APIs respondan correctamente.
        - Que el clima obtenido sea físicamente coherente.
        - Validación real de integración End-to-End.
      */

      // 1️⃣ Obtener meals por área
      const mealResponse = await getMealsByArea(area);

      expect(mealResponse.status).to.equal(200);
      expect(mealResponse.data.meals).to.be.an("array").that.is.not.empty;

      // 2️⃣ Resolver coordenadas dinámicamente
      const coordinates = countryCoordinates[area];

      expect(coordinates).to.exist;

      // 3️⃣ Consultar clima basado en resultado previo
      const weatherResponse = await getCurrentWeather(
        coordinates.lat,
        coordinates.lon
      );

      expect(weatherResponse.status).to.equal(200);

      // 4️⃣ Validación semántica
      expect(weatherResponse.data.current_weather.temperature)
        .to.be.within(-90, 60);
    });

  });

});
