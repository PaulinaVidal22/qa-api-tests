import { expect } from "chai";
import { getCurrentWeather } from "../clients/openmeteo.client";
import { validateSchema } from "../utils/validator";
import { weatherSchema } from "../schemas/weather.schema";

describe("OpenMeteo API Tests", () => {

  it("Should return valid weather data with correct contract and logical values", async () => {
    const response = await getCurrentWeather(-34.9, -56.2);

    /*
      Este test valida:

      - Status HTTP 200.
      - Content-Type correcto.
      - Contrato estructural del response.
      - Que los valores numéricos sean coherentes.
      - Que la temperatura esté dentro de un rango físico razonable.
      - Que la latitud y longitud respondidas coincidan con las solicitadas.
    */

    expect(response.status).to.equal(200);
    expect(response.headers["content-type"]).to.include("application/json");

    validateSchema(weatherSchema, response.data);

    const weather = response.data.current_weather;

    // Validación semántica
    expect(weather.temperature).to.be.within(-90, 60); // rango físico razonable
    expect(weather.windspeed).to.be.at.least(0);

    expect(response.data.latitude).to.be.closeTo(-34.9, 1);
    expect(response.data.longitude).to.be.closeTo(-56.2, 1);
  });

  it("Should return controlled client error for invalid coordinates", async () => {
    try {
      await getCurrentWeather(999, 999);

      throw new Error("Expected failure for invalid coordinates");

    } catch (error: any) {

      /*
        Este test valida:

        - Que la API no crashee ante inputs inválidos.
        - Que responda con status 4xx.
        - Que no exponga stack traces.
        - Que el error esté estructurado.
        - Que el header siga siendo JSON.
      */

      expect(error.response).to.exist;
      expect(error.response.status).to.be.within(400, 499);

      expect(error.response.headers["content-type"])
        .to.include("application/json");

      const body = JSON.stringify(error.response.data).toLowerCase();
      expect(body).to.not.include("stack");
      expect(body).to.not.include("exception");
    }
  });

});
