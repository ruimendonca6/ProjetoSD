const fs = require("fs");
const path = require("path");
const knex = require("knex");

// Configuração do knex para PostgreSQL
const db = knex({
  client: "pg",
  connection: {
    host: "bl-db",
    user: "sd",
    password: "sd",
    database: "sd",
  },
});

const JSONObserver = {
  list: function () {
    console.log("Listing all available JSON files!");
    try {
      const files = fs.readdirSync("/data");
      files
        .filter((file) => file.endsWith(".json"))
        .forEach(this.processFile.bind(this));
    } catch (error) {
      console.log(`Error accessing /data: ${error}`);
    }
  },

  processFile: function (fileName) {
    console.log(`Processing file: ${fileName}`);
    const filePath = path.join("/data", fileName);
    const content = fs.readFileSync(filePath, "utf8");
    this.parse(content);
  },

  parse: function (content) {
    console.log(`JSON Content of the file: \n${content}`);
    try {
      const data = JSON.parse(content);
      data.forEach(async (item) => {
        await this.insertData(item);
      });
    } catch (err) {
      console.error(`Error parsing JSON: ${err}`);
      return;
    }
  },

  insertData: async function (item) {
    try {
      const { date, description, lang, category1, category2, granularity } =
        item;

      await db("HistoricalEvent").insert({
        date,
        description,
        lang,
        category1,
        category2,
        granularity,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`Imported data for event: ${description}`);
    } catch (error) {
      console.error(`Error inserting data into the database: ${error}`);
    }
  },
};

// Application Module
const ImporterApplication = {
  start: function () {
    JSONObserver.list();
    console.log("Application started");
  },
};

// Start the application
ImporterApplication.start();
