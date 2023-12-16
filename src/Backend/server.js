const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect("mongodb://localhost/yogaClassesDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  batch: String,
  batchChangeMonth: String,
});

const User = mongoose.model("User", userSchema);

app.post("/admission", async (req, res) => {
  try {
    // Perform basic validations
    if (req.body.age < 18 || req.body.age > 65) {
      return res.status(400).json({ error: "Invalid age range" });
    }

    // Check if the user has an existing record
    const existingUser = await User.findOne({ name: req.body.name });

    if (existingUser) {
      // If the user has an existing record, update the batchChangeMonth
      await User.updateOne(
        { name: req.body.name },
        { batchChangeMonth: req.body.batchChangeMonth }
      );
    } else {
      // If the user doesn't have an existing record, create a new record
      const newUser = new User({
        name: req.body.name,
        age: req.body.age,
        batch: req.body.batch,
        batchChangeMonth: req.body.batchChangeMonth,
      });

      await newUser.save();
    }

    // Return success response
    res.status(200).json({ message: "Admission successful!" });
  } catch (error) {
    console.error("Error processing admission:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
