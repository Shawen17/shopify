import { motion } from "framer-motion";
import CompanyForm from "../../components/CompanyForm/CompanyForm";

const AddCompany = () => {
  return (
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ rotate: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      <CompanyForm />
    </motion.div>
  );
};

export default AddCompany;
