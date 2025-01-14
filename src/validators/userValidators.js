const { z } = require('zod');

const userSchemaValidator = z.object({
  firstName: z
    .string()
.min(1, { message: "El nombre es obligatorio y no puede estar vacío." })
    .trim(),
  lastName: z
    .string()
    .min(1, { message: "El apellido es obligatorio y no puede estar vacío." })
    .trim(),
  email: z
    .string()
    .email({ message: "El correo debe tener un formato válido." })
    .trim(),
  password: z
    .string().min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
    .regex(/[A-Z]/, { message: "La contraseña debe incluir al menos una letra mayúscula." })
    .regex(/[a-z]/, { message: "La contraseña debe incluir al menos una letra minúscula." })
    .regex(/[0-9]/, { message: "La contraseña debe incluir al menos un número." })
    .regex(/[\W_]/, { message: "La contraseña debe incluir al menos un carácter especial." }),
});

module.exports = {userSchemaValidator};