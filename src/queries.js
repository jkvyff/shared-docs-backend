const { pool } = require("./config");

const getDocs = (request, response) => {
  pool.query("SELECT * FROM docs", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getDocBySlug = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM docs WHERE slug = $1", [slug], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const addDoc = (request, response) => {
  const { slug, body } = request.body;

  pool.query(
    "INSERT INTO docs (slug, body) VALUES ($1, $2)",
    [slug, body],
    error => {
      if (error) {
        throw error;
      }
      response.status(201).json({ status: "success", message: "Doc added." });
    }
  );
};

const updateDoc = (request, response) => {
  const { slug, body } = request.body;

  pool.query(
    "UPDATE docs SET body = $1 WHERE slug = $2",
    [body, slug],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Doc modified with Slug: ${slug}`);
    }
  );
};

module.exports = {
  getDocs,
  getDocBySlug,
  addDoc,
  updateDoc
};
