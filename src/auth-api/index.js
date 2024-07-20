const express = require("express");
const cors = require("cors");
const knexConfig = require("./knexfile").development;
const knex = require("knex")(knexConfig);
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

const app = express();
const SECRET_KEY = "your_secret_key";

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
    if (!req.user || !req.user[role]) {
      return res.sendStatus(403);
    }
    next();
  };
};

// Função para criptografar a senha
const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

// Rota de login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const user = await knex("users").where({ username }).first();
    const hashedPassword = hashPassword(password);

    if (!user || user.password !== hashedPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { View: user.View, Edit: user.Edit, Admin: user.Admin },
      SECRET_KEY,
      { expiresIn: "1d", subject: user.id.toString() }
    );
    res.cookie("token", token, { httpOnly: true });
    res.json({ message: "Login successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred during login" });
  }
});

app.get("/users", authenticateToken, authorize("Admin"), async (req, res) => {
  try {
    const users = await knex.select("*").from("users");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving data");
  }
});

app.post("/register", async (req, res) => {
  try {
    const {
      username,
      password,
      View = false,
      Edit = false,
      Admin = false,
    } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const hashedPassword = hashPassword(password);

    await knex("users").insert({
      username,
      password: hashedPassword,
      View,
      Edit,
      Admin,
    });
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error inserting data: " + JSON.stringify(error));
  }
});

app.put(
  "/users/:id",
  authenticateToken,
  authorize("Admin"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { username, password, View, Edit, Admin } = req.body;

      if (!Number.isInteger(Number(id))) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      if (
        !username ||
        !password ||
        typeof View !== "boolean" ||
        typeof Edit !== "boolean" ||
        typeof Admin !== "boolean"
      ) {
        return res.status(400).json({
          message: "Username, password, and permissions (boolean) are required",
        });
      }

      const hashedPassword = hashPassword(password);

      await knex("users").where({ id }).update({
        username,
        password: hashedPassword,
        View,
        Edit,
        Admin,
      });

      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating data: " + JSON.stringify(error));
    }
  }
);

app.delete(
  "/users/:id",
  authenticateToken,
  authorize("Admin"),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!Number.isInteger(Number(id))) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

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
