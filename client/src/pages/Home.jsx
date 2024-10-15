import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import ListingItem from "../components/ListingItem";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation } from "swiper/modules";
import "swiper/css/navigation";

const Home = () => {
    const [offerListings, setOfferListings] = useState([]);
    const [rentListings, setRentListings] = useState([]);
    const [saleListings, setSaleListings] = useState([]);
    console.log(offerListings);

    const fetchOfferListings = async () => {
        const url = `${BASE_URL}/listing/search?&offer=true&limit=4`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        if (data.success) {
            setOfferListings(data.listings);
            fetchRentListings();
        } else {
            console.log(data.message);
        }
    };

    const fetchRentListings = async () => {
        const url = `${BASE_URL}/listing/search?&type=rent&limit=4`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        if (data.success) {
            setRentListings(data.listings);
            fetchSaleListings();
        } else {
            console.log(data.message);
        }
    };

    const fetchSaleListings = async () => {
        const url = `${BASE_URL}/listing/search?&type=sale&limit=4`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        if (data.success) {
            setSaleListings(data.listings);
        } else {
            console.log(data.message);
        }
    };

    useEffect(() => {
        fetchOfferListings();
    }, []);

    return (
        <div>
            {/* Hero */}
            <div className="flex flex-col gap-10 pt-28 px-3 max-w-6xl mx-auto">
                <h1 className="text-3xl lg:text-6xl font-bold text-slate-700">
                    Find you next{" "}
                    <span className="text-slate-500">perfect</span> <br /> place
                    with ease
                </h1>

                <div className="text-gray-400 text-xs sm:text-sm">
                    Estate Markt is the best place to find your perfect place to
                    live <br />
                    We have wide range of properties for you to choose from
                </div>

                <Link
                    to="/search"
                    className="text-xs sm:text-sm font-bold hover:underline text-blue-800"
                >
                    Let's get started
                </Link>
            </div>

            {/* Swiper */}
            <Swiper
                modules={[Navigation]}
                navigation
                onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log("slide change")}
            >
                {offerListings &&
                    offerListings.map((listing, index) => {
                        return (
                            <SwiperSlide>
                                <img
                                    src={listing.imageUrls[0]}
                                    alt="Offer Image"
                                    className="h-[550px] w-full object-cover my-10"
                                />
                            </SwiperSlide>
                        );
                    })}
            </Swiper>

            {/* Listings */}
            <div className="flex flex-col max-w-6xl mx-auto px-3 ">
                <h1 className="text-2xl font-semibold text-slate-500">
                    Recent Offers
                </h1>

                <Link
                    to={"/search?offer=true"}
                    className="text-xs sm:text-sm font-bold hover:underline text-blue-800 mt-2"
                >
                    See all Offers
                </Link>
                <div className="flex flex-wrap w-full gap-6 justify-center md:justify-start lg:justify-start mt-2">
                    {offerListings &&
                        offerListings.length > 0 &&
                        offerListings.map((listing, index) => {
                            return (
                                <ListingItem key={index} listing={listing} />
                            );
                        })}
                </div>

                {/* ------------ */} 

                <h1 className="text-2xl font-semibold text-slate-500 mt-10">
                    Recent Places for Rent
                </h1>

                <Link
                    to={"/search?type=rent"}
                    className="text-xs sm:text-sm font-bold hover:underline text-blue-800 mt-2"
                >
                    See more places to rent
                </Link>
                <div className="flex flex-wrap w-full gap-6 justify-center md:justify-start lg:justify-start mt-2">
                    {rentListings &&
                        rentListings.length > 0 &&
                        rentListings.map((listing, index) => {
                            return (
                                <ListingItem key={index} listing={listing} />
                            );
                        })}
                </div>
                
                {/* ------------ */} 

                <h1 className="text-2xl font-semibold text-slate-500 mt-10">
                    Recent Places for Sale
                </h1>

                <Link
                    to={"/search?type=sale"}
                    className="text-xs sm:text-sm font-bold hover:underline text-blue-800 mt-2"
                >
                    See more places for sale
                </Link>
                <div className="flex flex-wrap w-full gap-6 justify-center md:justify-start lg:justify-start mt-2">
                    {saleListings &&
                        saleListings.length > 0 &&
                        saleListings.map((listing, index) => {
                            return (
                                <ListingItem key={index} listing={listing} />
                            );
                        })}
                </div>
                
            </div>
        </div>
    );
};

export default Home;
