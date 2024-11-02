import React, { useState, useEffect } from "react";

const ItemForm = ({ existingItem = null, onSuccess, method, fetchItems }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [id, setId] = useState(null);

  useEffect(() => {
    if (existingItem) {
      setFirstName(existingItem.first_name);
      setLastName(existingItem.last_name);
      setEmail(existingItem.email);
      setGender(existingItem.gender);
      setId(existingItem.id);
    }
  }, [existingItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const itemData = {
      first_name: firstName,
      last_name: lastName,
      gender,
      email,
    };
    const endpoint =
      method === "PUT"
        ? `http://localhost:3333/api/contacts/${id}`
        : "http://localhost:3333/api/contacts";

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Success:", result);
      await onSuccess(result);

      fetchItems();

      setFirstName("");
      setLastName("");
      setEmail("");
      setGender("");
      setId(null);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{method === "PUT" ? "Update" : "Create"} Contact</h2>

      <label>
        First Name:
        <input
          type='text'
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </label>
      <br />

      <label>
        Last Name:
        <input
          type='text'
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </label>
      <br />

      <label>
        Email:
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <br />

      <label>
        Gender:
        <input
          type='text'
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        />
      </label>
      <br />

      <button type='submit'>
        {method === "PUT" ? "Update" : "Create"} Contact
      </button>
    </form>
  );
};

export default ItemForm;
