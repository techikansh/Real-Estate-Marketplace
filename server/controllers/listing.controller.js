import Listing from "../models/listing.model.js";

export async function createListing (req, res, next) {
    const {id} = req.user;
    try {
        const listing = await Listing.create(req.body);
        res.status(201).json({success: true, listing});
    } catch (error) {
        console.log(error);
        next(error);
    }
}


