import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/errorHandler.js";

export const updateUser = async (req, res, next) => {
    const { id } = req.user;
    const _id = req.params.id;

    if (id != _id)
        return next(
            errorHandler(403, "Sie können nur Ihre eigene Daten bearbeiten")
        );

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar,
                },
            },
            { new: true }
        );

        if (!updatedUser) return next(errorHandler(404, "User not found"));

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: rest,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    const { id } = req.user;
    const _id = req.params.id;

    if (id != _id) {
        return next(
            errorHandler(403, "Sie können nur Ihre eigene Daten löschen")
        );
    }

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) return next(errorHandler(404, "User not found"));

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

export async function getUserListings(req, res, next) {
    const _id = req.params.id;
    const { id } = req.user;

    if (_id != id) {
        return next(
            errorHandler(403, "Sie können nur Ihre eigene Daten ansehen")
        );
    }

    try {
        const listings = await Listing.find({ userRef: _id });
        return res.status(200).json({ success: true, listings });
    } catch (error) {
        next(error);
    }
}
