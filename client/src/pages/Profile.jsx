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
import { useNavigate } from "react-router-dom";
import {
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOutStart,
    signOutSuccess,
    signOutFailure,
} from "../redux/user/userSlice";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
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
    const [avatar, setAvatar] = useState(currentUser.avatar);
    const error = useSelector((state) => state.user.error);
    const loading = useSelector((state) => state.user.loading);
    const [showPassword, setShowPassword] = useState(false);
    const [userListings, setUserListings] = useState([]);
    const [userListingsError, setUserListingsError] = useState(null);
    const [showingListings, setShowingListings] = useState(false);

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

        dispatch(updateUserStart());

        const url = `${BASE_URL}/user/update/${currentUser._id}`;
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
            dispatch(updateUserSuccess(data.user));
            console.log(loading);
        } else {
            dispatch(updateUserFailure(data.message));
            console.log(loading);
        }
        setPassword("");
    };

    const handleDelete = async () => {
        dispatch(deleteUserStart());
        const url = `${BASE_URL}/user/delete/${currentUser._id}`;
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "include",
        });
        const data = await response.json();

        if (data.success) {
            handleSignOut();
        } else {
            dispatch(deleteUserFailure(data.message));
        }
    };

    const handleSignOut = async () => {
        dispatch(signOutStart());
        const url = `${BASE_URL}/auth/signout`;
        const response = await fetch(url, {
            method: "GET",
            credentials: "include",
        });
        const data = await response.json();

        console.log(data);
        if (data.success) {
            dispatch(signOutSuccess());
            navigate("/signin");
        } else {
            dispatch(signOutFailure(data.message));
        }
    };

    const handleShowListings = async () => {
        setUserListingsError(null);
        const url = `${BASE_URL}/user/listings/${currentUser._id}`;
        const response = await fetch(url, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        if (data.success) {
            setUserListings(data.listings);
            setShowingListings(true);
        } else {
            setUserListingsError(data.message);
        }
    };

    const handleDeleteListing = async (id) => {
        const url = `${BASE_URL}/listing/delete/${id}`;
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
            setUserListings(userListings.filter((listing) => listing._id !== id));
        } else {
            console.log(data.message);
        }
    }

    const handleHideListings = () => {
        setShowingListings(false);
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

                {imageUploadProgress == 101 && <p>Upload complete</p>}

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
                <div className="w-72 md:w-96 p-2 mt-4 border border-gray-300 rounded-md flex items-center justify-between">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        className="w-72 md:w-96 outline-none"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                    {showPassword ? (
                        <FaEyeSlash
                            className="cursor-pointer"
                            onClick={() => setShowPassword(false)}
                        />
                    ) : (
                        <FaEye
                            className="cursor-pointer"
                            onClick={() => setShowPassword(true)}
                        />
                    )}
                </div>
                <button
                    className="w-72 md:w-96 p-2 mt-12 border border-gray-300 rounded-md text-white bg-black"
                    onClick={handleUpdate}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Update"}
                </button>

                <button
                    className="w-72 md:w-96 p-2 mt-12 border border-gray-300 rounded-md text-white bg-black"
                    onClick={() => {
                        navigate("/create-listing");
                    }}
                >
                    Create Listing
                </button>

                {error && <p className="text-red-500">Error: {error}</p>}

                <div className="flex items-center justify-between gap-10 w-72 md:w-96">
                    <span
                        className="text-center hover:bg-black hover:text-white hover:cursor-pointer p-2 rounded-md"
                        onClick={handleDelete}
                    >
                        {loading ? "Deleting..." : "Delete Account"}
                    </span>
                    <span
                        className="text-center hover:bg-black hover:text-white hover:cursor-pointer p-2 rounded-md"
                        onClick={handleSignOut}
                    >
                        Sign Out
                    </span>
                </div>
                <button
                    className="text-sm text-green-600"
                    onClick={handleShowListings}
                    hidden={showingListings}
                >
                    Show Listings
                </button>
                <button
                    className="text-sm text-green-600"
                    onClick={handleHideListings}
                    hidden={!showingListings}
                >
                    Hide Listings
                </button>
                {userListingsError && (
                    <p className="text-red-500">Error: {userListingsError}</p>
                )}

                {userListings.length > 0&& showingListings && (
                    <div className="flex flex-col items-center justify-center gap-2">
                        {userListings.map((listing) => {
                            return (
                                <div
                                    key={listing._id}
                                    className="flex border rounded-md w-[32rem] p-2 gap-2 justify-start items-center"
                                >
                                    <img
                                        src={listing.imageUrls[0]}
                                        alt="Listing"
                                        className="w-24 h-16 object-cover rounded-md"
                                    />

                                    <div className="flex items-center justify-between w-full ml-2">
                                        <h1 className="text-center font-semibold">
                                            {listing.name}
                                        </h1>
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <button 
                                                className="bg-black text-white py-1 px-2 rounded-md w-28"
                                                onClick={() => handleDeleteListing(listing._id)}
                                            >
                                                Löschen
                                            </button>
                                            <button className="bg-black text-white py-1 px-2 rounded-md w-28"
                                                onClick={() => navigate(`/update-listing/${listing._id}`)}
                                            >
                                                Bearbeiten
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                <br />
                <br />
                <br />
            </div>
        </div>
    );
};

export default Profile;
