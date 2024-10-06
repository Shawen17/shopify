import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { motion } from "framer-motion";
import Company from "../../components/Company/Company";
import { DATA_STATES } from "../ApiHelper";
import Spinner from "../../components/Spinner/Spinner";
import PageWrapper from "../PageWrapper";
import { deleteItem } from "../ApiHelper";

import { UserContext } from "../../components/utility/ContextManager";

export const Title = styled.div`
  display: flex;
  font-size: 18px;
  font-family: "Urbanist", sans-serif;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-weight: bold;
`;

const Companies = () => {
  window.title = "Companies";
  const [loadingState, setLoadingState] = useState(DATA_STATES.loaded);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState("");
  const [raw, setRaw] = useState([]);

  useEffect(() => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const fetchProfiles = async () => {
      setLoadingState(DATA_STATES.waiting);
      try {
        const res = await axios.get(
          "http://localhost:9000/api/companies",
          config
        );
        if (res.status === 200) {
          setRaw(res.data.data);
        }
        setLoadingState(DATA_STATES.loaded);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfiles();
  }, [refresh]);

  const removeUser = async (path, id) => {
    await deleteItem(path, id);
    setRefresh(!refresh);
  };

  let content;

  if (loadingState === DATA_STATES.loaded || DATA_STATES.error) {
    content = error ? (
      error
    ) : (
      <>
        <Title>Company Details</Title>
        <Company removeUser={removeUser} />
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

export default Companies;
