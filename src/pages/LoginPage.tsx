import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import logo from "../assets/logo-ait.jpg";

const HIGHLIGHTS = [
  "Proforma invoices in a few clicks",
  "Professional, export-ready PDF documents",
  "One place for your trade paperwork",
];

function BrandPanel() {
  return (
    <div className="relative hidden flex-1 overflow-hidden bg-ink text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
      {/* soft animated glows */}
      <div className="anim-drift absolute -left-24 -top-24 h-96 w-96 rounded-full bg-brand opacity-30 blur-3xl" />
      <div className="anim-drift absolute -bottom-32 right-0 h-96 w-96 rounded-full opacity-20 blur-3xl" style={{ background: "#f1d27a", animationDelay: "-6s" }} />

      {/* slowly rotating orbit rings with dots */}
      <svg className="anim-spin absolute -right-40 top-1/3 h-[520px] w-[520px] opacity-30" viewBox="0 0 200 200" fill="none" aria-hidden="true">
        <circle cx="100" cy="100" r="96" stroke="#f1d27a" strokeWidth="0.4" strokeDasharray="2 4" />
        <circle cx="100" cy="100" r="68" stroke="#f1d27a" strokeWidth="0.4" />
        <circle cx="100" cy="100" r="40" stroke="#f1d27a" strokeWidth="0.4" strokeDasharray="1 3" />
        <circle cx="196" cy="100" r="3" fill="#f1d27a" />
        <circle cx="32" cy="100" r="2.5" fill="#fff" />
        <circle cx="100" cy="60" r="2" fill="#f1d27a" />
      </svg>

      <div className="relative z-10 flex items-center gap-3 anim-fade-up">
        <img src={logo} alt="" className="h-11 w-11 rounded-full object-cover ring-1 ring-brand/50" />
        <span className="text-lg font-semibold tracking-wide">AICH International Traders</span>
      </div>

      <div className="relative z-10 max-w-lg">
        <h2 className="anim-fade-up m-0 text-4xl font-semibold leading-tight" style={{ animationDelay: "0.15s" }}>
          Indian spices, <span className="text-brand-light">delivered worldwide.</span>
        </h2>
        <p className="anim-fade-up mt-4 text-base text-white/70" style={{ animationDelay: "0.3s" }}>
          Manage your export documentation from one secure admin workspace.
        </p>
        <ul className="m-0 mt-6 list-none space-y-3 p-0">
          {HIGHLIGHTS.map((h, i) => (
            <li key={h} className="anim-fade-up flex items-center gap-3 text-sm text-white/85" style={{ animationDelay: `${0.45 + i * 0.15}s` }}>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-b from-brand-light to-brand text-[11px] font-bold text-ink">✓</span>
              {h}
            </li>
          ))}
        </ul>
      </div>

      {/* keeps the text block vertically balanced now that the floating card is gone */}
      <div />
    </div>
  );
}

const EyeIcon = ({ off }: { off: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    {off && <path d="M4 4l16 16" />}
  </svg>
);

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate("/dashboard", { replace: true });
    } else {
      setError("Email or password is incorrect.");
    }
  };

  return (
    <div className="flex h-full">
      <BrandPanel />

      <div className="flex w-full items-center justify-center overflow-y-auto bg-ink p-4 lg:w-[480px] lg:shrink-0 lg:bg-white">
        <form onSubmit={onSubmit} className="w-full max-w-sm rounded-lg border bg-white p-6 shadow-sm lg:border-0 lg:shadow-none">
          <div className="mb-5 text-center">
            <img src={logo} alt="AIT" className="mx-auto h-28 w-28 rounded-2xl object-cover shadow-md ring-1 ring-brand/50" />
            <h1 className="m-0 mt-3 text-xl font-semibold">Sign in</h1>
            <p className="m-0 text-sm text-gray-500">AICH International Traders admin</p>
          </div>

          {error && <div className="alert alert-danger py-2 text-sm" role="alert">{error}</div>}

          <label className="form-label" htmlFor="email">Email</label>
          <input id="email" type="email" className="form-control mb-3" autoComplete="username"
            value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} required autoFocus />

          <label className="form-label" htmlFor="password">Password</label>
          <div className="relative mb-4">
            <input id="password" type={showPassword ? "text" : "password"} className="form-control pr-11"
              autoComplete="current-password" value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }} required />
            <button type="button" onClick={() => setShowPassword((v) => !v)}
              className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded border-0 bg-transparent text-gray-500 hover:text-brand-dark"
              aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}
              title={showPassword ? "Hide password" : "Show password"}>
              <EyeIcon off={showPassword} />
            </button>
          </div>

          <button type="submit" className="btn btn-primary w-100">Sign in</button>
        </form>
      </div>
    </div>
  );
}
