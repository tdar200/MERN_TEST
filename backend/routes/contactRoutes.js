const express = require("express");
const router = express.Router();
const mockData = require("../MOCK_DATA.json");

const fs = require("fs");
const path = require("path");
const dataFilePath = path.join(__dirname, "../MOCK_DATA.json");

router.route("/").get((req, res) => {
  res.status(201).json(mockData);
});

router.route("/").post((req, res) => {
  const { first_name, last_name, email, gender } = req.body;

  const employee = {
    first_name,
    last_name,
    email,
    gender,
    id: `${Math.floor(Math.random() * 9999999)}`,
  };

  mockData.push(employee);

  fs.writeFile(dataFilePath, JSON.stringify(mockData, null, 2), (err) => {
    if (err) {
      console.error("Error writing to JSON file", err);
      return res.status(500).json({ message: "Failed to create contact" });
    }
    res.json({
      message: "Contact created successfully",
      employee: employee,
    });
  });
});

router.route("/:id").put((req, res) => {
  const { first_name, last_name, email, gender } = req.body;

  const foundEmployee = mockData.find((data) => data.id === req.params.id);

  if (foundEmployee) {
    foundEmployee.first_name = first_name;
    foundEmployee.last_name = last_name;
    foundEmployee.email = email;
    foundEmployee.gender = gender;

    fs.writeFile(dataFilePath, JSON.stringify(mockData, null, 2), (err) => {
      if (err) {
        console.error("Error writing to JSON file", err);
        return res.status(500).json({ message: "Failed to update contact" });
      }

      res.json({
        message: "Contact updated successfully",
        employee: foundEmployee,
      });
    });
  } else {
    res.status(404).json({ message: "Contact not found" });
  }
});

router.route("/:id").delete((req, res) => {
  const { id } = req.params;
  const foundIndex = mockData.findIndex((data) => data.id === id);

  if (foundIndex !== -1) {
    const removedEmployee = mockData.splice(foundIndex, 1);

    fs.writeFile(dataFilePath, JSON.stringify(mockData, null, 2), (err) => {
      if (err) {
        console.error("Error writing to JSON file", err);
        return res.status(500).json({ message: "Failed to delete contact" });
      }
      res.status(204).send();
    });
  } else {
    res.status(404).json({ message: "Contact not found" });
  }
});

module.exports = router;
