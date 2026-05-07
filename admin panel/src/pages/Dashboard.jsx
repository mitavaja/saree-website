import { useEffect, useState } from "react";
import axios from "axios";

import { MdShoppingCart, MdInventory, MdCurrencyRupee, MdPeople, MdRefresh } from "react-icons/md";
import { getStats } from "../api/adminApi.js";

import CountUp from "react-countup";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const Dashboard = () => {

  const [productCount,setProductCount] = useState(0)
  const [orderCount,setOrderCount] = useState(0)
  const [customerCount,setCustomerCount] = useState(0)
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [revenue,setRevenue] = useState(0)

  const [salesGrowth,setSalesGrowth] = useState(0)
  const [conversionRate,setConversionRate] = useState(0)
  const [newCustomers,setNewCustomers] = useState(0)
  const [pendingOrders,setPendingOrders] = useState(0)

  // CHART STATE (dynamic)
  const [salesData,setSalesData] = useState([])

  // DYNAMIC CUSTOMER COUNT WITH POLLING
  useEffect(() => {
    const fetchCustomerStats = async () => {
      try {
        setIsLoadingStats(true);
        const data = await getStats();
        if (data.success) {
          setCustomerCount(data.stats.totalCustomers);
        }
      } catch (error) {
        console.error("Failed to fetch customer stats:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchCustomerStats();

    // Poll every 30 seconds for dynamic updates
    const interval = setInterval(fetchCustomerStats, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(()=>{

    const fetchProducts = async () => {

      try {

        const res = await axios.get("http://localhost:5000/api/product/list")

        setProductCount(res.data.products.length)

      } catch (error) {
        console.log(error)
      }

    }

    const fetchOrders = async () => {

      try {

        const res = await axios.get("http://localhost:5000/api/order/list")

        const orders = res.data.orders

        // TOTAL ORDERS
        setOrderCount(orders.length)

        // UNIQUE CUSTOMERS (fallback)
        const emails = new Set()

        orders.forEach(order=>{
          emails.add(order.email)
        })

        // Use API count primarily, fallback to this
        if (customerCount === 0) {
          setCustomerCount(emails.size)
        }

        // TOTAL REVENUE
        const totalRevenue = orders.reduce((sum,order)=>{
          return sum + (order.amount || order.totalAmount || 0)
        },0)

        setRevenue(totalRevenue)

        // PENDING ORDERS
        const pending = orders.filter(o=>o.status === "Pending")
        setPendingOrders(pending.length)

        // NEW CUSTOMERS (last 7 days)
        const lastWeek = new Date()
        lastWeek.setDate(lastWeek.getDate() - 7)

        const newCust = new Set()

        orders.forEach(o=>{
          if(new Date(o.date) > lastWeek){
            newCust.add(o.email)
          }
        })

        setNewCustomers(newCust.size)

        // SALES GROWTH
        const thisMonth = new Date().getMonth()
        const lastMonth = thisMonth - 1

        let thisMonthSales = 0
        let lastMonthSales = 0

        orders.forEach(o=>{
          const month = new Date(o.date).getMonth()
          const amount = o.amount || o.totalAmount || 0

          if(month === thisMonth) thisMonthSales += amount
          if(month === lastMonth) lastMonthSales += amount
        })

        if(lastMonthSales > 0){
          const growth = ((thisMonthSales - lastMonthSales) / lastMonthSales) * 100
          setSalesGrowth(growth.toFixed(1))
        }

        // CONVERSION RATE
        if(productCount > 0){
          setConversionRate(((orders.length / productCount) * 10).toFixed(1))
        }

        // ===== CHART DYNAMIC LOGIC =====

        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

        const monthSales = {}

        months.forEach(m=>{
          monthSales[m] = 0
        })

        orders.forEach(order=>{
          const date = new Date(order.date)
          const month = months[date.getMonth()]
          const amount = order.amount || order.totalAmount || 0
          monthSales[month] += amount
        })

        const chartData = months.map(m=>({
          month:m,
          sales:monthSales[m]
        }))

        setSalesData(chartData)

      } catch (error) {
        console.log(error)
      }

    }

    fetchProducts()
    fetchOrders()

  },[productCount])

  const stats = [
    { title: "Total Orders", value: orderCount, icon: <MdShoppingCart size={26} />, color: "bg-blue-500" },
    { title: "Products", value: productCount, icon: <MdInventory size={26} />, color: "bg-green-500" },
    { title: "Revenue", value: revenue, prefix:"₹", icon: <MdCurrencyRupee size={26} />, color: "bg-purple-500" },
    { title: "Customers", value: customerCount, icon: <MdPeople size={26} />, color: "bg-orange-500" }
  ];

  const topProducts = [
    { name: "Banarasi Silk Saree", sales: 120 },
    { name: "Designer Wedding Saree", sales: 98 },
    { name: "Cotton Printed Saree", sales: 85 },
    { name: "Party Wear Saree", sales: 70 }
  ];

  return (

    <div className="flex-1 min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold mb-8 text-green-900">
       Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        {stats.map((item,index)=>(
          <div
          key={index}
          className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between hover:shadow-xl hover:scale-105 transition duration-300"
          >
            <div>
              <p className="text-gray-500 text-sm">
                {item.title}
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-1 flex items-baseline gap-1">
                {item.prefix}
                {isLoadingStats && item.title === "Customers" ? (
                  <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <CountUp
                    end={item.value}
                    duration={2}
                    separator=","
                  />
                )}
              </h2>
            </div>

            <div className={`${item.color} text-white p-3 rounded-lg relative`}>
              {item.icon}
              {item.title === "Customers" && (
                <div className="absolute -top-1 -right-1 bg-white/80 p-0.5 rounded-full shadow-sm">
                  <MdRefresh size={10} className="text-xs text-gray-600 animate-spin-slow" />
                </div>
              )}
            </div>
          </div>

        ))}

      </div>

      {/* Chart */}

      <div className="bg-white rounded-xl shadow p-6 mb-10">

        <h2 className="text-lg font-semibold mb-4">
          Sales Overview
        </h2>

        <ResponsiveContainer width="100%" height={320}>

          <AreaChart data={salesData}>

            <defs>
              <linearGradient id="salesColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#166534" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#166534" stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

            <XAxis dataKey="month" />
            <YAxis />

            <Tooltip />

            <Area
            type="monotone"
            dataKey="sales"
            stroke="#166534"
            strokeWidth={3}
            fill="url(#salesColor)"
            dot={{ r:4 }}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-lg font-semibold mb-4">
            Top Selling Products
          </h2>

          <div className="space-y-4">

            {topProducts.map((product,index)=>(
              <div
              key={index}
              className="flex justify-between items-center border-b pb-2"
              >
                <p className="text-gray-700">
                  {product.name}
                </p>

                <span className="text-sm font-semibold text-green-700">
                  {product.sales} sales
                </span>
              </div>

            ))}

          </div>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-lg font-semibold mb-4">
            Store Analytics
          </h2>

          <div className="space-y-4 text-sm">

            <p>📈 Sales Growth: <span className="font-semibold text-green-600">+{salesGrowth}%</span></p>

            <p>🛒 Conversion Rate: <span className="font-semibold text-blue-600">{conversionRate}%</span></p>

            <p>👥 New Customers: <span className="font-semibold text-purple-600">{newCustomers}</span></p>

            <p>📦 Pending Orders: <span className="font-semibold text-orange-600">{pendingOrders}</span></p>

          </div>

        </div>

      </div>

    </div>

  )

}

export default Dashboard

