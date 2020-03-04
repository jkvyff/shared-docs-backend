const { pool } = require("./config");

const getDocs = (_request, response) => {
  pool.query("SELECT * FROM docs", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getOrAddBySlug = (request, response) => {
  const { slug } = request.params;

  pool.query("SELECT * FROM docs WHERE slug = $1", [slug], (error, results) => {
    if (error) {
      throw error;
    } else {
      if (results.rows.length == 0) {
        addDoc(request, response);
      } else {
        response.status(200).json(results.rows);
      }
    }
  });
};

const addDoc = (request, response) => {
  const { slug } = request.params;
  const body = '[{"type":"paragraph","children":[{"text":""}]}]';
  const timestamp = new Date();
  pool.query(
    "INSERT INTO docs (slug, body, timestamp) VALUES ($1, $2, $3)",
    [slug, body, timestamp],
    error => {
      if (error) {
        throw error;
      }
      response
        .status(201)
        .json({ status: "success", message: "Doc added.", timestamp });
    }
  );
};

const updateDoc = (request, response) => {
  const { slug } = request.params;
  const { body } = request.body;
  const timestamp = new Date();

  pool.query(
    "UPDATE docs SET body = $1, timestamp = $2 WHERE slug = $3",
    [JSON.stringify(body), timestamp, slug],
    (error, results) => {
      if (error) {
        throw error;
      }
      response
        .status(200)
        .send({ message: `Doc modified with Slug: ${slug}`, timestamp });
    }
  );
};

module.exports = {
  getDocs,
  getOrAddBySlug,
  addDoc,
  updateDoc
};
