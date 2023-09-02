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
    
class ApiController {
    async createAccount(req, res) {
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
            
            // bind request data to variables
            const {email, username, password} = req.body;

            // check if user with same email or username already exists
            const existingUser = await User.findOne({$or: [{email}, {username}]});
            if (existingUser) {
                return res
                    .status(422)
                    .json({
                        message: 'Email or username already exists'
                    });
            }

            // hash password using bcrypt
            const hashedPassword = await bcrypt.hash(password, 12);

            // create new user in MongoDB database using Mongoose
            const newUser = new User({
                email,
                password: hashedPassword,
                username,
                roles: ['Business']
            });
            await newUser.save();

            // create and sign JWT token with secret key
            // const token = jwt.sign({userId: newUser._id, roles: ['Business']}, process.env.JWT_SECRET, {expiresIn: '1y'});
            const token = tokenService.generateAccessToken(newUser._id, ['Business']);

            // set JWT token as cookie
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 365 * 24 * 60 * 60 * 1000 // 1 day in milliseconds
            });

            return res
                .status(201)
                .json({
                    message: 'Account created successfully'
                });
        } catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({
                    message: 'Server error',
                    ini: 'Account creation system'
                });
        }
    }

    async createBusiness(req, res) {
        try {
            // validate user input using express-validator
            const errors = validationResult(req.body);
            if (!errors.isEmpty()) {
                return res
                    .status(422)
                    .json({
                        errors: errors.array()
                    });
            }

            const {description, category, location} = req.body;
            
            //decoding token and receiving business id
            // const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            // const accountID = decodedToken.userId;
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

            //generating random filename
            const fileExtension = path.extname(logo.originalname);
            const randomString = crypto.randomBytes(12).toString('hex');
            let filename = randomString + fileExtension;

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
                    ini: 'Business creation system'
                });
        }
    } 

    async userData(req, res) {
        try {
            // create account data object
            const account = {};

            // decoding token from cookies
            // const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            
            const token = req.cookies.token;
            const decodedToken = tokenService.validateToken(token);
            const accountId = decodedToken.userId;
            
            // checking for roles from token
            const roles = decodedToken.roles;
            if (roles[0] == 'Business') {
                const existingBusiness = await Business.findOne({ownerId: accountId});
                if (!existingBusiness) {
                    account.business = null;
                }

                account.business = existingBusiness;
            }

            // receiving account data from database
            const existingAccount = await User.findOne({_id: accountId}).select('-password').exec();
            account.data = existingAccount;

            return res
                .status(200)
                .json(account);
        } catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({
                    message: 'Server error',
                    ini: 'Receive data system'
                });
        }
    }

    async businesses(req, res) {
        try {
            // receiving the list of businesses
            const businesses = await Business.find();
            // creating response array
            let dataToSend = [];

            // creating a Promise to make process asynchronous
            await Promise.all(
                // mapping the businesses array and forming a data for response arrray
                businesses.map(async (business) => {
                    const ownerId = business.ownerId;

                    // receiving an array of users-business accounts
                    const user = await User.findOne({_id: ownerId}).select('-password').exec();
                    dataToSend.push({business, user});
                })
            );

            return res
                .status(200)
                .json(
                    dataToSend
                );
        } catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({
                    message: 'Server error',
                    ini: 'Receive businesses system'
                });
        }
    }

    async editBusiness(req, res) {
        try {
            // receiving the list of updated fields
            const updatedFields = req.body;

            // decoding token from cookies
            // const accountId = decodedToken.userId;
            // const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            
            const token = req.cookies.token;
            const accountId = tokenService.validateToken(token).userId;

            const result = await Business.findOneAndUpdate({ownerId: accountId}, {$set: updatedFields});

            return res
                .status(200)
                .json({
                    result
                });
        } catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({
                    message: 'Server error',
                    ini: 'Edit Business system'
                });
        }
    }
}


module.exports = new ApiController();