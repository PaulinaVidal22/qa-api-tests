import Ajv from "ajv";

const ajv = new Ajv();

export const validateSchema = (schema: object, data: any) => {
  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    throw new Error(
      "Schema validation failed: " + JSON.stringify(validate.errors)
    );
  }

  return true;
};
