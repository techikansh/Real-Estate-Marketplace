import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "../utils/firebase";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
// Firebase rules:
// ---
// allow write: if
//       request.resource.size < 2*1024*1024 &&
//       request.resource.contentType.match('image/.*')
// ---

const Profile = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const imageRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [image, setImage] = useState(undefined);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(0);
    const [username, setUsername] = useState(currentUser.username);
    const [email, setEmail] = useState(currentUser.email);
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [userUpdateError, setUserUpdateError] = useState(null);
    const handleImageUpload = (image) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + image.name;
        const storageRef = ref(storage, fileName);

        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                setImageUploadProgress(Math.round(progress));
            },
            (error) => {
                // console.log(error);
                setImageUploadError(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    console.log("Download URL:", url);
                    setImageUploadProgress(101);
                    setAvatar(url);
                });
            }
        );

        setImage(undefined);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const url = `${BASE_URL}/user/update/${currentUser.id}`;
        console.log(url);
        const response = await fetch(url, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                email,
                password,
                avatar,
            }),
        });
        const data = await response.json();
        console.log(data);

        if (data.success) {
            dispatch(signInSuccess(data.user));
        } else {
            setUserUpdateError(data.message);
        }

        setPassword("");
    };

    useEffect(() => {
        if (image) {
            handleImageUpload(image);
        }
    }, [image]);

    return (
        <div className="flex flex-col items-center justify-center mt-10 mx-auto">
            <h1 className="text-3xl font-bold text-center mt-7">Profile</h1>

            <div className="flex flex-col items-center justify-center mt-10 space-y-4">
                <input
                    type="file"
                    accept="image/*"
                    ref={imageRef}
                    className="hidden"
                    onChange={(e) => {
                        setImage(e.target.files[0]);
                    }}
                />
                <img
                    src={avatar || currentUser.avatar}
                    alt="Profile Picture"
                    onClick={() => imageRef.current.click()}
                    className="w-32 h-32 rounded-full mb-3 self-center"
                />
                {imageUploadProgress > 0 && imageUploadProgress < 100 && (
                    <p>Uploading: {imageUploadProgress}%</p>
                )}

                {imageUploadProgress == 101 && (
                    <p>Upload complete</p>
                )}

                {imageUploadError && <p>Error: {imageUploadError}</p>}

                <input
                    type="text"
                    placeholder="Username"
                    className="w-72 md:w-96 p-2 mt-4 border border-gray-300 rounded-md outline-none"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                />
                <input
                    type="text"
                    placeholder="Email"
                    className="w-72 md:w-96 p-2 mt-4 border border-gray-300 rounded-md outline-none"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />
                <input
                    type="password"
                    placeholder="New Password"
                    className="w-72 md:w-96 p-2 mt-4 border border-gray-300 rounded-md outline-none"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />

                <button
                    className="w-72 md:w-96 p-2 mt-12 border border-gray-300 rounded-md text-white bg-black"
                    onClick={handleUpdate}
                >
                    Update
                </button>

                {userUpdateError && (
                    <p className="text-red-500">Error: {userUpdateError}</p>
                )}

                <div className="flex items-center justify-between gap-10 w-72 md:w-96">
                    <span className="text-center hover:bg-black hover:text-white hover:cursor-pointer p-2 rounded-md">
                        Delete Account
                    </span>
                    <span
                        className="text-center hover:bg-black hover:text-white hover:cursor-pointer p-2 rounded-md"
                        onClick={() => {
                            navigate("/signin");
                        }}
                    >
                        Sign Out
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Profile;
