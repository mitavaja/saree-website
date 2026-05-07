import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {

  const [open, setOpen] = useState(true);

  return (

    <div>

      <Sidebar open={open} setOpen={setOpen} />

      <div
        className={`transition-all duration-300 ${
          open ? "ml-64" : "ml-20"
        }`}
      >
        <Outlet />
      </div>

    </div>

  );

};

export default Layout;