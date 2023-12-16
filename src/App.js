import React, { useState } from "react";
import "./AdmissionForm.css";

const AdmissionForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    batch: "",
    batchChangeMonth: "",
  });

  const [showChangeBatchForm, setShowChangeBatchForm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Age Validation
    if (formData.age < 18 || formData.age > 65) {
      alert("Age must be between 18 and 65.");
      return;
    }

    // Payment Logic (Mocked, replace with actual payment processing)
    const paymentSuccessful = await processPayment();

    // If payment is successful, proceed with form submission
    if (paymentSuccessful) {
      // Make a REST API call to your backend with formData
      try {
        const response = await fetch("http://your-api-endpoint/admission", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        // Handle the response from the server
        console.log(data);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    } else {
      alert("Payment failed. Please try again.");
    }
  };

  const processPayment = async () => {
    // Mock payment processing
    // Replace this with your actual payment processing logic
    const paymentResponse = await fetch(
      "http://your-api-endpoint/completePayment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 500, // Monthly fee
          // Add other payment details if needed
        }),
      }
    );

    const paymentData = await paymentResponse.json();
    return paymentData.success;
  };

  const handleShowChangeBatchForm = () => {
    setShowChangeBatchForm(true);
  };

  const handleCancelChangeBatch = () => {
    setShowChangeBatchForm(false);
  };

  const handleChangeBatch = (newBatch) => {
    const nextMonth = getNextMonth();
    setFormData({
      ...formData,
      batch: newBatch,
      batchChangeMonth: nextMonth,
    });
    setShowChangeBatchForm(false);
  };

  const getNextMonth = () => {
    const currentDate = new Date();
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(currentDate.getMonth() + 1);
    return nextMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="admission-form-container">
      <h1>Yoga Class Admission</h1>
      <form onSubmit={handleSubmit} className="admission-form">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Age:</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
        />

        <label>Preferred Batch:</label>
        <select
          name="batch"
          value={formData.batch}
          onChange={handleChange}
          required
        >
          <option value="">Select Batch</option>
          <option value="6-7AM">6-7AM</option>
          <option value="7-8AM">7-8AM</option>
          <option value="8-9AM">8-9AM</option>
          <option value="5-6PM">5-6PM</option>
        </select>

        <button type="button" onClick={handleShowChangeBatchForm}>
          Change Batch
        </button>

        <button type="submit">Submit</button>
      </form>

      {showChangeBatchForm && (
        <div className="change-batch-form">
          <h2>Change Batch</h2>
          <label>New Preferred Batch:</label>
          <select
            name="newBatch"
            value={formData.batch}
            onChange={(e) =>
              setFormData({ ...formData, batch: e.target.value })
            }
            required
          >
            <option value="">Select Batch</option>
            <option value="6-7AM">6-7AM</option>
            <option value="7-8AM">7-8AM</option>
            <option value="8-9AM">8-9AM</option>
            <option value="5-6PM">5-6PM</option>
          </select>
          <button onClick={handleCancelChangeBatch}>Cancel</button>
          <button onClick={() => handleChangeBatch(formData.batch)}>
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default AdmissionForm;
