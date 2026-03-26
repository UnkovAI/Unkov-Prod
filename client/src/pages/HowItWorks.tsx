import { useEffect } from "react";
import { useLocation } from "wouter";

export default function HowItWorks() {
  const [, navigate] = useLocation();
  useEffect(() => { navigate("/features", { replace: true }); }, []);
  return null;
}
