import express, { json } from "express";
import cors from "cors";
const app = express();
const port = 5050;
import { addToDB, readData } from "./firebase/index.js";

// functions

const learningdata = async (title) => {
  const Universal = await readData("universal");
  let iteration = true;
  let data, courseID, moduleID;
  let nextUrl = undefined;
  let nextallowed = false;
  Universal.courses.map((course) => {
    course.learnModule.map((module) => {
      if (title.toLowerCase() == module.url.toLowerCase() && iteration) {
        iteration = false;
        data = module;
        courseID = course.courseID;
        moduleID = module.id;
        nextallowed = true;
        nextUrl = "";
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
app.post("/learningdata", async (req, res) => {
  const { title } = req.body;
  const data = await learningdata(title);
  res.status(200).send(data);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// addToDB("universal", Universal);
