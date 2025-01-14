const Task = require('../models/TaskModel.js');
const { taskSchemaValidator } = require ('../validators/tasksValidator.js')

const getTasks = async (req, res) => {
  // Aca se utiliza un metodo de agregacion donde se agrupa
  // por prioridad,cuenta la cantidad por prioridad y cuenta tareas completadas.
  try {
    const { priority, done } = req.body;
    const matchStage = {};

    if (priority) matchStage.priority = priority;
    if (done !== undefined) matchStage.done = done === "true";

    const aggregationPipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: "$priority",
          totalTasks: { $sum: 1 }, 
          completedTasks: { $sum: { $cond: ["$done", 1, 0] } },
        },
      },
    ];

    const results = await Task.aggregate(aggregationPipeline);
    res.json(results); // Devuelve los resultados como JSON
  } catch (error) {
    console.error("Error al realizar la agregación:", error);
    res.status(500).json({ error: "Error al realizar la agregación" });
  }
};

const getTasksWithFilters = async (req, res) => {
  try {
    const { status, priority } = req.query;
    const filter = {};

    if (typeof status === 'string') {
      filter.done = status === "done"
    }

    if (priority !== undefined) {
      filter.priority = priority;
    }

    const tasks = await Task.find(filter)
    res.render("partials/task", {
      tasks
    })
    //res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al aplicar filtros" });
  }
};

const addTask = async (req, res) => {
  try {
    const { text, done = false, priority, date } = req.body

    if (!text || !date) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const validateData = taskSchemaValidator.safeParse({text, done, priority, date});

    if(!validateData.success){

      return res.status(400).json( {error:"Bad request", details: validateData.error.errors });
    }

    const newTask = new Task({
      text,
      done,
      priority,
      date
    });
    console.log(newTask);
    await newTask.save();

    res.status(201).json({
      mensaje: 'Tarea agregada exitosamente',
      data: newTask
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar tarea" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { done } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { done},
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    res.json({
      mensaje: 'Tarea actualizada exitosamente',
      data: updatedTask
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar tarea" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar tarea" });
  }
};

module.exports = {
  getTasks,
  getTasksWithFilters,
  addTask,
  updateTask,
  deleteTask
};
