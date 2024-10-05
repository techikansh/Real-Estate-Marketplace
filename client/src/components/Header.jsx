import React, { useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { GiCrossedSabres } from "react-icons/gi";

const Header = () => {

    const [search, setSearch] = useState("")
    
    function handleSearch() {
        console.log(search);
    }
  
    return (
    <header className="drop-shadow-lg  bg-black py-3">
      <div className="flex flex-wrap  text-center items-center p-3 space-x-4 justify-between mx-4">
        <div className="text-2xl sm:text-3xl font-bold text-white">Estate Markt</div>
        
        <div className="bg-white px-4 py-1 rounded-lg flex text-center items-center">
          <input className="outline-none w-32 md:w-64 lg:w-96 text-lg" type="text" placeholder="Search" value={search}
          onChange = {(e) => {setSearch(e.target.value)}}/>
          
          {search && (
            <GiCrossedSabres className="text-2xl mr-2 hover:cursor-pointer" onClick={() => setSearch("")}/>
          )}
          <IoMdSearch className="text-2xl hover:cursor-pointer" onClick={() => {handleSearch()}}/>
        </div>

        <div className="flex flex-wrap justify-evenly text-white space-x-4 text-xl font-semibold">
          <div className="hidden lg:inline hover:text-gray-400">Home</div>
          <div className="hidden lg:inline hover:text-gray-400">Über Uns</div>
          <div className="hover:text-gray-400">Einloggen</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
