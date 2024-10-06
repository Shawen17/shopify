import React, { useContext, useState } from "react";
import { MoreVertOutlined } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../utility/ContextManager";
import { Button } from "../Customers/Users";
import DeleteIcon from "@mui/icons-material/Delete";
import { StyledTable } from "../CustomerForm/CustomerForm.styles";

const Company = ({ removeUser }) => {
  const data = useContext(UserContext);
  const [menu, setMenu] = useState();
  const [submenu, setSubmenu] = useState(false);

  const navigate = useNavigate();

  const displayMenu = (index) => {
    setMenu(index);
  };

  const displayDetails = (person, path) => {
    setMenu();
    navigate(path, { state: person });
  };

  const formatDate = (str) => {
    let date = new Date(str);
    return date.toDateString();
  };

  const createNew = () => {
    navigate("/add/company");
  };

  const path = "http://localhost:9000/api/company";

  return (
    <div
      style={{ borderRadius: "6px", backgroundColor: "white", width: "60%" }}
    >
      <div className="flex justify-end items-end mb-3">
        <Button onClick={createNew}>Create New</Button>
      </div>
      <StyledTable>
        <thead>
          <tr>
            <th>NAME </th>
            <th>ADDRESS</th>
            <th>DATE ADDED</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {data.map((user, index) => {
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
                  onClick={() => displayDetails(user, "/update-company")}
                >
                  {user.name}
                </td>
                <td>{user.address}</td>
                <td>{formatDate(user.createdAt)}</td>
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
    </div>
  );
};

export default React.memo(Company);
