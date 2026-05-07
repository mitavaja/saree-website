import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contact = () => {
  const [contacts, setContacts] = useState([]);

  // ✅ FETCH
  const fetchContacts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/contact/all");
      setContacts(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load messages", {
        position: "top-right",
        autoClose: 2000
      });
    }
  };

  // ✅ DELETE (NO CONFIRM)
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/contact/${id}`);
      toast.error("Message deleted successfully", {
        position: "top-right",
        autoClose: 2000
      });
      fetchContacts();
    } catch {
      toast.error("Delete failed", {
        position: "top-right",
        autoClose: 2000
      });
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="p-6">

      <ToastContainer />

              <h1 className="text-3xl font-bold text-[#082e21] mb-6">Contact Messages</h1>


      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="w-full border">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border text-left">Name</th>
              <th className="p-3 border text-left">Email</th>
              <th className="p-3 border text-left">Message</th>
              <th className="p-3 border text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {contacts.length > 0 ? (
              contacts.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="p-3 border">{item.name}</td>
                  <td className="p-3 border">{item.email}</td>
                  <td className="p-3 border">{item.message}</td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:scale-110 text-xl"
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No messages found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default Contact;