import React, { useState, useEffect } from "react";
import ItemForm from "./ItemUpdate";
import "../styles/Modal.css";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3333/api/contacts");
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Fetched items:", data);
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  console.log({ items });

  const openModal = (item, method) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    setSelectedMethod(method);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
    setSelectedMethod(null);
  };

  const deleteHandler = async (id) => {
    console.log("Deleting ID:", id);
    try {
      const response = await fetch(`http://localhost:3333/api/contacts/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      console.log("Delete successful:", response);
      await fetchItems();
    } catch (error) {
      console.error("Failed to delete contact:", error);
    }
  };

  return (
    <div>
      <h2>Contact List</h2>

      <button onClick={() => openModal(null, "POST")}>create</button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {items?.map((item) => (
            <li key={item.id}>
              {item.first_name} - {item.last_name} - {item.email} -{" "}
              {item.gender} - {"    "}
              <button onClick={() => openModal(item, "PUT")}>
                update
              </button>{" "}
              {"    "}
              <button onClick={() => deleteHandler(item.id)}>delete</button>
            </li>
          ))}
        </ul>
      )}

      {isModalOpen && (
        <div className='modal'>
          <div className='modal-content'>
            <button onClick={closeModal}>Close</button>
            <ItemForm
              existingItem={selectedItem}
              onSuccess={(updatedItem) => {
                setItems((prevItems) =>
                  prevItems.map((item) =>
                    item.id === updatedItem.id ? updatedItem : item
                  )
                );
                closeModal();
              }}
              method={selectedMethod}
              fetchItems={fetchItems}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemList;
