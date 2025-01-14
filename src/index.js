const express = require('express');
const path = require("path");
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const connectionDB = require ("./config/mongoConnection.js");
const config = require("./config/config.js");
const routerTasks = require("./routes/TasksRouter.js");
const routerUsers = require("./routes/UserRouter.js");

const PORT = config.PORT ?? 2303;
const URI_DB = config.URI_DB;

const app = express();

app.use(cookieParser());

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");

app.use("/assets", express.static(path.join(__dirname, "assets")));

//Middleware
app.use(express.json());
app.use(cors());
app.use(urlencodedParser)

//Router
app.use('/api/tasks', routerTasks);
app.use('/api/users', routerUsers);

// Views
app.get("/api/tasks", (req, res) => {
  res.render("index");
});

app.get("/api/partials/register", (req, res) => res.render("partials/register"))

app.use("*", (req, res) => {
  res.status(404).json({ error: "resource not found" })
})

connectionDB(URI_DB).then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
}).catch((error) => {
  console.error("Error al conectar a la base de datos:", error);
});
