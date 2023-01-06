import express, { json } from "express";
import cors from "cors";
const app = express();
const port = 5050;
import { addToDB, readData } from "./firebase/index.js";
// import { Universal } from "./data/index.js";

// functions

const learningdata = async (title) => {
  const Universal = await readData("universal");
  let iteration = true;
  let data, courseID, moduleID, courseName;
  let nextUrl = undefined;
  let nextallowed = false;
  Universal.courses.map((course) => {
    course.learnModule.map((module) => {
      if (title.toLowerCase() == module.url.toLowerCase() && iteration) {
        iteration = false;
        data = module;
        courseID = course.courseID;
        courseName = course.courseName;
        moduleID = module.id;
        nextallowed = true;
        nextUrl = "";
      } else if (nextallowed) {
        nextallowed = false;
        nextUrl = module.url;
      }
    });
    nextallowed = false;
  });
  return { data, courseID, moduleID, nextUrl, courseName };
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
app.get("/courses", async (req, res) => {
  const Universal = await readData("universal");
  const data = Universal.courses;
  res.status(200).send(data);
});
app.get("/universal", async (req, res) => {
  const Universal = await readData("universal");
  res.status(200).send(Universal);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// addToDB("universal", Universal);
