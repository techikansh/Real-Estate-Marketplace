import React from "react";
import { FaLocationArrow } from "react-icons/fa6";
import { MdBathtub } from "react-icons/md";
import { FaParking } from "react-icons/fa";
import { FaBed } from "react-icons/fa";
import { Link } from "react-router-dom";

const ListingItem = ({ listing }) => {
    return (
        <div className="w-[300px] h-[400px] flex flex-col shadow-md rounded-lg overflow-hidden">
            <Link to={`/listing/${listing._id}`}>
                <img
                    src={listing.imageUrls[0]}
                    alt=""
                    className="w-full h-48 object-cover hover:scale-105 transition-scale duration-300"
                />
            </Link>

            <div className=" mx-3 mt-3 flex flex-col justify-between gap-1">
                <p className="font-semibold text-xl">{listing.name}</p>
                <div className="flex gap-2 items-center">
                    <FaLocationArrow className="text-green-700" />
                    <p className="whitespace-nowrap truncate">
                        {listing.address}
                    </p>
                </div>
            </div>

            <p className="text-slate-700 m-2 line-clamp-2">
                {listing.description}
            </p>

            <div className="px-2 text-xl font-semibold text-slate-600 mt-2">
                {listing.type == "rent" ? (
                    <p>{listing.regularPrice} € / Monat</p>
                ) : (
                    <p>{listing.regularPrice} €</p>
                )}
            </div>

            <div className="flex px-2 gap-3">
                <div className="flex gap-1 items-center">
                    <p>{listing.bedrooms} </p>
                    <FaBed />
                </div>
                <div className="flex gap-1 items-center">
                    <p>{listing.bathrooms} </p>
                    <MdBathtub />
                </div>
            </div>
        </div>
    );
};

export default ListingItem;
