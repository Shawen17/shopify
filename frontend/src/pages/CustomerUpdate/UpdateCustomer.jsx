import { useState, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FilterContainer,
  Input,
  SearchItem,
  SearchTitle,
  SearchButton,
  SearchItems,
  Select,
} from "../../components/CustomerForm/CustomerForm.styles";
import { mergeFields } from "../ApiHelper";
import { getCompanybyId } from "../../components/CustomerForm/CustomerForm";
import { countries, getCompanies } from "../../pages/ApiHelper";

const firstNameKey = ["first_name"];
const lastNameKey = ["last_name"];
const countryKey = ["country"];
const phoneKey = ["phone"];
const emailKey = ["email"];
const companyIdKey = ["company"];
const address1Key = ["address1"];

const UpdateCustomer = () => {
  const [input, setInputs] = useState({});
  const [companies, setCompanies] = useState([]);
  const [msg, setMsg] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const user = location.state;

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
    if (Object.keys(input).length === 0) {
      setMsg("You have not updated any info");
      return;
    }

    try {
      const form = new FormData();

      const first_name = mergeFields(input, firstNameKey);
      const last_name = mergeFields(input, lastNameKey);
      const email = mergeFields(input, emailKey);
      const phone = mergeFields(input, phoneKey);
      const country = mergeFields(input, countryKey);
      const company = mergeFields(input, companyIdKey);
      const address1 = mergeFields(input, address1Key);

      let company_name;
      if (input.company) {
        company_name = getCompanybyId(Number(company.company), companies);
      }

      const address = {};
      Object.keys(first_name).length > 0 &&
        form.append("first_name", first_name.first_name);
      Object.keys(last_name).length > 0 &&
        form.append("last_name", last_name.last_name);
      Object.keys(email).length > 0 && form.append("email", email.email);

      if (Object.keys(phone).length > 0) {
        address["phone"] = phone.phone;
      }

      if (Object.keys(country).length > 0) {
        address["country"] = country.country;
      }
      if (Object.keys(address1).length > 0) {
        address["address1"] = address1.address1;
      }
      if (Object.keys(company).length > 0) {
        address["company"] = company_name;
        form.append("companyId", company.company);
      }

      Object.keys(address).length > 0 &&
        form.append("addresses", JSON.stringify(address));

      const res = await axios.put(
        `http://localhost:9000/api/customers/${user.id}`,
        form,
        config
      );
      if (res.status === 200) {
        setMsg(res.data.message);
      } else {
        setMsg("Unexpected response from the server");
      }
    } catch (err) {
      console.log(err.message);
      setMsg(err.message);
    }
    setInputs({});
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
      <h3 className="m-5">
        <b>Edit details</b>
      </h3>
      <div className="flex justify-start mb-3 mr-auto">
        <button onClick={moveBack}>
          <ArrowBackIcon />
        </button>
      </div>
      <p className="m-3" style={{ color: "green" }}>
        {msg ? msg : ""}
      </p>
      <FilterContainer onSubmit={handleSubmit}>
        <SearchItems>
          <SearchItem>
            <SearchTitle>FirstName</SearchTitle>
            <Input
              type="text"
              name="first_name"
              value={input.first_name || user.first_name}
              onChange={handleChange}
            />
          </SearchItem>
          <SearchItem>
            <SearchTitle>LastName</SearchTitle>
            <Input
              type="text"
              name="last_name"
              value={input.last_name || user.last_name}
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
              value={input.email || user?.email}
              onChange={handleChange}
            />
          </SearchItem>
          <SearchItem>
            <SearchTitle>PhoneNumber</SearchTitle>
            <Input
              type="text"
              name="phone"
              value={input.phone || user?.addresses[0]?.phone}
              onChange={handleChange}
            />
          </SearchItem>
        </SearchItems>
        <SearchItem>
          <SearchTitle>Address1</SearchTitle>
          <Input
            type="text"
            name="address1"
            value={input.address1 || user?.addresses[0]?.address1}
            onChange={handleChange}
          />
        </SearchItem>
        <SearchItems>
          <SearchItem>
            <SearchTitle>Company</SearchTitle>
            <Select
              name="company"
              value={input.company || user?.addresses[0]?.company}
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
              value={input.country || user?.addresses[0]?.country}
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

export default UpdateCustomer;
