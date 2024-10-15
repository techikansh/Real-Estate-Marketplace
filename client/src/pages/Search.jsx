import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import ListingItem from "../components/ListingItem";

const Search = () => {
    const navigate = useNavigate();
    const [sideBarData, setSideBarData] = useState({
        searchTerm: "",
        type: "all",
        offer: false,
        parking: false,
        furniture: false,
        sort: "createdAt",
        order: "desc",
    });
    const [listings, setListings] = useState([]);
    const [listingsError, setListingsError] = useState(null);
    const [listingsLoading, setListingsLoading] = useState(false);
    const [showShowMoreButton, setShowShowMoreButton] = useState(true);

    console.log(listings);

    const handleSortAndOrderChange = (e) => {
        const sort = e.target.value.split("_")[0];
        const order = e.target.value.split("_")[1];
        setSideBarData({
            ...sideBarData,
            sort,
            order,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("searchTerm", sideBarData.searchTerm);
        urlParams.set("type", sideBarData.type);
        urlParams.set("offer", sideBarData.offer);
        urlParams.set("parking", sideBarData.parking);
        urlParams.set("furniture", sideBarData.furniture);
        urlParams.set("sort", sideBarData.sort);
        urlParams.set("order", sideBarData.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    const fetchListings = async (urlParams) => {
        setListingsError(null);
        setListingsLoading(true);
        setShowShowMoreButton(true);
        const searchQuery = urlParams.toString();
        // console.log(searchQuery);
        const url = `${BASE_URL}/listing/search?${searchQuery}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        if (data.success) {
            setListings(data.listings);
            setListingsLoading(false);
            if (data.listings.length < 9) {
                setShowShowMoreButton(false);
            }
        } else {
            setListingsError(data.message);
            setListingsLoading(false);
        }
    };

    const handleShowMore = async () => {
        setListingsError("");
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("startIndex", startIndex);
        const searchQuery = urlParams.toString();

        const url = `${BASE_URL}/listing/search?${searchQuery}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        if (data.success) {
            setListings([...listings, ...data.listings]);
            if (data.listings.length < 9) {
                setShowShowMoreButton(false);
            }
        } else {
            setListingsError(data.message);
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTerm = urlParams.get("searchTerm");
        const type = urlParams.get("type");
        const offer = urlParams.get("offer");
        const parking = urlParams.get("parking");
        const furniture = urlParams.get("furniture");
        const sort = urlParams.get("sort");
        const order = urlParams.get("order");
        console.log("searchTerm: ", searchTerm);

        if (
            searchTerm ||
            type ||
            offer ||
            parking ||
            furniture ||
            sort ||
            order
        ) {
            setSideBarData({
                searchTerm: searchTerm,
                type: type || "all",
                offer: offer == "true" ? true : false,
                parking: parking == "true" ? true : false,
                furniture: furniture == "true" ? true : false,
                sort: sort || "createdAt",
                order: order || "desc",
            });
        }

        fetchListings(urlParams);
    }, [location.search]);

    return (
        <div className="flex flex-col md:flex-row bg-slate-100">
            <div className="p-7 border-b md:border-r-2 md:min-h-screen md:w-[50%] lg:w-[30%] flex flex-col gap-4">
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    <div className="flex items-center gap-3 ">
                        <label className="whitespace-nowrap font-semibold text-xl">
                            Such Term:
                        </label>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="outline-none p-2 rounded-md border bg-white w-[70%]"
                            value={sideBarData.searchTerm}
                            onChange={(e) =>
                                setSideBarData({
                                    ...sideBarData,
                                    searchTerm: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3 ">
                        <label className="whitespace-nowrap font-semibold text-xl mr-2 text-center">
                            Typ:{" "}
                        </label>
                        <div className="flex gap-2 text-xl">
                            <input
                                type="checkbox"
                                className="w-5"
                                onChange={() =>
                                    setSideBarData({
                                        ...sideBarData,
                                        type: "all",
                                    })
                                }
                                checked={sideBarData.type == "all"}
                            />
                            Mieten & Kaufen
                        </div>
                        <div className="flex gap-2 text-lg">
                            <input
                                type="checkbox"
                                className="w-5"
                                onChange={() =>
                                    setSideBarData({
                                        ...sideBarData,
                                        type: "rent",
                                    })
                                }
                                checked={sideBarData.type == "rent"}
                            />
                            Mieten
                        </div>
                        <div className="flex gap-2 text-lg">
                            <input
                                type="checkbox"
                                className="w-5"
                                onChange={() =>
                                    setSideBarData({
                                        ...sideBarData,
                                        type: "sale",
                                    })
                                }
                                checked={sideBarData.type == "sale"}
                            />
                            Kaufen
                        </div>
                        <div className="flex gap-2 text-lg">
                            <input
                                type="checkbox"
                                className="w-5"
                                onChange={() =>
                                    setSideBarData({
                                        ...sideBarData,
                                        offer: !sideBarData.offer,
                                    })
                                }
                                checked={
                                    sideBarData.offer ||
                                    sideBarData.offer == "true"
                                }
                            />
                            Angebot
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <label className="whitespace-nowrap font-semibold text-xl mr-2 text-center">
                            Ausstattungen:
                        </label>
                        <div className="flex gap-2 text-xl">
                            <input
                                type="checkbox"
                                className="w-5"
                                onChange={() =>
                                    setSideBarData({
                                        ...sideBarData,
                                        parking: !sideBarData.parking,
                                    })
                                }
                                checked={
                                    sideBarData.parking ||
                                    sideBarData.parking == "true"
                                }
                            />
                            Parkplatz
                        </div>
                        <div className="flex gap-2 text-lg">
                            <input
                                type="checkbox"
                                className="w-5"
                                onChange={() =>
                                    setSideBarData({
                                        ...sideBarData,
                                        furniture: !sideBarData.furniture,
                                    })
                                }
                                checked={
                                    sideBarData.furniture ||
                                    sideBarData.furniture == "true"
                                }
                            />
                            Möbiliert
                        </div>
                    </div>

                    <div className="flex gap-4 items-center mt-4">
                        <label className="whitespace-nowrap font-semibold text-xl mr-2">
                            Sort:
                        </label>
                        <select
                            id="sort_order"
                            className="outline-none p-2 rounded-md border bg-white w-[70%]"
                            onChange={(e) => handleSortAndOrderChange(e)}
                            value={sideBarData.sort + "_" + sideBarData.order}
                        >
                            <option value="regularPrice_asc">
                                Preis aufsteigend
                            </option>
                            <option value="regularPrice_desc">
                                Preis absteigend
                            </option>
                            <option value="createdAt_desc">Neueste</option>
                            <option value="createdAt_asc">Älteste</option>
                        </select>
                    </div>

                    <button
                        className="mt-4 w-56 rounded-md bg-black text-white p-2 self-center hover:opacity-90"
                        type="submit"
                    >
                        Search
                    </button>
                </form>
            </div>
            {/* -------------------*/}
            <div className="md:w-[70%]">
                <h1 className="text-3xl font-semibold p-5 border-b w-full">
                    Listings
                </h1>

                {listings.length === 0 && (
                    <p className="flex items-center justify-center">
                        Keine Anzeige gefunden
                    </p>
                )}

                {listingsError && (
                    <p className="text-red-500 flex items-center">
                        Error: {listingsError}
                    </p>
                )}

                {listingsLoading && (
                    <p className="flex items-center">Loading...</p>
                )}

                {!listingsLoading && !listingsError && listings.length > 0 && (
                    <div className="flex flex-wrap gap-10 items-center pt-16 px-10 justify-center md:justify-center lg:justify-start  mb-2">
                        {listings.map((listing, index) => {
                            return (
                                <ListingItem listing={listing} key={index} />
                            );
                        })}
                    </div>
                )}

                {showShowMoreButton && (
                    <button
                        className="text-green-500 hover:underline w-full items-center m-2"
                        onClick={handleShowMore}
                    >
                        Show More
                    </button>
                )}
            </div>
        </div>
    );
};

export default Search;
