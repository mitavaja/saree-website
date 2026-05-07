import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  MdVisibility,
  MdSearch,
  MdDownload,
  MdLocalShipping,
  MdDelete
} from "react-icons/md";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import QRCode from "qrcode";


const Orders = () => {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  
  // New states for Bulk Invoice Download
  const [invoiceStartDate, setInvoiceStartDate] = useState("");
  const [invoiceEndDate, setInvoiceEndDate] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/order/list");

      if (res.data.success) {
        const formattedOrders = res.data.orders.map((o, index) => {
          let productItems = [];

          if (Array.isArray(o.items)) {
            productItems = o.items.map((i) => ({
              name: i.name || "Product",
              image: i.image || "",
              price: i.price || 0,
              quantity: i.quantity || 1
            }));
          } else if (typeof o.items === "object") {
            productItems = Object.keys(o.items).map((key) => ({
              name: key,
              image: "",
              price: 0,
              quantity: 1
            }));
          }

          const rawDateStr = new Date(o.date).toISOString().split("T")[0];
          const addressObj = o.address || {};
          const fullAddress = `${addressObj.address || ""} ${addressObj.city || ""} ${addressObj.state || ""} ${addressObj.pincode || ""}`.trim().replace(/\s+/g, ' ');

          return {
            id: o._id,
            orderNumber: "#ORD" + (1000 + index + 1),
            customer: addressObj.name || "Customer",
            phone: addressObj.phone || "N/A",
            address: fullAddress || "N/A",
            date: rawDateStr,
            total: "₹" + o.amount,
            status: o.status || "Pending",
            tracking: o.status || "Processing",
            items: productItems
          };
        });

        setOrders(formattedOrders);
      }
    } catch (error) {
      console.log(error);
    }
  }, []); 

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter(
    (o) =>
      o.customer.toLowerCase().includes(search.toLowerCase()) &&
      (dateFilter === "" || o.date === dateFilter)
  );

  const today = new Date().toISOString().split("T")[0];

  const todayOrders = orders.filter((o) => o.date === today).length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;

  const statusStyle = (status) => {
    switch (status) {
      case "Pending": return "bg-gray-100 text-gray-700";
      case "Processing": return "bg-blue-100 text-blue-700";
      case "Shipped": return "bg-yellow-100 text-yellow-700";
      case "Out for Delivery": return "bg-purple-100 text-purple-700";
      case "Delivered": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/order/update-status/${orderId}`,
        { status: newStatus }
      );

      if (res.data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId
              ? { ...order, status: newStatus, tracking: newStatus }
              : order
          )
        );

        // ✅ Light blue info toast
        toast.info("Order status updated");
      }
    } catch (error) {
      console.log(error);
      toast.error("Server error while updating status");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/order/delete/${orderId}`
      );

      if (res.data.success) {
        setOrders((prev) => prev.filter((order) => order.id !== orderId));
        // ✅ Red error toast
        toast.error("Order deleted successfully");
      } else {
        toast.error("Failed to delete order");
      }
    } catch (error) {
      console.log(error);
      toast.error("Server error");
    }
  };

 const drawInvoicePage = (pdf, order) => {
  const pageWidth = pdf.internal.pageSize.getWidth();

  // HEADER COLOR
  pdf.setFillColor(8, 46, 33);
  pdf.rect(0, 0, pageWidth, 30, "F");

  // LOGO (PROPER SIZE)
  try {
    pdf.addImage("/logo.png", "PNG", 10, 5, 40, 20);
  } catch (e) {}

  // UNIQUE INVOICE NUMBER (4 DIGITS)
  const invoiceNumber = Math.floor(1000 + Math.random() * 9000);

  // TITLE
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.text("INVOICE", pageWidth - 50, 18);

  // INVOICE NUMBER
  pdf.setFontSize(10);
  pdf.text(`No: ${invoiceNumber}`, pageWidth - 50, 24);

  // RESET COLOR
  pdf.setTextColor(0, 0, 0);

  let y = 45;

  // CUSTOMER DETAILS
  pdf.setFontSize(11);
  pdf.text(`Customer: ${order.customer}`, 20, y);
  y += 6;

  pdf.text(`Phone: ${order.phone}`, 20, y);
  y += 6;

  const splitAddress = pdf.splitTextToSize(
    `Address: ${order.address}`,
    pageWidth - 40
  );
  pdf.text(splitAddress, 20, y);
  y += splitAddress.length * 5 + 5;

  pdf.text(`Order: ${order.orderNumber}`, 20, y);
  y += 6;

  pdf.text(`Date: ${order.date}`, 20, y);
  y += 10;

  // TABLE HEADER
  pdf.setFillColor(240, 240, 240);
  pdf.rect(20, y - 5, pageWidth - 40, 8, "F");

  pdf.text("Product", 25, y);
  pdf.text("Price", 95, y);
  pdf.text("Qty", 125, y);
  pdf.text("Total", 155, y);

  y += 12;

  let total = 0;

  order.items.forEach((item) => {
    const qty = item.quantity;
    const t = item.price * qty;
    total += t;

    // IMAGE
    try {
      pdf.addImage(item.image, "JPEG", 20, y - 5, 15, 15);
    } catch {}

    pdf.text(item.name.substring(0, 18), 40, y + 3);

    // FIX: NO ₹ (avoids "1 7000" issue)
    pdf.text(`Rs. ${item.price}`, 95, y + 3);
    pdf.text(`${qty}`, 125, y + 3);
    pdf.text(`Rs. ${t}`, 155, y + 3);

    y += 18;
  });

  // GRAND TOTAL
  pdf.setFont(undefined, "bold");
  pdf.text(`Grand Total: Rs. ${total}`, 130, y + 10);
  pdf.setFont(undefined, "normal");

  // RETURN ADDRESS
  pdf.setFontSize(10);
  pdf.text("Return Address:", 20, y + 25);
  pdf.text("Laxman Nagar Saree", 20, y + 32);
  pdf.text("Surat, Gujarat - 395002", 20, y + 38);
  pdf.text("Phone: 9999999999", 20, y + 44);

  // THANK YOU
  pdf.text("Thank you for your purchase!", 20, y + 60);
};

  const handleDownloadInvoice = (order) => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      drawInvoicePage(pdf, order);
      pdf.save(`invoice-${order.orderNumber}.pdf`);
    } catch (error) {
      toast.error("Invoice error");
    }
  };

  const handleBulkDownload = () => {
    if (!invoiceStartDate || !invoiceEndDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    const start = new Date(invoiceStartDate);
    const end = new Date(invoiceEndDate);

    if (start > end) {
      toast.error("Start date cannot be after end date");
      return;
    }

    const targetOrders = orders.filter(o => {
      const orderDate = new Date(o.date);
      return orderDate >= start && orderDate <= end;
    });

    if (targetOrders.length === 0) {
      toast.error("No orders found in this date range");
      return;
    }

    try {
      const pdf = new jsPDF("p", "mm", "a4");
      
      targetOrders.forEach((order, index) => {
        if (index > 0) {
          pdf.addPage();
        }
        drawInvoicePage(pdf, order);
      });

      pdf.save(`bulk-invoices-${invoiceStartDate}-to-${invoiceEndDate}.pdf`);
      toast.success(`Downloaded ${targetOrders.length} invoices`);
    } catch (error) {
      console.log(error);
      toast.error("Error generating bulk invoices");
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-[#082e21] mb-6">Orders</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-5 shadow">
          <p className="text-gray-500 text-sm">Today Orders</p>
          <h2 className="text-3xl font-bold text-[#082e21]">{todayOrders}</h2>
        </div>

        <div className="bg-white rounded-xl p-5 shadow">
          <p className="text-gray-500 text-sm">Pending Orders</p>
          <h2 className="text-3xl font-bold text-yellow-600">{pendingOrders}</h2>
        </div>

        <div className="bg-white rounded-xl p-5 shadow">
          <p className="text-gray-500 text-sm">Delivered</p>
          <h2 className="text-3xl font-bold text-green-600">{deliveredOrders}</h2>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center bg-white rounded-lg shadow px-3 w-72">
          <MdSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 w-full outline-none"
          />
        </div>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="bg-white shadow rounded-lg px-4 py-2"
        />

        {/* Bulk Invoice Downloader */}
        <div className="flex items-center bg-white shadow rounded-lg px-4 py-2 gap-2 border border-gray-100 ml-auto md:ml-0">
          <span className="text-sm font-medium text-[#082e21]">Invoices:</span>
          <input
            type="date"
            value={invoiceStartDate}
            onChange={(e) => setInvoiceStartDate(e.target.value)}
            className="outline-none text-sm bg-transparent cursor-pointer"
            title="Start Date"
          />
          <span className="text-gray-400 text-sm">to</span>
          <input
            type="date"
            value={invoiceEndDate}
            onChange={(e) => setInvoiceEndDate(e.target.value)}
            className="outline-none text-sm bg-transparent cursor-pointer"
            title="End Date"
          />
          <button
            onClick={handleBulkDownload}
            className="flex items-center gap-1 bg-[#082e21] text-white px-3 py-1.5 rounded hover:bg-[#0a4d36] transition-colors shadow-sm ml-2"
            title="Download Bulk Invoices"
          >
            <MdDownload size={16} />
            <span className="text-sm font-medium hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Tracking</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((o) => (
              <tr key={o.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium text-[#082e21]">
                  {o.orderNumber}
                </td>
                <td className="p-4">{o.customer}</td>
                <td className="p-4">{o.date}</td>
                <td className="p-4 font-semibold">{o.total}</td>
                <td className="p-4">
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    className={`px-3 py-1 text-xs rounded font-medium outline-none border-none cursor-pointer ${statusStyle(o.status)}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
                <td className="p-4 flex items-center gap-2 text-gray-600">
                  <MdLocalShipping />
                  {o.tracking}
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-[#082e21]"
                    >
                      <MdVisibility size={20} />
                    </button>
                    <button
                      onClick={() => handleDownloadInvoice(o)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                      title="Download Invoice"
                    >
                      <MdDownload size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(o.id)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-red-500"
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-[500px] shadow-xl">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold text-[#082e21]">
                Order Details
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500"
              >
                ✕
              </button>
            </div>

            <div id="invoice" className="text-sm">
              <div className="mb-4 border-b pb-2">
                <h2 className="text-lg font-bold">Laxman Nagar Saree</h2>
                <p className="text-gray-500 text-xs">Surat, Gujarat</p>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <p><b>Order ID:</b> {selectedOrder.orderNumber}</p>
                <p><b>Date:</b> {selectedOrder.date}</p>
                <p><b>Customer:</b> {selectedOrder.customer}</p>
                <p><b>Phone:</b> {selectedOrder.phone}</p>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded border text-gray-700">
                <p className="font-semibold mb-1">Delivery Address:</p>
                <p>{selectedOrder.address}</p>
              </div>

              <table className="w-full text-xs border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Product</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Qty</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedOrder.items.map((item, i) => {
                    const qty = item.quantity || 1;
                    return (
                      <tr key={i} className="border-t">
                        <td className="p-2 flex items-center gap-2">
                          <img
                            src={item.image || "/no-image.png"}
                            className="w-8 h-8 object-cover rounded"
                            onError={(e) => (e.target.src = "/no-image.png")}
                          />
                          {item.name}
                        </td>
                        <td className="p-2 text-center">₹{item.price}</td>
                        <td className="p-2 text-center">{qty}</td>
                        <td className="p-2 text-center">₹{item.price * qty}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="text-right mt-3 font-semibold">
                Total: {selectedOrder.total}
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Thank you for your purchase!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;