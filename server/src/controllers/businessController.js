const 
    {validationResult} = require('express-validator'),
    tokenService = require("../services/tokenService"),
    User = require("../models/userModel"),
    Business = require("../models/businessModel"),
    bcrypt = require("bcrypt"),
    jwt = require('jsonwebtoken'),
    fs = require("fs"),
    path = require("path"),
    crypto = require("crypto");



class BusinessController {
    async create(req, res) {
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

            const {description, category, location} = req.body;
            
            const token = req.cookies['token'];
            const accountID = tokenService.validateToken(token).userId;

            //checking the db for existence of business with same id
            const existingBusiness = await Business.findOne({ownerId: accountID});
            if (existingBusiness) {
                return res
                    .status(422)
                    .json({
                        message: 'Business already exists'
                    });
            }

            const logo = req.file;
			let filename;

			if (logo) {
				//generating random filename
				const fileExtension = path.extname(logo.originalname);
				const randomString = crypto.randomBytes(12).toString('hex');
				filename = randomString + fileExtension;
	
				fs.writeFile(`${process.env.MEDIA_FOLDER}/${filename}`, logo.buffer, (err) => {
					if (err) {
						console.error(err);
						return res
							.status(500)
							.json({
								message: 'Failed to save file'
							});
					}
				});
			} else {
				filename = null;
			}

            

            //creating and saving a new business
            const newBusiness = new Business({
                ownerId: accountID,
                description,
                category,
                location,
                logo: filename,
            });
            await newBusiness.save();

            return res
                .status(201)
                .json({
                    message: 'Business created successfully'
                });

            
        } catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({
                    message: 'Server error',
                    ini: 'Create businesses system',
                    err
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
			
            // receinving email from the request parameters
            const email = req.params['email'];

            // receiving the list of updated fields
            const updatedFields = req.body;

            // preparing the variable with the data to send as response
            let result;

            //checking for the email in case if it was entered
            if (!email) {
                // no email = request was sent from the business account on the client side
                // taking account id from the cookie-tooken
                const token = req.cookies.token;
                const accountId = tokenService.validateToken(token).userId;
                
                // updating the document in the database by id
                // binding result to the variable
                result = await Business.findOneAndUpdate({ownerId: accountId}, {$set: updatedFields});
            } else {
                // email = request was sent from Staff account

                // updating the document in the database by the email
                // binding result to the variable
                result = await Business.findOneAndUpdate({email}, {$set: updatedFields});
            }

            // checking if the document was found and updated
            if (!result) {
                return res
                    .status(404)
                    .json({
                        message: 'No matching business found'
                    });
            }

            // sending the response
            return res
                .status(201)
                .json({
                    message: 'Changes were saved',
                    result
                });
        } catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({
                    message: 'Server error',
                    ini: 'Edit businesses system',
					err
                });
        }
    }

    async delete(req, res) {
        try {
            // receinving email from the request parameters
            const email = req.params['email'];

            // receiving the list of updated fields
            const updatedFields = req.body;

            // preparing the variable with the data to send as response
            let result;

            //checking for the email in case if it was entered
            if (!email) {
                // no email = request was sent from the business account on the client side
                // taking account id from the cookie-tooken
                const token = req.cookies.token;
                const accountId = tokenService.validateToken(token).userId;
                
                // deleting the business profile data in the database by id
                // binding result to the variable
                result = await Business.deleteOne({ ownerId: accountId });

                if (!result) {
                    return res
                        .status(404)
                        .json({
                            message: 'Mathcing business was not found'
                        });
                }

                // deleting all the associated documents from database

                // ...
                // ...
                // ...
                // ...
                // ...

            } else {
                // email = request was sent from Staff account

                // deleting the document in the database by the email
                // binding result to the variable
                result = await Business.deleteOne({ email });

				if (!result) {
                    return res
                        .status(404)
                        .json({
                            message: 'Mathcing business was not found'
                        });
                }

                // deleting all the associated documents from database

                // ...
                // ...
                // ...
                // ...
                // ...
            }

            // checking if the document was found and updated
            if (!result) {
                return res
                    .status(404)
                    .json({
                        message: 'No matching business found'
                    });
            }

            // sending the response
            return res
                .status(201)
                .json({
                    message: 'Changes were saved',
                    result
                });
        } catch (err) {
			console.error(err);
            return res
                .status(500)
                .json({
                    message: 'Server error',
                    ini: 'Delete businesses system',
					err
                });
        }
    }
}

module.exports = new BusinessController();