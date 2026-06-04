require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const Employee = require("./models/Employee");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log(err));

// Home Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// =====================
// CREATE EMPLOYEE
// =====================
app.post("/addEmployee", async (req, res) => {
  try {
    const { name, email, department, salary } = req.body;

    const employee = new Employee({
      name,
      email,
      department,
      salary,
    });

    await employee.save();

    res.send("Employee Added Successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error Adding Employee");
  }
});

// =====================
// READ EMPLOYEES
// =====================
app.get("/employees", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error Fetching Employees");
  }
});

// =====================
// UPDATE EMPLOYEE
// =====================
app.put("/employee/:id", async (req, res) => {
  try {
    await Employee.findByIdAndUpdate(req.params.id, req.body);

    res.send("Employee Updated Successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error Updating Employee");
  }
});

// =====================
// DELETE EMPLOYEE
// =====================
app.delete("/employee/:id", async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);

    res.send("Employee Deleted Successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error Deleting Employee");
  }
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});