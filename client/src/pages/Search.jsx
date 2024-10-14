import React from "react";

const Search = () => {
    return (
        <div className="flex flex-col md:flex-row bg-slate-100">
            <div className="p-7 border-b md:border-r md:h-screen md:w-[40%]">
                <form className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 ">
                        <label className="whitespace-nowrap font-semibold text-xl">
                            Such Term:
                        </label>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="outline-none p-2 rounded-md border bg-white w-[70%]"
                        />
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3 ">
                        <label className="whitespace-nowrap font-semibold text-xl mr-2 text-center">
                            Typ:{" "}
                        </label>
                        <div className="flex gap-2 text-xl">
                            <input type="checkbox" className="w-5" />
                            Mieten & Kaufen
                        </div>
                        <div className="flex gap-2 text-lg">
                            <input type="checkbox" className="w-5" />
                            Mieten
                        </div>
                        <div className="flex gap-2 text-lg">
                            <input type="checkbox" className="w-5" />
                            Kaufen
                        </div>
                        <div className="flex gap-2 text-lg">
                            <input type="checkbox" className="w-5" />
                            Angebot
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <label className="whitespace-nowrap font-semibold text-xl mr-2 text-center">
                            Ausstattungen:
                        </label>
                        <div className="flex gap-2 text-xl">
                            <input type="checkbox" className="w-5" />
                            Parkplatz
                        </div>
                        <div className="flex gap-2 text-lg">
                            <input type="checkbox" className="w-5" />
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
                        >
                            <option>Preis aufsteigend</option>
                            <option>Preis absteigend</option>
                            <option>Neueste</option>
                            <option>Älteste</option>
                        </select>
                    </div>

                    <button className="mt-4 w-56 rounded-md bg-black text-white p-2 self-center hover:opacity-90">
                        Search
                    </button>
                </form>
            </div>
            {/* -------------------*/}
            <div>
                <h1 className="text-3xl font-semibold p-5 border-b">
                    Listings
                </h1>
            </div>
        </div>
    );
};

export default Search;
