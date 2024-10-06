import axios from "axios";

export const DATA_STATES = {
  waiting: "WAITING",
  loaded: "LOADED",
  error: "ERROR",
};

export const countries = [
  { id: 1, name: "Canada" },
  { id: 2, name: "USA" },
  { id: 3, name: "Nigeria" },
  { id: 4, name: "Australia" },
  { id: 5, name: "Mexico" },
  { id: 6, name: "Colombia" },
];

export const mergeFields = (obj, keysToSearch) => {
  const result = {};

  for (const key in obj) {
    if (
      keysToSearch.some(
        (searchKey) =>
          key.includes(searchKey) &&
          (obj[key] !== undefined || obj[key] !== null)
      )
    ) {
      result[key] = obj[key];
    }
  }

  return result;
};

export const deleteItem = async (path, id) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  let message;
  try {
    const res = await axios.delete(`${path}/${id}`, config);
    if (res.status === 204) {
      message = res.data.message;
    } else {
      message = "Something Unusual Occured";
    }
  } catch (err) {
    console.log(err.message);
    message = err.message;
  }
  return message;
};

export const getCompanies = async () => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  let result;
  let errorMessage = "";
  try {
    const res = await axios.get("http://localhost:9000/api/companies", config);
    if (res.status === 200) {
      result = res.data.data;
    }
  } catch (err) {
    console.log(err.message);
    errorMessage = err.message;
    result = [];
  }
  return { result, errorMessage };
};
