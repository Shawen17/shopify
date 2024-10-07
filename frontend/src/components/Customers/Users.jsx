import React, { useState, useContext } from "react";
import styled from "styled-components";
import { MoreVertOutlined } from "@material-ui/icons";
import DeleteIcon from "@mui/icons-material/Delete";
import { FrontArrow, BackArrow } from "./Users.styles";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../utility/ContextManager";
import { StyledTable } from "../CustomerForm/CustomerForm.styles";

export const Button = styled.button`
  background-color: darkcyan;
  height: 40px;
  padding: 8px;
  color: white;
  border-radius: 6px;
  &:hover {
    transform: scale(0.95);
    transition: transform 0.5s ease-in-out;
  }
`;

const Users = ({
  removeUser,
  handleNextPage,
  handlePrevPage,
  prevPageInfo,
  nextPageInfo,
}) => {
  const [menu, setMenu] = useState();
  const [submenu, setSubmenu] = useState(false);
  const data = useContext(UserContext);

  const navigate = useNavigate();

  const displayDetails = (person, path) => {
    setMenu();
    navigate(path, { state: person });
  };

  const displayMenu = (index) => {
    setMenu(index);
  };

  const formatDate = (str) => {
    let date = new Date(str);
    return date.toDateString();
  };
  const createNew = () => {
    navigate("/add/customer");
  };

  const path = "http://localhost:9000/api/customer";

  return (
    <div style={{ borderRadius: "6px", backgroundColor: "white" }}>
      <div className="flex justify-end items-end mb-3">
        <Button onClick={createNew}>Create New</Button>
      </div>
      <StyledTable>
        <thead>
          <tr>
            <th>FIRSTNAME</th>
            <th>LASTNAME</th>
            <th>EMAIL</th>
            <th>PHONE NUMBER</th>
            <th>COMPANY</th>
            <th>COUNTRY</th>
            <th>DATE JOINED</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {data.length > 0 &&
            data.map((user, index) => {
              return (
                <tr
                  key={index}
                  style={{
                    borderBottom: "1px solid #ccc",
                    height: "60px",
                    opacity: 1,
                    justifyContent: "center",
                  }}
                >
                  <td
                    className="nav-link sidebar-link"
                    style={{ cursor: "pointer" }}
                    onClick={() => displayDetails(user, "/update-customer")}
                  >
                    {user.first_name}
                  </td>
                  <td>{user.last_name}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.addresses.length > 0 && user.addresses[0]?.phone
                      ? user.addresses[0].phone
                      : ""}{" "}
                  </td>
                  <td>
                    {user.addresses.length > 0 && user.addresses[0]?.company
                      ? user.addresses[0].company
                      : ""}
                  </td>
                  <td>
                    {user.addresses.length > 0 && user.addresses[0]?.country
                      ? user.addresses[0].country
                      : ""}
                  </td>
                  <td>{formatDate(user.created_at)}</td>
                  <td>
                    <button
                      onClick={() => {
                        displayMenu(index);
                        setSubmenu(!submenu);
                      }}
                      style={{ border: "none", backgroundColor: "white" }}
                    >
                      <MoreVertOutlined className="menu-bar" />
                      <ul
                        className={
                          menu === index && submenu
                            ? "show-menu-options"
                            : "hide-menu-options"
                        }
                      >
                        <li
                          onClick={() => {
                            removeUser(path, user.id);
                          }}
                        >
                          <DeleteIcon />
                        </li>
                      </ul>
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </StyledTable>
      <div className="flex justify-center items-center space-x-4 mt-5">
        <button
          className="p-2 bg-gray-300 rounded"
          onClick={handlePrevPage}
          disabled={!prevPageInfo}
        >
          <BackArrow prevPageInfo={prevPageInfo} style={{ fontSize: 12 }} />
        </button>
        <button
          className="p-2 bg-gray-300 rounded"
          onClick={handleNextPage}
          disabled={!nextPageInfo}
        >
          <FrontArrow nextPageInfo={nextPageInfo} style={{ fontSize: 12 }} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(Users);
