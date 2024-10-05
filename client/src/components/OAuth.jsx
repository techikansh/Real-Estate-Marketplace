import React from "react";
import { app } from "../utils/firebase";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);

            const url = `${BASE_URL}/auth/google`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    image: result.user.photoURL,
                }),
            });

            const data = await response.json();
            dispatch(signInSuccess(data.user));
            navigate("/");
        } catch (error) {
            console.log("Could not login with google", error);
        }
    };

    return (
        <div className="text-xl border rounded-xl w-[50%] text-center py-2 my-2 bg-black text-white hover:cursor-pointer">
            <button onClick={handleGoogleSignIn}>Mit Google einloggen</button>
        </div>
    );
};

export default OAuth;
