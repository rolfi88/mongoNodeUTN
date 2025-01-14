const z = require('zod');

const taskSchemaValidator = z.object({
  text: z.string().min(1),
  done: z.boolean(),
  priority: z.string(),
  date: z.string()
})

const updateTaskSchema = z.object({
  done: z.boolean()
})

module.exports = { taskSchemaValidator, updateTaskSchema }