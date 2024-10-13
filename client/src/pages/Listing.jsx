import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css/bundle";

import { FaLocationArrow } from "react-icons/fa";
import { FaBed } from "react-icons/fa";
import { MdBathtub } from "react-icons/md";
import { FaParking } from "react-icons/fa";
import { FaChair } from "react-icons/fa";

const Listing = () => {
    const { listingId } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchListing = async (listingId) => {
            setLoading(true);
            setError(null);

            const url = `${BASE_URL}/listing/get/${listingId}`;
            const response = await fetch(url, {
                method: "GET",
            });
            const data = await response.json();
            if (data.success) {
                setListing(data.listing);
                console.log(data.listing);
                setLoading(false);
            } else {
                setError(data.message);
                setLoading(false);
            }
        };

        fetchListing(listingId);
    }, []);

    return (
        <div>
            {error && <p className="text-red-500">{error}</p>}
            {loading && <p>Loading...</p>}
            {/* {listing && (
                <div className="flex w-full overflow-x-auto ">
                    {listing.imageUrls.map((image, index) => {
                        return (
                            <div className="" key={index}>
                                <img
                                    src={image}
                                    alt="image"
                                    className="object-cover w-[500px] h-[500px] flex-shrink-0"
                                />
                            </div>
                        );
                    })}
                </div>
            )} */}

            {listing && (
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={0}
                    slidesPerView={1}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    onSlideChange={() => console.log("slide change")}
                    onSwiper={(swiper) => console.log(swiper)}
                >
                    {listing.imageUrls.map((image, index) => {
                        return (
                            <SwiperSlide key={index}>
                                <img
                                    src={image}
                                    alt=""
                                    className="w-full h-[350px] md:h-[550px] lg:h-[750px]"
                                />
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            )}

            {listing && (
                <div className="flex flex-col items-start justify-center max-w-4xl mx-auto md:p-2 p-4 gap-2">
                    <div className="flex gap-2">
                        <h1 className="text-2xl font-bold mt-4">
                            {listing.name}
                        </h1>
                        <h1 className="text-2xl font-bold mt-4">
                            {listing.type == "rent"
                                ? "-  " + listing.regularPrice + " € / Monat"
                                : "-  " + listing.regularPrice + " €"}
                        </h1>
                    </div>

                    <div className="flex gap-2 mt-4 items-center">
                        <FaLocationArrow className="text-center" />
                        {listing.address}
                    </div>

                    <div className="">
                        <div className="bg-red-800 text-white p-2 w-32 text-center rounded-md">
                            {listing.type == "rent" ? "Miete" : "Kauf"}
                        </div>
                    </div>

                    <p className="mt-3">
                        {" "}
                        <strong>Bechreibung</strong> - {listing.description}
                    </p>

                    <div className="flex flex-wrap gap-6 mt-2">
                        <div className="flex gap-2 items-center font-semibold">
                            <FaBed  />
                            {listing.bedrooms} Schlafzimmer
                        </div>
                        <div className="flex gap-2 items-center font-semibold">
                            <MdBathtub />
                            {listing.bathrooms} Badezimmer
                        </div>
                        <div className="flex gap-2 items-center font-semibold">
                            <FaParking />
                            {listing.parking ? "Parkplatz" : "kein Parkplatz"}
                        </div>
                        <div className="flex gap-2 items-center font-semibold">
                            <FaChair />
                            {listing.furnished ? "Möbliert" : "Unmöbliert"}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Listing;
