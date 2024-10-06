import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import AdminCustomerDashboard from "./pages/CustomerDashboard/AdminCustomerDashboard";
import Companies from "./pages/CompanyPage/Companies";
import Home from "./pages/HomePage/Home";
import AddCustomer from "./pages/AddCustomerPage/AddCustomer";
import AddCompany from "./pages/AddCompanyPage/AddCompany";
import UpdateCustomer from "./pages/CustomerUpdate/UpdateCustomer";
import UpdateCompany from "./pages/UpdateCompany/UpdateCompany";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/customers" exact element={<AdminCustomerDashboard />} />
        <Route path="/companies" exact element={<Companies />} />
        <Route path="/add/customer" exact element={<AddCustomer />} />
        <Route path="/add/company" exact element={<AddCompany />} />
        <Route path="/update-customer" exact element={<UpdateCustomer />} />
        <Route path="/update-company" exact element={<UpdateCompany />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
