import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const DeliveryFee = () => {

  const [stateName, setStateName] = useState("");
  const [fee, setFee] = useState("");
  const [list, setList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // ✅ INDIA STATES LIST
  const states = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
    "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand",
    "Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
    "Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
    "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
    "Uttar Pradesh","Uttarakhand","West Bengal"
  ];

  // ✅ FETCH DATA
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/delivery/all");

      if (res.data.success && Array.isArray(res.data.data)) {
        setList(res.data.data);
      } else {
        setList([]);
      }

    } catch (error) {
      setList([]);
      toast.error("Failed to load data", {
        position: "top-right",
        autoClose: 2000
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ STATE INPUT + SUGGESTION
  const handleStateChange = (e) => {
    const value = e.target.value;
    setStateName(value);

    if (value.length > 0) {
      const filtered = states.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const selectState = (state) => {
    setStateName(state);
    setSuggestions([]);
  };

  // ✅ ADD / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stateName || !fee) {
      return toast.error("Fill all fields", {
        position: "top-right",
        autoClose: 2000
      });
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/delivery/set",
        {
          state: stateName.trim(),
          fee: Number(fee),
        }
      );

      if (res.data.success) {
        toast.success("Saved successfully", {
          position: "top-right",
          autoClose: 2000
        });

        setStateName("");
        setFee("");
        setSuggestions([]);
        fetchData();
      }

    } catch (error) {
      toast.error("Error saving", {
        position: "top-right",
        autoClose: 2000
      });
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/delivery/${id}`
      );

      if (res.data.success) {
        toast.error("Deleted successfully", {
          position: "top-right",
          autoClose: 2000
        });
        fetchData();
      }

    } catch (error) {
      toast.error("Delete failed", {
        position: "top-right",
        autoClose: 2000
      });
    }
  };

  return (
    <div className="p-6">

      {/* ✅ SAME AS CATEGORY */}
      <ToastContainer />

              <h1 className="text-3xl font-bold text-[#082e21]">Delivery Fee Management</h1>


      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-6 rounded mb-8 max-w-md relative"
      >
        {/* STATE INPUT */}
        <input
          type="text"
          placeholder="Enter State (e.g. Gujarat)"
          value={stateName}
          onChange={handleStateChange}
          className="border p-2 w-full mb-1"
        />

        {/* SUGGESTION */}
        {suggestions.length > 0 && (
          <div className="border bg-white max-h-40 overflow-y-auto mb-3">
            {suggestions.map((s, i) => (
              <div
                key={i}
                onClick={() => selectState(s)}
                className="p-2 cursor-pointer hover:bg-gray-100"
              >
                {s}
              </div>
            ))}
          </div>
        )}

        {/* FEE */}
        <input
          type="number"
          placeholder="Enter Fee"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          className="border p-2 w-full mb-4"
        />

        <button className="bg-[#082e21] text-[#ecc153] px-4 py-2 rounded w-full">
          Save
        </button>
      </form>

      {/* TABLE */}
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full text-left">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">State</th>
              <th className="p-3">Fee</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {list && list.length > 0 ? (
              list.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="p-3">{item.state}</td>
                  <td className="p-3">₹{item.fee}</td>
                  <td className="p-3 text-center">
                    <FaTrash
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:scale-110 cursor-pointer mx-auto"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">
                  No Delivery Fees Found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default DeliveryFee;