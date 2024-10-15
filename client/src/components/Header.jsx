import React, { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { GiCrossedSabres } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.user.currentUser);

    function handleSearch() {
        // console.log(search);
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("searchTerm", search);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTerm = urlParams.get("searchTerm");
        setSearch(searchTerm);
    }, [location.search]);

    return (
        <header className="drop-shadow-lg bg-black py-3">
            <div className="flex flex-wrap text-center items-center p-3 space-x-4 justify-between mx-4">
                <div
                    className="text-2xl sm:text-3xl font-bold text-white hover:cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    Estate Markt
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch();
                    }}
                    className="bg-white px-4 py-1 rounded-lg flex text-center items-center"
                >
                    <input
                        className="outline-none w-32 md:w-64 lg:w-96 text-lg"
                        type="text"
                        placeholder="Search"
                        value={search || ""}
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                    />

                    {search && (
                        <GiCrossedSabres
                            className="text-2xl mr-2 hover:cursor-pointer"
                            onClick={() => setSearch("")}
                        />
                    )}
                    <IoMdSearch
                        className="text-2xl hover:cursor-pointer"
                        onClick={() => {
                            handleSearch();
                        }}
                    />
                </form>

                <div className="flex flex-wrap items-center justify-evenly text-white space-x-4 text-xl font-semibold">
                    <div className="hidden lg:inline hover:text-gray-400 hover:cursor-pointer">
                        Home
                    </div>
                    <div className="hidden lg:inline hover:text-gray-400 hover:cursor-pointer">
                        Über Uns
                    </div>
                    {currentUser ? (
                        <img
                            src={currentUser.avatar}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover hover:cursor-pointer"
                            onClick={() => navigate("/profile")}
                        />
                    ) : (
                        <div
                            className="hover:text-gray-400 hover:cursor-pointer"
                            onClick={() => navigate("/signin")}
                        >
                            Einloggen
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
