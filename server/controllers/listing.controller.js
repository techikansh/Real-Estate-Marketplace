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
