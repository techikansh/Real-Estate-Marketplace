import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import {
    signInStart,
    signInSuccess,
    signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [error, setError] = useState("");
    // const [loading, setLoading] = useState(false);
    const { loading, error } = useSelector((state) => state.user);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async () => {
        // setLoading(true);
        dispatch(signInStart());
        const url = `${BASE_URL}/auth/signin`;
        const response = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (!data.success) {
            // setError(data.message);
            // setLoading(false);
            dispatch(signInFailure(data.message));
            return;
        }
        // setLoading(false);
        // setError("");
        dispatch(signInSuccess(data.user));
        navigate("/");
    };

    return (
        <div className="mt-56 ">
            <div className="flex flex-col items-center justify-center border rounded-lg shadow-lg mx-auto max-w-2xl p-2">
                <div className="space-y-4 w-full flex flex-col items-center justify-center gap-4">
                    <h1 className="text-3xl font-bold text-center my-4 ">
                        Einloggen
                    </h1>

                    <div className="text-xl p-3 border rounded-xl w-[70%]">
                        <input
                            type="text"
                            placeholder="Email"
                            className="w-full outline-none text-xl"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="text-xl p-3 border rounded-xl flex items-center justify-between w-[70%]">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="w-full outline-none text-xl "
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {showPassword ? (
                            <FaEyeSlash
                                className="cursor-pointer"
                                onClick={() => setShowPassword(false)}
                            />
                        ) : (
                            <FaEye onClick={() => setShowPassword(true)} />
                        )}
                    </div>

                    {error && (
                        <div className="text-red-500 text-center">{error}</div>
                    )}

                    <button
                        disabled={loading}
                        className="text-xl py-2 px-2 border rounded-xl w-[50%] text-center bg-black text-white"
                        onClick={handleSubmit}
                    >
                        {loading ? "Anmelden..." : "Anmelden"}
                    </button>
                </div>

                <OAuth />

                <div className="text-sm text-center mb-8">
                    <p>
                        Du hast noch kein Konto?{" "}
                        <Link
                            to="/signup"
                            className="underline hover:text-blue-500"
                        >
                            Erstellen
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
