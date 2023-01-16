import express, { json } from "express";
import cors from "cors";
const app = express();
const port = 5050;
import {
  addToDB,
  readData,
  getDataFromFirestore,
  documentSize,
} from "./firebase/index.js";
// import { Universal } from "./data/index.js";

// functions

const learningdata = async (title) => {
  try {
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
  } catch (error) {}
};
function getWeekOfMonth(date) {
  let firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  return (
    Math.ceil(
      ((date - firstDayOfMonth) / 86400000 + firstDayOfMonth.getDay() + 1) / 7
    ) - 1
  );
}

function getCurrentWeekDayMonth(dte) {
  let date = dte;
  let day = date.getUTCDate();
  let month = date.getUTCMonth() + 1;
  let week = getWeekOfMonth(dte);
  return { week, day, month };
}

const changeTimeSpent = async (time, userId) => {
  const { week, day, month } = getCurrentWeekDayMonth(new Date());
  let firestoreData = await getDataFromFirestore("users", userId);
  firestoreData.lastYearTimeSpentFull[month][day] += time / 3600;
  addToDB("users", firestoreData, userId);
};

// main
app.use(json());
app.use(cors());
app.get("/", (req, res, next) => {
  try {
    res.send("Hello Huzend");
  } catch (error) {
    next(error);
  }
});
app.post("/learningdata", async (req, res) => {
  try {
    const { title } = req.body;
    const data = await learningdata(title);
    if (data !== 0) res.status(200).send(data);
  } catch (error) {
    console.log(error);
  }
});
app.post("/timeSpent", async (req, res, next) => {
  try {
    const { time, id } = req.body;
    changeTimeSpent(time, id);
    res.status(200).send("hello");
  } catch (error) {
    next(error);
  }
});
app.get("/usersCollectionSize", async (req, res, next) => {
  try {
    const size = await documentSize("users");
    console.log(size);
    res.status(200).send(size.toString());
  } catch (error) {
    next(error);
  }
});

app.get("/courses", async (req, res, next) => {
  try {
    const Universal = await readData("universal");
    const data = Universal.courses;
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
});
app.get("/universal", async (req, res, next) => {
  try {
    const Universal = await readData("universal");
    res.status(200).send(Universal);
  } catch (error) {
    next(error);
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// getChannelWatchTime("RationalBeliever");

// addToDB("universal", Universal, "1");
