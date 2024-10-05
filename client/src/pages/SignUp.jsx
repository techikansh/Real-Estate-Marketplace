import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    const url = `${BASE_URL}/auth/signup`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    if (!data.success) {
      setError(data.message);
      setLoading(false);
    }
    setLoading(false);
    navigate("/signin");
  };

  return (
    <div className="mt-56 ">
      <div className="flex flex-col items-center justify-center border rounded-lg shadow-lg mx-auto max-w-2xl p-2">
        <div className="space-y-4 w-full flex flex-col items-center justify-center gap-4">
          <h1 className="text-3xl font-bold text-center my-4 ">
            Konto erstellen
          </h1>
          <div className="text-xl p-3 border rounded-xl w-[70%]">
            <input
              type="text"
              placeholder="Username"
              className="w-full outline-none text-xl"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="text-xl p-3 border rounded-xl w-[70%]">
            <input
              type="text"
              placeholder="Email"
              className="w-full outline-none text-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="text-xl p-3 border rounded-xl w-[70%]">
            <input
              type="password"
              placeholder="Password"
              className="w-full outline-none text-xl "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="text-red-500 text-center">{error}</div>}

          <button
            disabled={loading}
            className="text-xl py-2 px-2 border rounded-xl w-[50%] text-center bg-black text-white"
            onClick={handleSubmit}
          >
            {loading ? "Erstellen..." : "Erstellen"}
          </button>
        </div>

        <div className="text-sm text-center mb-8">
          <p>
            Hast du schon ein Konto?{" "}
            <Link to="/signin" className="underline hover:text-blue-500">
              Einloggen
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
