const { Router } = require('express');
const controllerTasks = require('../controllers/TasksControllers.js');
const { authValidator } = require('../middlewares/authValidator.js');

const router = Router();
router.get('/', controllerTasks.getTasks);  
router.get("/search", controllerTasks.getTasksWithFilters);
router.post('/', controllerTasks.addTask);
router.patch('/:id', authValidator, controllerTasks.updateTask);
router.delete('/:id', authValidator, controllerTasks.deleteTask);
  

module.exports = router;
