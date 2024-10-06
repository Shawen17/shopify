import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  margin: 20% 20%;
`;

const Button = styled.button`
  background-color: teal;
  border-radius: 8px;
  height: 60px;
  padding: 8px;
  color: white;
  &:hover {
    background-color: whitesmoke;
    color: teal;
    transition: 1s ease-in-out 1;
  }
`;

const Home = () => {
  window.title = "Home";

  const navigate = useNavigate();
  const handleAuth = async () => {
    navigate("/customers");
    // const shop = "shawen";
    // try {
    //   // Request to your backend to handle the Shopify OAuth process
    //   window.location.href = `http://localhost:9000/auth?shop=${shop}`;
    // } catch (err) {
    //   console.log(err.message);
    // }
  };

  return (
    <Container>
      <Button onClick={handleAuth}>Welcome</Button>
    </Container>
  );
};

export default Home;
