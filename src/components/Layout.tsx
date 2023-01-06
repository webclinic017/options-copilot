import React from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="h-screen flex flex-row justify-start">
      <Sidebar />
      <div className="w-full flex-1  p-14 overflow-auto relative bg-neutral">
        {children}
      </div>
    </div>
  );
};

export default Layout;
