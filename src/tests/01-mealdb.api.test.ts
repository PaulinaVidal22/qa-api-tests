import { expect } from "chai";
import { getMealsByArea, getMealById } from "../clients/mealdb.client";
import { validateSchema } from "../utils/validator";
import { mealSchema } from "../schemas/meal.schema";

describe("TheMealDB API Tests", () => {

  let mealsByAreaResponse: any;

  before(async () => {
    // Se ejecuta una sola vez para evitar llamadas duplicadas
    mealsByAreaResponse = await getMealsByArea("Canadian");
  });

  it("Should return meals for a valid area with correct contract and semantic consistency", () => {

    /*
      Este test valida:

      - Status HTTP 200.
      - Header Content-Type correcto.
      - Que la API devuelva un array no vacío.
      - Que la estructura cumpla el contrato definido (JSON Schema).
      - Que los campos obligatorios estén presentes.
      - Que los IDs sean numéricos.
      - Que los nombres tengan longitud válida.
      - Que las URLs de imágenes tengan formato correcto.
    */

    const response = mealsByAreaResponse;

    // 1️⃣ Validación rápida de status
    expect(response.status).to.equal(200);

    // 2️⃣ Validación de header
    expect(response.headers["content-type"]).to.include("application/json");

    // 3️⃣ Validación mínima de contenido
    expect(response.data.meals).to.be.an("array").that.is.not.empty;

    // 4️⃣ Validación estructural (contrato)
    validateSchema(mealSchema, response.data);

    // 5️⃣ Validación semántica
    response.data.meals.forEach((meal: any) => {
      expect(meal.idMeal).to.match(/^\d+$/);
      expect(meal.strMeal.length).to.be.greaterThan(2);
      expect(meal.strMealThumb).to.match(/^https?:\/\//);
    });
  });


  it("Should return meal details by valid ID", async () => {

    /*
      Este test valida:

      - Que el endpoint lookup responda correctamente por ID válido.
      - Status HTTP 200.
      - Que el recurso exista.
      - Que el detalle incluya propiedades clave.
      - Que el contrato estructural del detalle sea válido.
    */

    const response = await getMealById("52772");

    // 1️⃣ Status
    expect(response.status).to.equal(200);

    // 2️⃣ Existencia del recurso
    expect(response.data.meals).to.be.an("array").that.is.not.empty;

    // 3️⃣ Validación estructural
    validateSchema(mealSchema, response.data);

    const meal = response.data.meals[0];

    // 4️⃣ Validación de campos importantes
    expect(meal).to.have.property("strMeal");
    expect(meal.strMeal.length).to.be.greaterThan(2);
    expect(meal).to.have.property("strInstructions");
  });


  it("Should return consistent data between filter and lookup endpoints", async () => {

    /*
      Este test valida:

      - Que un recurso listado en el endpoint filter
        exista realmente al consultarlo por ID.
      - Status HTTP correcto en ambos endpoints.
      - Que no haya inconsistencias entre ID y nombre.
      - Que el endpoint lookup devuelva información enriquecida.
      - Integridad básica del sistema.
    */

    const filterResponse = mealsByAreaResponse;

    // 1️⃣ Validación mínima previa
    expect(filterResponse.status).to.equal(200);
    expect(filterResponse.data.meals).to.be.an("array").that.is.not.empty;

    const firstMeal = filterResponse.data.meals[0];

    // 2️⃣ Llamada dependiente
    const lookupResponse = await getMealById(firstMeal.idMeal);

    expect(lookupResponse.status).to.equal(200);
    expect(lookupResponse.data.meals).to.be.an("array").that.is.not.empty;

    const detailedMeal = lookupResponse.data.meals[0];

    // 3️⃣ Coherencia de datos
    expect(detailedMeal.idMeal).to.equal(firstMeal.idMeal);
    expect(detailedMeal.strMeal).to.equal(firstMeal.strMeal);

    // 4️⃣ Validación de enriquecimiento
    expect(detailedMeal.strInstructions).to.be.a("string");
    expect(detailedMeal.strInstructions.length).to.be.greaterThan(10);
  });


  it("Should return null for non-existing ID", async () => {

    /*
      Este test valida:

      - Que la API maneje correctamente un ID inexistente.
      - Que no crashee.
      - Que responda con status 200 (comportamiento propio de TheMealDB).
      - Que el campo meals sea null.
      - Manejo correcto de recursos inexistentes.
    */

    const response = await getMealById("9999999");

    expect(response.status).to.equal(200);
    expect(response.data.meals).to.be.null;
  });

});
