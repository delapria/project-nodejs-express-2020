const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
const entlikes = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const results = title
    ? repositories.filter((repository = repository.includes(title)))
    : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repository = repositories.find((repository) => repository.id === id);
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (!repository) {
    return response.status(400).json({ error: "Repository not found." });
  }

  const { likes } = repository;

  const newRepository = {
    id,
    title,
    url,
    techs,
    likes,
  };

  repositories[repositoryIndex] = newRepository;
  return response.json(newRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Project not found." });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const { userName } = request.body;

  const repository = repositories.find((repository) => repository.id === id);

  if (!repository) {
    return response.status(400).json({ error: "Repository not found." });
  }

  const newLike = {
    id: uuid(),
    idRepository: id,
    userName,
  };

  entlikes.push(newLike);
  const likes1 = entlikes.filter((likes) => likes.idRepository === id);
  repository.likes = likes1.length;

  return response.json(repository);
});

module.exports = app;
