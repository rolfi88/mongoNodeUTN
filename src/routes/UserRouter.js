const { Router } = require('express');
const controllerUser = require('../controllers/UserControllers.js');
const { authValidator } = require('../middlewares/authValidator.js');

const router = Router();
  
router.get('/', authValidator, controllerUser.getAllUsers);
router.post('/register', controllerUser.registerUser);
router.post('/login', controllerUser.loginUser)
router.patch('/:id', authValidator, controllerUser.updateUser);
router.delete('/:id', authValidator, controllerUser.deleteUser);
  
module.exports = router;