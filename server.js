/********************************************************************************
*  WEB700 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Kuruwita Arachchige Dona Isuri Aroshanie Kuruwita Student ID: 120182241 Date: 2025-07-03
* 
*  Published URL: https://assignment04-web-700.vercel.app/
********************************************************************************/

const express = require("express");
const path = require("path");
const LegoData = require("./modules/legoSets");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const legoData = new LegoData();

// Serve static files from "public"
app.use(express.static(__dirname + "/public"));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/home.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views/about.html"));
});

app.get("/lego/sets", async (req, res) => {
  try {
    if (req.query.theme) {
      const sets = await legoData.getSetsByTheme(req.query.theme);
      res.json(sets);
    } else {
      const sets = await legoData.getAllSets();
      res.json(sets);
    }
  } catch (err) {
    res.status(404).send(err);
  }
});

app.get("/lego/sets/:set_num", async (req, res) => {
  try {
    const set = await legoData.getSetByNum(req.params.set_num);
    res.json(set);
  } catch (err) {
    res.status(404).send(err);
  }
});

// New route for testing addSet
app.get("/lego/add-test", (req, res) => {
  const testSet = {
    set_num: "123",
    name: "testSet name",
    year: "2024",
    theme_id: "366",
    num_parts: "123",
    img_url: "https://fakeimg.pl/375x375?text=[+Lego+]"
  };

  legoData.addSet(testSet)
    .then(() => {
      res.redirect("/lego/sets");
    })
    .catch(err => {
      res.status(422).send(err);
    });
});

// 404 Page
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views/404.html"));
});

// Start Server
legoData.initialize()
  .then(async () => {
    console.log("Initialization successful");

    const sets = await legoData.getAllSets();
    console.log("Sample set:", sets[0]);

    app.listen(HTTP_PORT, () => {
      console.log("Server running on port " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize data:", err);
  });
