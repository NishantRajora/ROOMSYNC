import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/verify");
  };

  return (
    <div className="flex min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Left brand panel */}
      <div
        className="hidden lg:flex flex-col justify-between p-12"
        style={{
          flex: "0 0 480px",
          background: "linear-gradient(160deg, #117c74 0%, #0a4f4b 100%)",
        }}
      >
        <div>
          <div className="flex items-center gap-2 mb-16">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
              <span className="text-white font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>R</span>
            </div>
            <span className="font-bold text-xl text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>RoomSync</span>
          </div>

          <h1
            className="text-4xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-1px" }}
          >
            Find Your People.<br />Find Your Place.
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.7, fontSize: 16 }}>
            Join thousands of verified college students finding safe, scam-free, compatible flatmates across Gurugram and Delhi NCR.
          </p>
        </div>

        {/* Trust badges */}
        <div className="space-y-4">
          {[
            { icon: "🎓", text: "College email verified — real students only" },
            { icon: "🛡", text: "Every listing trust-scored 0–100" },
            { icon: "💬", text: "AI compatibility matching across 5 dimensions" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                {item.icon}
              </div>
              <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 14 }}>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Campus image */}
        <div className="rounded-2xl overflow-hidden mt-8" style={{ border: "2px solid rgba(255,255,255,0.2)" }}>
          <img
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=460&h=200&fit=crop&auto=format"
            alt="College campus"
            className="w-full object-cover"
            style={{ height: 160 }}
          />
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8" style={{ background: "#f6f9f8" }}>
        <div className="w-full" style={{ maxWidth: 440 }}>
          <div className="mb-8">
            <h2
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b", letterSpacing: "-0.5px" }}
            >
              Create your account
            </h2>
            <p style={{ color: "#5f7572", fontSize: 14 }}>
              Already have an account?{" "}
              <Link to="/dashboard" style={{ color: "#117c74", fontWeight: 600 }}>Log in</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: "Full Name", key: "name", type: "text", placeholder: "Nishant Rajora" },
              { label: "Personal Email", key: "email", type: "email", placeholder: "nishantrajora100@gmail.com" },
              { label: "Phone Number", key: "phone", type: "tel", placeholder: "+91 98765 43210" },
              { label: "Password", key: "password", type: "password", placeholder: "Min. 8 characters" },
            ].map((field) => (
              <div key={field.key}>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "#17222b" }}
                >
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.key as keyof typeof form]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  required
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all"
                  style={{
                    borderColor: "#e2ece9",
                    background: "#fff",
                    color: "#17222b",
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onFocus={e => (e.target.style.borderColor = "#117c74")}
                  onBlur={e => (e.target.style.borderColor = "#e2ece9")}
                />
              </div>
            ))}

            {/* College email note */}
            <div
              className="flex items-start gap-3 p-4 rounded-xl"
              style={{ background: "#fef9c3", border: "1px solid #fef08a" }}
            >
              <span className="text-xl flex-shrink-0">🎓</span>
              <div>
                <div className="text-sm font-semibold mb-1" style={{ color: "#854d0e" }}>Verify with your college email</div>
                <div className="text-xs leading-relaxed" style={{ color: "#92400e" }}>
                  After signing up, enter your <code style={{ fontFamily: "monospace", background: "#fef08a", padding: "1px 4px", borderRadius: 4 }}>@ncuindia.edu</code> address to unlock the gold Verified Student badge. This increases your match quality by 40%.
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all"
              style={{ background: "#117c74", height: 48 }}
              onMouseEnter={e => (e.currentTarget.style.background = "#0d635c")}
              onMouseLeave={e => (e.currentTarget.style.background = "#117c74")}
            >
              Create Account & Verify Email →
            </button>

            <p className="text-xs text-center" style={{ color: "#5f7572" }}>
              By signing up you agree to our{" "}
              <a href="#" style={{ color: "#117c74" }}>Terms of Service</a> and{" "}
              <a href="#" style={{ color: "#117c74" }}>Privacy Policy</a>
            </p>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: "#e2ece9" }} />
            <span className="text-xs" style={{ color: "#5f7572" }}>or sign up with</span>
            <div className="flex-1 h-px" style={{ background: "#e2ece9" }} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[{ icon: "G", label: "Google" }, { icon: "📧", label: "College SSO" }].map((opt, i) => (
              <button
                key={i}
                className="flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all hover:bg-white"
                style={{ borderColor: "#e2ece9", color: "#17222b", background: "#fff" }}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
