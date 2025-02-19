import { useState, useEffect } from "react";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Always true
  const [loading, setLoading] = useState(false); // No need to check auth

  return { isLoggedIn, loading };
};
