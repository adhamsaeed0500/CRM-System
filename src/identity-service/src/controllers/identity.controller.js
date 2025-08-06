const logger = require('../utils/logger');
const { validateRegistration, validateRegistrationByAdmin , validatelogin } = require('../utils/validators');
const User = require("../models/User");
const RefreshToken = require('../models/refreshToken.model');
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

const loginUser = async (req, res) => {
  logger.info(" start Login endpoint");
  try {
    const { error } = validatelogin(req.body);
    if (error) {
      logger.warn("Validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      logger.warn("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      logger.warn("Invalid password");
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    res.json({
      accessToken,
      refreshToken,
      userId: user._id,
    });
  } catch (e) {
    logger.error("Login error occured", e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const logoutUser = async (req, res) => {
  logger.info("start Logout endpoint");
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      logger.warn("Refresh token missing");
      return res.status(400).json({
        success: false,
        message: "Refresh token missing",
      });
    }

   const storedToken = await RefreshToken.findOneAndDelete({
      token: refreshToken,
    });
    if (!storedToken) {
      logger.warn("Invalid refresh token provided");
      return res.status(400).json({
        success: false,
        message: "Invalid refresh token",
      });
    }
    logger.info("Refresh token deleted for logout");

    res.json({
      success: true,
      message: "Logged out successfully!",
    });
  } catch (e) {
    logger.error("Error while logging out", e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const refreshTokenUser = async (req, res) => {
    logger.info('start refreshToken endpoint');
     try {
        const { refreshToken } = req.body;
        if(!refreshToken){
            logger.warn('missing refresh token');
            res.status(400).json({
                success:false,
                message:'missing refresh token'
            })
        }

        const storedToken = await RefreshToken.find({token});
        if(!storedToken){
            logger.warn('can not find refresh token');
            res.status(400).json({
                success:false,
                message:'can not refresh token'
            })
        }

        if(storedToken.expiresAt < new Date()){
            logger.warn("Invalid or expired refresh token");
            return res.status(401).json({
                success: false,
                message: `Invalid or expired refresh token`,
            });
        };
        const user = await User.findById(storedToken.user);
        if (!user) {
            logger.warn("User not found");
            return res.status(401).json({
                success: false,
                message: `User not found`,
            });
        };
        
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            await generateTokens(user);
            
        await RefreshToken.deleteOne({ _id: storedToken._id });

        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });

     } catch (e) {
        logger.warn('refreshToken error occured', e.message);
        res.status(500).json({
            success:false,
            message:'internal server error'
        })
     }
};

module.exports = { registerUser, createUserByAdmin, loginUser, logoutUser,refreshTokenUser }