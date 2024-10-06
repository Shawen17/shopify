import React from "react";
import Header from "../components/Header/Header";

const navItem = [
  { label: "Customers", url: "/customers" },
  { label: "Companies", url: "/companies" },
];

const PageWrapper = ({ children }) => {
  return (
    <>
      <div className="top-0">
        <Header links={navItem} />
      </div>
      <div className="flex flex-col items-center justify-center p-4 h-full">
        {children}
      </div>
    </>
  );
};

export default PageWrapper;
