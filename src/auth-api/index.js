const express = require("express");
const cors = require("cors");
const knexConfig = require("./knexfile").db;
const knex = require("knex")(knexConfig);
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const app = express();
const SECRET_KEY = "your_secret_key"; // Use uma chave segura e mantenha-a em segredo

// Middlewares
app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Auth API");
});

// Middleware para autenticação
const authenticateToken = (req, res, next) => {
  const token =
    req.cookies.token ||
    (req.headers["authorization"] &&
      req.headers["authorization"].split(" ")[1]);
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Middleware para autorização (exemplo: somente admin)
const authorize = (role) => {
  return (req, res, next) => {
    if (req.user.permission !== role) {
      return res.sendStatus(403);
    }
    next();
  };
};

// Rota de login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const user = await knex("users").where({ username }).first();
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ permission: user.permission }, SECRET_KEY, {
      expiresIn: "1d",
      subject: user.id.toString(),
    });
    res.cookie("token", token, { httpOnly: true });
    res.json({ message: "Login successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred during login" });
  }
});

// Rota para obter professores
app.get("/teachers", authenticateToken, async (req, res) => {
  try {
    const teachers = await knex.select("*").from("teachers");
    res.json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving data");
  }
});

// Rota para obter usuários (somente admin)
app.get("/users", authenticateToken, authorize("admin"), async (req, res) => {
  try {
    const users = await knex.select("*").from("users");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving data");
  }
});

// Rota para adicionar usuário
app.post("/adduser", async (req, res) => {
  const { username, password, permission = "view" } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await knex("users").insert({
      username,
      password: hashedPassword,
      permission,
    });
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error inserting data: " + JSON.stringify(error));
  }
});

// Rota para atualizar usuário
app.put(
  "/users/:id",
  authenticateToken,
  authorize("admin"),
  async (req, res) => {
    const { id } = req.params;
    const { username, password, permission } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await knex("users")
        .where({ id })
        .update({ username, password: hashedPassword, permission });
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating data: " + JSON.stringify(error));
    }
  }
);

// Rota para deletar usuário
app.delete(
  "/users/:id",
  authenticateToken,
  authorize("admin"),
  async (req, res) => {
    const { id } = req.params;

    try {
      await knex("users").where({ id }).del();
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting data: " + JSON.stringify(error));
    }
  }
);

const PORT = process.env.PORT || 18080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
