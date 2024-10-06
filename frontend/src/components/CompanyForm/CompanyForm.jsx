import { useState } from "react";
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
} from "../CustomerForm/CustomerForm.styles";

const CompanyForm = () => {
  const [input, setInputs] = useState({});
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const moveBack = () => {
    navigate(-1);
  };
  const handleChange = (event) => {
    setMsg("");
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!input.name || !input.address) {
      setMsg("Please fill out all fields.");
      return;
    }
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const body = {
        name: input.name,
        address: input.address,
      };
      const res = await axios.post(
        "http://localhost:9000/api/company",
        body,
        config
      );
      if (res.status === 201) {
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

  return (
    <div className="flex flex-col items-center justify-center p-4 h-full">
      <h3 className="m-4">
        <b>Add New Company</b>
      </h3>
      <div className="flex justify-start mb-3 mr-auto">
        <button onClick={moveBack}>
          <ArrowBackIcon />
        </button>
      </div>
      <p style={{ color: "green" }}>{msg ? msg : ""}</p>
      <FilterContainer onSubmit={handleSubmit}>
        <SearchItems>
          <SearchItem>
            <SearchTitle>Name</SearchTitle>
            <Input
              type="text"
              name="name"
              value={input.name || ""}
              onChange={handleChange}
            />
          </SearchItem>
          <SearchItem>
            <SearchTitle>Address</SearchTitle>
            <Input
              type="text"
              name="address"
              value={input.address || ""}
              onChange={handleChange}
            />
          </SearchItem>
        </SearchItems>
        <SearchButton type="submit">Submit</SearchButton>
      </FilterContainer>
    </div>
  );
};

export default CompanyForm;
