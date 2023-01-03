import express, { json } from "express";
import cors from "cors";
const app = express();
const port = 5050;
import { Universal } from "./data/index.js";

// functions

const learningdata = (title) => {
  let iteration = true;
  let data, courseID, moduleID;
  let nextUrl = "";
  let nextallowed = false;
  Universal.courses.map((course) => {
    course.learnModule.map((module) => {
      if (title.toLowerCase() == module.url.toLowerCase() && iteration) {
        iteration = false;
        data = module;
        courseID = course.courseID;
        moduleID = module.id;
        nextallowed = true;
      } else if (nextallowed) {
        nextallowed = false;
        nextUrl = module.url;
      }
    });
  });
  return { data, courseID, moduleID, nextUrl };
};

app.use(json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello Huzend");
});
app.post("/learningdata", (req, res) => {
  const { title } = req.body;
  const data = learningdata(title);
  res.status(200).send(data);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
