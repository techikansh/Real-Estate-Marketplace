import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/errorHandler.js";

export async function createListing(req, res, next) {
    const { id } = req.user;
    try {
        const listing = await Listing.create(req.body);
        res.status(201).json({ success: true, listing });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export async function deleteUserListing(req, res, next) {
    const { id } = req.user;
    const listingsId = req.params.id;
    const listing = await Listing.findById(listingsId);

    if (!listing) return next(errorHandler(404, "kein Listing gefunden"));

    if (id != listing.userRef)
        return next(
            errorHandler(403, "Sie können nur Ihre eigene Daten löschen")
        );

    try {
        await Listing.findByIdAndDelete(listingsId);
        res.status(200).json({
            success: true,
            message: "Listing erfolgreich gelöscht",
        });
    } catch (error) {
        next(error);
    }
}

export async function updateUserListing(req, res, next) {
    const { id } = req.user;
    const listingId = req.params.id;
    const listing = await Listing.findById(listingId);

    if (!listing) return next(errorHandler(404, "kein Listing gefunden"));

    if (id != listing.userRef)
        return next(
            errorHandler(403, "Sie können nur Ihre eigene Daten aktualisieren")
        );

    try {
        const updatedListing = await Listing.findByIdAndUpdate(
            listingId,
            req.body,
            { new: true }
        );
        return res.status(200).json({
            success: true,
            listing: updatedListing,
        });
    } catch (error) {
        next(error);
    }
}

export async function getListingById(req, res, next) {
    const listingId = req.params.id;
    try {
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return next(errorHandler(404, "kein Listing gefunden"));
        }
        res.status(200).json({ success: true, listing });
    } catch (error) {
        next(error);
    }
}

export async function searchListings(req, res, next) {
    const searchTerm = req.query.searchTerm || "";
    // console.log("Search Term:", searchTerm);

    let type = req.query.type;
    // console.log(type);
    if (type == undefined || type == "all") {
        type = { $in: ["rent", "sale"] };
    }
    let offer = req.query.offer;
    // console.log(offer);
    if (offer == undefined || offer == "false") {
        offer = { $in: [true, false] };
    }
    let parking = req.query.parking;
    // console.log(parking);
    if (parking == undefined || parking == "false") {
        parking = { $in: [true, false] };
    }
    let furnished = req.query.furniture;
    // console.log(furnished);
    if (furnished == undefined || furnished == "false") {
        furnished = { $in: [true, false] };
    }
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";
    const limit = req.query.limit || 9;
    const startIndex = req.query.startIndex || 0;
    // console.log("--------------");

    // console.log("Search Term:", searchTerm);
    // console.log("Type:", type);
    // console.log("Offer:", offer);
    // console.log("Parking:", parking);
    // console.log("Furnished:", furnished);
    // console.log("Sort:", sort);
    // console.log("Order:", order);
    // console.log("Limit:", limit);

    try {
        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: "i" },
            type,
            offer,
            parking,
            furnished,
        })
            .sort({ [sort]: order })
            .limit(limit)
            .skip(startIndex);

        // console.log(listings);

        res.status(200).json({ success: true, listings });
    } catch (error) {
        next(error);
    }
}
