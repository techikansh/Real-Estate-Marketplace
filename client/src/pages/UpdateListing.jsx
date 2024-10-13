import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { app } from "../utils/firebase";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { useNavigate, useParams } from "react-router-dom";

const UpdateListing = () => {
    const navigate = useNavigate();
    const {listingId} = useParams();
    const [filesToUpload, setFilesToUpload] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [updatingError, setUpdatingError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        address: "",
        regularPrice: 0,
        discountPrice: 0,
        bathrooms: 0,
        bedrooms: 0,
        furnished: false,
        parking: false,
        type: "sale",
        offer: false,
        imageUrls: [],
        userRef: useSelector((state) => state.user.currentUser._id),
    });

    const handleOfferChange = (e) => {
        setFormData({ ...formData, offer: e.target.checked });
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

        setUploading(true);
        const promises = [];
        for (const file of filesToUpload) {
            promises.push(storeToFirebase(file));
        }
        Promise.all(promises)
            .then((urls) => {
                // setImages(urls);
                setFormData({ ...formData, imageUrls: urls });
                setUploading(false);
            })
            .catch((err) => {
                setImageUploadError("Maximale Größe pro Bild ist 2MB");
                setUploading(false);
            });
    };

    const handleUpdate = async () => {
        setUpdating(true);
        setUpdatingError("");

        const url = `${BASE_URL}/listing/update/${listingId}`;
        const res = await fetch(url, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
            setUpdating(false);
            navigate(`/listing/${listingId}`);
        } else {
            setUpdating(false);
            setUpdatingError(data.message);
        }
    };

    const getListing = async () => {
        const url = `${BASE_URL}/listing/get/${listingId}`;
        const res = await fetch(url, {
            method: "GET",
        });
        const data = await res.json();
        if (data.success) {
            setFormData(data.listing);
        } else {
            console.log(data.message);
        }
    }

    useEffect(() => {
        getListing();
    }, []);

    return (
        <div className="flex flex-col justify-center items-center mx-10">
            <h1 className="text-3xl font-bold text-center my-10">
                Update Listing
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
                            className="bg-black text-white px-4 py-2 rounded-md min-w-36"
                            onClick={handleUpload}
                            disabled={uploading}
                        >
                            {uploading ? "Lädt hoch..." : "Hochladen"}
                        </button>
                    </div>

                    {/* Image carousel */}
                    <div className="w-full mt-4 overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        <div className="flex gap-2 pb-2">
                            {formData.imageUrls.map((imageUrl, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center justify-center flex-shrink-0 p-1 gap-1"
                                >
                                    <img
                                        src={imageUrl}
                                        alt={`Uploaded ${index + 1}`}
                                        className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                                    />
                                    {/* <MdDelete className=" w-4 h-4  text-black hover:cursor-pointer" /> */}
                                    <button
                                        className="text-xs w-20 bg-black text-white px-2 py-1 rounded-md"
                                        onClick={() => {
                                            setFormData({
                                                ...formData,
                                                imageUrls:
                                                    formData.imageUrls.filter(
                                                        (img) => img != imageUrl
                                                    ),
                                            });
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

                    {updatingError && (
                        <p className="text-red-500">{updatingError}</p>
                    )}

                    <button
                        className="w-full bg-black text-white px-4 py-2 rounded-md mt-4"
                        onClick={handleUpdate}
                        disabled={updating}
                    >
                        {updating ? "Wird aktualisiert..." : "Aktualisieren"}
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
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        required
                    />
                    <textarea
                        className="w-96 p-2 mt-4 border border-gray-300 rounded-md outline-none"
                        type="text"
                        placeholder="Beschreibung"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                description: e.target.value,
                            })
                        }
                        required
                    />
                    <input
                        className="w-96 p-2 mt-4 border border-gray-300 rounded-md outline-none"
                        type="text"
                        placeholder="Adresse"
                        value={formData.address}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                address: e.target.value,
                            })
                        }
                        required
                    />

                    {/* Checkboxes */}
                    <div className="flex flex-wrap gap-4 max-w-96  mt-4">
                        <div className="mt-4 flex gap-2 items-center justify-center">
                            <input
                                type="checkbox"
                                checked={formData.type === "sale"}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        type: e.target.checked
                                            ? "sale"
                                            : "rent",
                                    })
                                }
                            />
                            <span>Verkaufen</span>
                        </div>
                        <div className="mt-4 flex gap-2 items-center justify-center">
                            <input
                                type="checkbox"
                                checked={formData.type === "rent"}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        type: e.target.checked
                                            ? "rent"
                                            : "sale",
                                    })
                                }
                            />
                            <span>Mieten</span>
                        </div>
                        <div className="mt-4 flex gap-2 items-center justify-center">
                            <input
                                type="checkbox"
                                checked={formData.parking}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        parking: e.target.checked,
                                    })
                                }
                            />
                            <span>Parkplatz</span>
                        </div>
                        <div className="mt-4 flex gap-2 items-center justify-center">
                            <input
                                type="checkbox"
                                checked={formData.furnished}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        furnished: e.target.checked,
                                    })
                                }
                            />
                            <span>Möbliert</span>
                        </div>

                        <div className="mt-1 flex gap-2 items-center justify-center">
                            <input
                                type="checkbox"
                                checked={formData.offer}
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
                                value={formData.bedrooms}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        bedrooms: e.target.value,
                                    })
                                }
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
                                value={formData.bathrooms}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        bathrooms: e.target.value,
                                    })
                                }
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
                                value={formData.regularPrice}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        regularPrice: e.target.value,
                                    })
                                }
                            />
                            <span>Preis</span>
                        </div>

                        {formData.offer && (
                            <div className="flex gap-2 items-center justify-center mt-1">
                                <input
                                    className="bg-white px-2 py-1 border border-gray-300 rounded-md outline-none"
                                    type="number"
                                    placeholder="0"
                                    min={200}
                                    value={formData.discountPrice}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            discountPrice: e.target.value,
                                        })
                                    }
                                />
                                <span>Preis (Rabatt)</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateListing
