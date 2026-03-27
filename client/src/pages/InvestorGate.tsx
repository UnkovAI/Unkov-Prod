import { useState } from "react";
import { useLocation } from "wouter";
import { validateInvestorToken } from "../lib/supabase";
import { Shield, Lock, ArrowRight, AlertCircle } from "lucide-react";
import Header from "@/components/Header";

export default function InvestorGate() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [, navigate] = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const isValid = await validateInvestorToken(email, token);
      
      if (isValid) {
        // 1. Use the exact key the PitchDeck.tsx is looking for
        sessionStorage.setItem("unkov_investor_auth", "true"); 
        
        // 2. Check if we should go to pitch deck or a default page
        const redirect = sessionStorage.getItem("unkov_post_auth_redirect") || "/pitch-deck";
        
        // 3. Clear the redirect memory and go
        sessionStorage.removeItem("unkov_post_auth_redirect");
        navigate(redirect);
      } else {
        setError("Invalid, expired, or revoked access token.");
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      setError("System error. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-xl">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-blue-500/10 rounded-full">
              <Shield className="text-blue-400" size={32} />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-2">Investor Portal</h1>
          <p className="text-slate-400 text-center text-sm mb-8">
            Please enter your credentials to view secure documents.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase ml-1">
                Email Address
              </label>
              <input 
                type="email" 
                required
                className="w-full mt-1 bg-black/40 border border-white/10 p-3 rounded-lg focus:border-blue-500 outline-none transition-colors"
                placeholder="investor@firm.com"
                value={email} 
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase ml-1">
                Access Token
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-slate-500" size={18} />
                <input 
                  type="password" 
                  required
                  className="w-full mt-1 bg-black/40 border border-white/10 p-3 pl-10 rounded-lg focus:border-blue-500 outline-none transition-colors"
                  placeholder="Paste token here..."
                  value={token} 
                  onChange={e => setToken(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all mt-4"
            >
              {loading ? "Verifying..." : "Access Portal"} <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
