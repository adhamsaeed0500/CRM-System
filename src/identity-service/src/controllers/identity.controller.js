const logger = require('../utils/logger');
const { validateRegistration, validateRegistrationByAdmin } = require('../utils/validators');
const User = require("../models/User");
const generateTokens = require("../utils/generateToken");

const registerUser = async(req, res) => {
    logger.info("strating Registration endpoint");

    try {
        const { error } = validateRegistration(req.body);
        if (error) {
            logger.warn("Rgistration Validation error", error.details[0].message);
            return res.status(400).json({
               success: false,
               message: error.details[0].message,
           });        
        }

        const { email, password, name } = req.body;

         let user = await User.findOne({ $or: [{ email }, { name }] });
        if (user) {
            logger.warn("Registration - User already exists");
            return res.status(400).json({
                success: false,
                message: "User already exists",
             });
    }   


         user = new User({ name, email, password });
         await user.save();
         logger.info("Registration - User saved successfully", user._id);

         const { accessToken, refreshToken } = await generateTokens(user);

         res.status(201).json({
            success: true,
            userId: User._id,
            accessToken,
            refreshToken,
            message: "User registered successfully!",
        });

    } catch (err) {
        logger.warn("Registration error occured" , err);
        res.status(500).json({
        success: false,
        message: "Internal server error",
    });
        
    }
};

const createUserByAdmin = async(req, res) => {
    logger.info("strating RegistrationByAdmin endpoint");

    try {
        const { error } = validateRegistrationByAdmin(req.body);
        if (error) {
            logger.warn("RegistrationByAdmin Validation error", error.details[0].message);
            return res.status(400).json({
               success: false,
               message: error.details[0].message,
           });        
        }

        const { email, password, name, role } = req.body;

         let user = await User.findOne({ $or: [{ email }, { name }] });
        if (user) {
            logger.warn("RegistrationByAdmin - User already exists");
            return res.status(400).json({
                success: false,
                message: "User already exists",
             });
    }   


         user = new User({ name, email, password, role });
         await user.save();
         logger.info("RegistrationByAdmin - User saved successfully", user._id);


         res.status(201).json({
            success: true,
            userId: User._id,
            message: "User registered successfully!",
        });

    } catch (err) {
        logger.warn("RegistrationByAdmin error occured" , err);
        res.status(500).json({
        success: false,
        message: "Internal server error",
    });
        
    }
};

module.exports = { registerUser, createUserByAdmin }