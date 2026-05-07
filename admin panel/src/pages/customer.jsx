import { useEffect, useState } from "react";
import axios from "axios";

const Customers = () => {

  const [customers,setCustomers] = useState([])

  useEffect(()=>{

    const fetchCustomers = async ()=>{

      try {

        const res = await axios.get("http://localhost:5000/api/order/list")

        const orders = res.data.orders

        const uniqueCustomers = {}

        orders.forEach(order=>{

          const email = order.address?.email
          const addressObj = order.address || {}
          const fullAddress = `${addressObj.address || ""} ${addressObj.city || ""} ${addressObj.state || ""} ${addressObj.pincode || ""}`.trim().replace(/\s+/g, ' ') || "-"

          if(email && !uniqueCustomers[email]){

            uniqueCustomers[email] = {
              name: order.address?.name || "Customer",
              email: order.address?.email || "-",
              phone: order.address?.phone || "-",
              address: fullAddress
            }

          }

        })

        setCustomers(Object.values(uniqueCustomers))

      } catch (error) {

        console.log(error)

      }

    }

    fetchCustomers()

  },[])

  return (

    <div className="flex-1 p-8 bg-gray-100 min-h-screen">

              <h1 className="text-3xl font-bold text-[#082e21] mb-6">Customers</h1>


      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-lg font-semibold mb-4">
          All Customers
        </h2>

        <table className="w-full text-left">

          <thead className="bg-gray-100 text-gray-600">

            <tr>

              <th className="p-3">ID</th>
              <th className="p-3">NAME</th>
              <th className="p-3">EMAIL</th>
              <th className="p-3">PHONE</th>
              <th className="p-3">ADDRESS</th>

            </tr>

          </thead>

          <tbody>

            {customers.map((customer,index)=>(

              <tr key={index} className="border-b">

                <td className="p-3">
                  {index+1}
                </td>

                <td className="p-3">
                  {customer.name}
                </td>

                <td className="p-3">
                  {customer.email}
                </td>

                <td className="p-3">
                  {customer.phone}
                </td>

                <td className="p-3">
                  {customer.address}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  )

}

export default Customers