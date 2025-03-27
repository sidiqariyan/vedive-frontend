// PageTransition.jsx
import React from "react";
import { motion } from "framer-motion";

const pageVariants = {
  // initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 1.02, y: -20 },
};

const transition = { duration: 0.5, ease: "easeInOut" };

const PageTransition = ({ children }) => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageVariants}
    transition={transition}
  >
    {children}
  </motion.div>
);

export default PageTransition;
