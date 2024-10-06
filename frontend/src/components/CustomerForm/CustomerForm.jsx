import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  FilterContainer,
  Input,
  SearchItem,
  SearchTitle,
  SearchButton,
  SearchItems,
  Select,
} from "./CustomerForm.styles";
import { countries, getCompanies } from "../../pages/ApiHelper";

export const getCompanybyId = (id, companies) => {
  const com = companies.filter((item) => item.id === id);
  return com[0].name;
};

const CustomerForm = () => {
  const [input, setInputs] = useState({});
  const [companies, setCompanies] = useState([]);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      const { result, errorMessage } = await getCompanies();
      if (errorMessage) {
        setMsg(errorMessage);
      }
      setCompanies(result);
    };

    fetchCompanies();
  }, []);

  const handleChange = (event) => {
    setMsg("");
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    if (Object.keys(input).length === 7) {
      try {
        const form = new FormData();
        const company = getCompanybyId(Number(input.company), companies);
        const addresses = {
          company: company,
          address1: input.address1,
          phone: input.phone,
          country: input.country,
        };
        form.append("first_name", input.first_name);
        form.append("last_name", input.last_name);
        form.append("email", input.email);
        form.append("addresses", JSON.stringify(addresses));
        form.append("companyId", input.company);
        const res = await axios.post(
          "http://localhost:9000/api/customer",
          form,
          config
        );
        if (res.status === 201) {
          setMsg(res.data.message);
          setInputs({});
        } else {
          setMsg("Unexpected response from the server");
        }
      } catch (err) {
        console.log(err.message);
        setMsg(err.message);
      }
    } else {
      setMsg("All fields are required");
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const moveBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 h-full">
      <h3 className="mb-5">
        <b>Create New Customer</b>
      </h3>
      <div className="flex justify-start mb-3 mr-auto">
        <button onClick={moveBack}>
          <ArrowBackIcon />
        </button>
      </div>
      <p style={{ color: "green", margin: 3 }}>{msg ? msg : ""}</p>
      <FilterContainer onSubmit={handleSubmit}>
        <SearchItems>
          <SearchItem>
            <SearchTitle>FirstName</SearchTitle>
            <Input
              type="text"
              name="first_name"
              value={input.first_name || ""}
              onChange={handleChange}
            />
          </SearchItem>
          <SearchItem>
            <SearchTitle>LastName</SearchTitle>
            <Input
              type="text"
              name="last_name"
              value={input.last_name || ""}
              onChange={handleChange}
            />
          </SearchItem>
        </SearchItems>
        <SearchItems>
          <SearchItem>
            <SearchTitle>Email</SearchTitle>
            <Input
              type="text"
              name="email"
              value={input.email || ""}
              onChange={handleChange}
            />
          </SearchItem>
          <SearchItem>
            <SearchTitle>PhoneNumber</SearchTitle>
            <Input
              type="text"
              name="phone"
              value={input.phone || ""}
              onChange={handleChange}
            />
          </SearchItem>
        </SearchItems>

        <SearchItem style={{ width: "70%" }}>
          <SearchTitle>Address1</SearchTitle>
          <Input
            style={{ width: "100%" }}
            type="text"
            name="address1"
            value={input.address1 || ""}
            onChange={handleChange}
          />
        </SearchItem>
        <SearchItems>
          <SearchItem>
            <SearchTitle>Company</SearchTitle>
            <Select
              name="company"
              value={input.company || ""}
              onChange={handleChange}
            >
              <option value="">select</option>
              {companies.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </SearchItem>
          <SearchItem>
            <SearchTitle>Country</SearchTitle>
            <Select
              name="country"
              value={input.country || ""}
              onChange={handleChange}
            >
              <option value="">select</option>
              {countries.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </Select>
          </SearchItem>
        </SearchItems>
        <SearchButton type="submit">Submit</SearchButton>
      </FilterContainer>
    </div>
  );
};

export default CustomerForm;
