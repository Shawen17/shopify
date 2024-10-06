import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { motion } from "framer-motion";
import Users from "../../components/Customers/Users";
import { DATA_STATES } from "../ApiHelper";
import Spinner from "../../components/Spinner/Spinner";
import { UserContext } from "../../components/utility/ContextManager";
import PageWrapper from "../PageWrapper";
import { deleteItem } from "../ApiHelper";

export const Title = styled.div`
  display: flex;
  font-size: 18px;
  font-family: "Roboto", sans-serif;
  align-items: center;
  justify-content: center;
  margin: 20px;
  font-weight: bold;
`;

const AdminCustomerDashboard = () => {
  window.title = "Dashboard";
  const [loadingState, setLoadingState] = useState(DATA_STATES.loaded);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState("");
  const [raw, setRaw] = useState([]);
  const [nextPageInfo, setNextPageInfo] = useState(null);
  const [prevPageInfo, setPrevPageInfo] = useState(null);

  const removeUser = async (path, id) => {
    await deleteItem(path, id);
    setRefresh(!refresh);
  };

  const fetchCustomers = async (pageInfo = null) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      params: { pageInfo },
    };
    setLoadingState(DATA_STATES.waiting);
    try {
      const res = await axios.get(
        "http://localhost:9000/api/customers",
        config
      );
      if (res.status === 200) {
        setRaw(res.data.data);
        setNextPageInfo(res.data.nextPageInfo);
        setPrevPageInfo(res.data.prevPageInfo);
      }
      setLoadingState(DATA_STATES.loaded);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [refresh]);

  const handleNextPage = () => {
    if (nextPageInfo) {
      fetchCustomers(nextPageInfo); // Fetch next page using nextPageInfo
    }
  };

  const handlePrevPage = () => {
    if (prevPageInfo) {
      fetchCustomers(prevPageInfo); // Fetch previous page using prevPageInfo
    }
  };

  let content;

  if (loadingState === DATA_STATES.loaded || DATA_STATES.error) {
    content = error ? (
      error
    ) : (
      <>
        <Title>Customer Details</Title>
        <Users
          removeUser={removeUser}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          prevPageInfo={prevPageInfo}
          nextPageInfo={nextPageInfo}
        />
      </>
    );
  } else {
    content = <Spinner />;
  }

  return (
    <UserContext.Provider value={raw}>
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      >
        <PageWrapper>{content}</PageWrapper>
      </motion.div>
    </UserContext.Provider>
  );
};

export default AdminCustomerDashboard;
