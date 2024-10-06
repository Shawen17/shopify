import { useState } from "react";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FilterContainer,
  Input,
  SearchItem,
  SearchTitle,
  SearchButton,
  SearchItems,
} from "../../components/CustomerForm/CustomerForm.styles";

const UpdateCompany = () => {
  const [input, setInputs] = useState({});
  const [msg, setMsg] = useState("");
  const location = useLocation();
  const user = location.state;
  const navigate = useNavigate();

  const handleChange = (event) => {
    setMsg("");
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (Object.keys(input).length === 0) {
      setMsg("You have not updated any info");
      return;
    }
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = {};
    if (input.name) {
      body["name"] = input.name;
    }
    if (input.address) {
      body["address"] = input.address;
    }

    try {
      const res = await axios.put(
        `http://localhost:9000/api/companies/${user.id}`,
        body,
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
      <h3 className="m-7">
        <b>Edit Company Details</b>
      </h3>
      <div className="flex justify-start mb-3 mr-auto">
        <button onClick={moveBack}>
          <ArrowBackIcon />
        </button>
      </div>
      <p style={{ color: "green", margin: 4 }}>{msg ? msg : ""}</p>
      <FilterContainer onSubmit={handleSubmit}>
        <SearchItems>
          <SearchItem>
            <SearchTitle>Name</SearchTitle>
            <Input
              type="text"
              name="name"
              value={input.name || user.name}
              onChange={handleChange}
            />
          </SearchItem>
          <SearchItem>
            <SearchTitle>Address</SearchTitle>
            <Input
              type="text"
              name="address"
              value={input.address || user.address}
              onChange={handleChange}
            />
          </SearchItem>
        </SearchItems>
        <SearchButton type="submit">Submit</SearchButton>
      </FilterContainer>
    </div>
  );
};

export default UpdateCompany;
