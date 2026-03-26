import { useEffect } from "react";
import { useLocation } from "wouter";

export default function FreeTrial() {
  const [, navigate] = useLocation();
  useEffect(() => { navigate("/early-access"); }, []);
  return null;
}
