import styled from "styled-components";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export const FrontArrow = styled(ArrowForwardIosIcon)`
  color: ${(props) => (props.nextPageInfo ? "green" : "gray")};
`;

export const BackArrow = styled(ArrowBackIosIcon)`
  color: ${(props) => (props.prevPageInfo ? "green" : "gray")};
`;
