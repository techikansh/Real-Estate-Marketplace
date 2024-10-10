import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import React, { useState } from "react";
import { app } from "../utils/firebase";
import { MdDelete } from "react-icons/md";

const CreateListing = () => {
    const [isOffer, setIsOffer] = useState(false);
    const [filesToUpload, setFilesToUpload] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [images, setImages] = useState([
        "https://saterdesign.com/cdn/shop/products/6566-Maynard-Main-Image_1600x.jpg?v=1586042939",
        "https://cdn.houseplansservices.com/content/jrilhlveke52uslov04n9j9sgq/w991x660.jpg?v=10",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRj2yR_kvQKYLsIjG4JcQ2W6RA_-EuUfL_wF39MiVrfdtRXlNVjYoO4-MJvJawEKyZr4U&usqp=CAU",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT50OHOTmmNtPVf96cKojCtNBW7B7sIqB34K8Vrt_e6mVYJl0KUf_F6yUtBROAQaCNTxbA&usqp=CAU",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0pYsEOF_1vIZM8KO07rIOa0z5ybofQEthgYqEEkAI_ubpd9cciWOVhheVNuNldASYwh8&usqp=CAU",
    ]);

    const handleOfferChange = (e) => {
        setIsOffer(e.target.checked);
    };

    const storeToFirebase = (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is", progress, "% done");
                },
                (error) => {
                    console.log(error);
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                        console.log("Download URL:", url);
                        resolve(url);
                    });
                }
            );
        });
    };

    const handleUpload = () => {
        
        if (filesToUpload.length > 6) {
            setImageUploadError("Maximale Anzahl von Bildern ist 6");
            return;
        }
        const promises = [];
        for (const file of filesToUpload) {
            promises.push(storeToFirebase(file));
        }
        Promise.all(promises)
            .then((urls) => {
                setImages(urls);
            })
            .catch((err) => {
                setImageUploadError("Maximale Größe pro Bild ist 2MB");
            });
    };

    return (
        <div className="flex flex-col justify-center items-center mx-10">
            <h1 className="text-3xl font-bold text-center my-10">
                Create Listing
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                <div className="w-full flex flex-col items-start p-2" id="div1">
                    <p className="font-semibold">
                        Bilder :
                        <span className="font-normal">
                            {" "}
                            Das 1. Bild wird als Hauptbild angezeigt (max. 6)
                        </span>
                    </p>

                    <div className="flex items-center justify-start w-full mt-4 gap-4">
                        <input
                            type="file"
                            className="w-full"
                            accept="image/*"
                            onChange={(e) => setFilesToUpload(e.target.files)}
                            multiple
                        />
                        <button
                            className="bg-black text-white px-4 py-2 rounded-md"
                            onClick={handleUpload}
                        >
                            Hochladen
                        </button>
                    </div>

                    {/* Image carousel */}
                    <div className="w-full mt-4 overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        <div className="flex gap-2 pb-2">
                            {images.map((imageUrl, index) => (
                                <div key={index} className="flex flex-col items-center justify-center flex-shrink-0 p-1 gap-1">
                                    <img
                                        src={imageUrl}
                                        alt={`Uploaded ${index + 1}`}
                                        className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                                    />
                                    {/* <MdDelete className=" w-4 h-4  text-black hover:cursor-pointer" /> */}
                                    <button className="text-xs w-20 bg-black text-white px-2 py-1 rounded-md"
                                        onClick={() => {
                                            setImages(
                                                images.filter(
                                                    (img) => img != imageUrl
                                                )
                                            );
                                        }}
                                    >
                                        Löschen
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {imageUploadError && (
                        <p className="text-red-500">{imageUploadError}</p>
                    )}

                    <button className="w-full bg-black text-white px-4 py-2 rounded-md mt-4">
                        Erstellen
                    </button>
                </div>

                {/* div 2 */}

                <div
                    className="w-full  flex flex-col justify-center items-start p-2"
                    id="div2"
                >
                    <input
                        className="w-96 p-2 mt-4 border border-gray-300 rounded-md outline-none"
                        type="text"
                        placeholder="Name"
                        required
                    />
                    <textarea
                        className="w-96 p-2 mt-4 border border-gray-300 rounded-md outline-none"
                        type="text"
                        placeholder="Beschreibung"
                        required
                    />
                    <input
                        className="w-96 p-2 mt-4 border border-gray-300 rounded-md outline-none"
                        type="text"
                        placeholder="Adresse"
                        required
                    />

                    {/* Checkboxes */}
                    <div className="flex flex-wrap gap-4 max-w-96  mt-4">
                        <div className="mt-4 flex gap-2 items-center justify-center">
                            <input type="checkbox" />
                            <span>Verkaufen</span>
                        </div>
                        <div className="mt-4 flex gap-2 items-center justify-center">
                            <input type="checkbox" />
                            <span>Mieten</span>
                        </div>
                        <div className="mt-4 flex gap-2 items-center justify-center">
                            <input type="checkbox" />
                            <span>Parkplatz</span>
                        </div>
                        <div className="mt-4 flex gap-2 items-center justify-center">
                            <input type="checkbox" />
                            <span>Möbliert</span>
                        </div>

                        <div className="mt-1 flex gap-2 items-center justify-center">
                            <input
                                type="checkbox"
                                checked={isOffer}
                                onChange={handleOfferChange}
                            />
                            <span>Angebot</span>
                        </div>
                    </div>

                    {/* Beds and Baths */}
                    <div className="flex gap-4 mt-4">
                        <div className="flex gap-2 items-center justify-center mt-4">
                            <input
                                className="bg-white px-2 border border-gray-300 rounded-md outline-none"
                                type="number"
                                placeholder="0"
                                min={0}
                                max={10}
                            />
                            <span>Schlafzimmer</span>
                        </div>

                        <div className="flex gap-2 items-center justify-center mt-4">
                            <input
                                className="bg-white px-2 border border-gray-300 rounded-md outline-none"
                                type="number"
                                placeholder="0"
                                min={0}
                                max={10}
                            />
                            <span>Badezimmer</span>
                        </div>
                    </div>

                    {/* Regular and Discounted Price */}
                    <div className="flex flex-col items-start gap-4 mt-4">
                        <div className="flex gap-2 items-center justify-center mt-4">
                            <input
                                className="bg-white px-2 py-1 border border-gray-300 rounded-md outline-none"
                                type="number"
                                placeholder="0"
                                min={200}
                            />
                            <span>Preis</span>
                        </div>

                        {isOffer && (
                            <div className="flex gap-2 items-center justify-center mt-1">
                                <input
                                    className="bg-white px-2 py-1 border border-gray-300 rounded-md outline-none"
                                    type="number"
                                    placeholder="0"
                                    min={200}
                                />
                                <span>Preis (Rabatt)</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateListing;
