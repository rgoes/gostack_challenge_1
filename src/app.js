const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

var repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const id = uuid();
  const entry = {id, ...request.body, likes: 0};
  repositories.push(entry);
  response.json(entry); 
});

app.put("/repositories/:id", (request, response) => {
  const { id }  = request.params;
  const { title, url, techs } = request.body; 
  const rep_stored = repositories.find(element => element.id == id);
  if (rep_stored) {
    if (title) rep_stored.title = title; 
    if (url) rep_stored.url = url; 
    if (techs) rep_stored.techs = techs; 
    response.status(200).json(rep_stored);
  } else {
    response.status(400).json({ error: "Repository ID not found!"});
  }
});

app.delete("/repositories/:id", (request, response) => {
  const { id }  = request.params;
  const rep_stored = repositories.find(element => element.id == id);
  if (rep_stored) {
    repositories = repositories.filter( item => item !== rep_stored)
    response.status(204).send()
  } else {
    response.status(400).json({ error: "Repository ID not found!"})
  }
});

app.post("/repositories/:id/like", (request, response) => {
  const { id }  = request.params;
  const rep_stored = repositories.find(element => element.id == id);
  if (rep_stored) {    
    rep_stored.likes++
    console.log(`Updated likes to ${rep_stored.likes}`)
    response.status(201).json({ likes: rep_stored.likes });
  } else {
    response.status(400).json({ error: "Repository ID not found!"});
  }
});

module.exports = app;
