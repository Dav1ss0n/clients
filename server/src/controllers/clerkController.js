const
    tokenService = require("../services/tokenService"),

    Clerk = require("../models/clerkModel"),
    User = require("../models/userModel"),
    Business = require("../models/businessModel"),
    
    {validationResult} = require("express-validator"),
    bcrypt = require("bcrypt");


class ClerkController {
    async add(req, res) {
        try {
            // validate user input using express-validator
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(422)
                    .json({
                        errors: errors.array()
                    });
            }

            const { name, email, bio } = req.body;

            let businessId;

            const businessEmail = req.params.businessEmail;
            if (!businessEmail) {
                const token = req.cookies.token;
                const businessAccountId = tokenService.validateToken(token).userId;
    
                const business = await Business.findOne({ ownerId: businessAccountId});
                if (!business) {
                    return res
                        .status(401)
                        .json({
                            message: 'No matching business was found'
                        });
                }
                businessId = business._id;
            } else {
                const businessAccount = await User.findOne({ email: businessEmail });
                if (!businessAccount) {
                    return res
                        .status(401)
                        .json({
                            message: 'No matching business was found'
                        });
                }

                const businessAccountId = businessAccount._id;
                const business = await Business.findOne({ ownerId: businessAccountId });
                if (!business) {
                    return res
                        .status(401)
                        .json({
                            message: 'No matching business was found'
                        });
                }

                businessId = business._id
            }


            const existingClerk = await User.findOne({ email });
            if (!existingClerk) {
                return res
                    .status(500)
                    .json({
                        message: 'Internal Server Error',
                        ini: 'Clerk existence check'
                    });
            }
            const clerkAccountId = existingClerk._id;

            const newClerk = new Clerk({
                accountId: clerkAccountId,
                name,
                businessId,
                email,
                bio
            });
            await newClerk.save();

            return res
                .status(201)
                .json({
                    message: 'Clerk was added succesfully'
                });

        } catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({
                    message: 'Server error',
                    ini: 'Add clerk system',
                    error: err
                });
        }
    }

    async edit(req, res) {
        try {
            // validate user input using express-validator
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(422)
                    .json({
                        errors: errors.array()
                    });
            }

            const clerkId = req.params.clerkId;
            const { name, email, bio }  = req.body;
            const updatedClerk = await Clerk.findOneAndUpdate({ _id: clerkId} , {$set: { name, email, bio }});
            if (!updatedClerk) {
                return res
                        .status(401)
                        .json({
                            message: 'No matching business was found'
                        }); 
            }

            const clerkAccountId = updatedClerk.accountId;
            const updatedClerkAccount = await User.findOneAndUpdate({ _id: clerkAccountId }, {$set: { username: name, email }});
            if (!updatedClerkAccount) {
                return res
                        .status(401)
                        .json({
                            message: 'No matching business was found'
                        });
            }

            return res
                .status(201)
                .json({
                    message: 'Clerk was updated succesfully',
                    result: updatedClerk
                });
        } catch (err) {
            return res
                .status(500)
                .json({
                    message: 'Server error',
                    ini: 'Receive businesses system'
                });
        }
    }

    async delete(req, res) {
        try {
            const clerkId = req.params.clerkId;

            const deletingClerk = await Clerk.findOneAndDelete({ _id: clerkId });
            if (!deletingClerk) {
                return res
                    .status(401)
                    .json({
                        message: 'Clerk was not found'
                    });
            }

            const clerkAccountId = deletingClerk.accountId;
            
            const deletingClerkAccount = await User.findOneAndDelete({ _id: clerkAccountId });
            if (!deletingClerkAccount) {
                return res
                    .status(500)
                    .json({
                        message: 'Internal server error',
                        ini: 'Clerk account deletion system'
                    });
            }

            return res
                .status(201)
                .json({
                    message: 'Clerk was deleted successfully'
                }); 

        } catch (err) {
            return res
                .status(500)
                .json({
                    message: 'Server error',
                    ini: 'Receive businesses system'
                });
        }
    }
}

module.exports = new ClerkController();