const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  console.log("Got a GET request for the homepage");
  res.status(200).send("Hello World");
});

// Create a new user. Do SQL statement
app.get("/api/getAllLeads", async (req, res) => {
  try {
    console.log("Getting all leads");
    const allLeads = await pool.query("SELECT * FROM Lead");
    console.log("Succesfully got all leads");
    res.json(allLeads.rows);
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/api/getAllEmployees", async (req, res) => {
  try {
    console.log("Getting all employees");
    const allEmployees = await pool.query("SELECT * FROM Employee");
    res.json(allEmployees.rows);
  } catch (err) {
    console.error(err);
  }
});

app.post("/api/newLead", async (req, res) => {
  console.log(req.body);
  try {
    console.log("adding new lead");
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      youth,
      leadManagerID,
      referredBy,
      joinGym,
      classRegistration,
      notes,
    } = req.body;

    // console.log(req.body);
    const newLead = await pool.query(
      "INSERT INTO Lead (firstName, lastName, phoneNumber, email, youth, leadManagerID, referredBy, joinGym, classRegistration, notes) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;",
      [
        firstName,
        lastName,
        phoneNumber,
        email,
        youth,
        leadManagerID,
        referredBy,
        joinGym,
        classRegistration,
        notes,
      ]
    );
    res.json(newLead.rows[0]);
  } catch (err) {
    console.error(err);
  }
});

app.delete("/api/deleteLead/:id", async (req, res) => {
  try {
    console.log("Deleting lead");
    const { id } = req.params;
    const deletedLead = await pool.query("DELETE FROM Lead WHERE id = $1", [
      id,
    ]);
    res.json(deletedLead.rows);
  } catch (err) {
    console.error(err);
  }
});

app.put("/api/updateLead/:id", async (req, res) => {
  try {
    console.log("Updating lead");
    const { id } = req.params;
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      youth,
      leadManagerID,
      referredBy,
      joinGym,
      classRegistration,
      notes,
    } = req.body;

    console.log(req.body);

    const updatedLead = await pool.query(
      "UPDATE Lead SET firstName = $1, lastName = $2, phoneNumber = $3, email = $4, youth = $5, leadManagerID = $6, referredBy = $7, joinGym = $8, classRegistration = $9, notes = $10 WHERE id = $11 RETURNING *;",
      [
        firstName,
        lastName,
        phoneNumber,
        email,
        youth,
        leadManagerID,
        referredBy,
        joinGym,
        classRegistration,
        notes,
        id,
      ]
    );
    res.json(updatedLead.rows[0]);
  } catch (err) {
    console.error(err);
  }
});

const listener = app.listen(port, () => {
  console.log("Server has started on port: " + listener.address().port);
});
