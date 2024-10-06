import { motion } from "framer-motion";
import CustomerForm from "../../components/CustomerForm/CustomerForm";

const AddCustomer = () => {
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
      <CustomerForm />
    </motion.div>
  );
};

export default AddCustomer;
