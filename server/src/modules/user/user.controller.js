const { removeFile } = require("../../config/multer");
const {
  generateVerifyToken,
  decodeToken,
  generateToken,
} = require("../../helpers/jwtHelper");
const { sendVerifyEmail } = require("../../helpers/sendEmailHelper");
const User = require("./user.model");
const {
  getUsername,
  getUser,
  createNewUser,
  getUserWithPassword,
  getUserInfoById,
} = require("./user.service");
const bcrcypt = require("bcryptjs");

const createUser = async (req, res) => {
  try {
    const isExistUser = await getUser(req.body.email);
    if (isExistUser) {
      if (isExistUser?.verified) {
        res.status(201).json({
          status: 201,
          success: false,
          type: "email",
          message: "Email already in use",
        });
      } else {
        const token = await generateVerifyToken({
          email: isExistUser?.email,
          username: isExistUser?.username,
          _id: isExistUser?._id,
        });
        await sendVerifyEmail(isExistUser, token);
        res.status(200).json({
          status: 200,
          success: false,
          type: "unverified",
          message:
            "This Email have an account and account is unverified. Please check your email, and verify your email address",
        });
      }
    } else {
      const isExistUsername = await getUsername(req.body.username);
      if (isExistUsername) {
        return res.status(200).json({
          status: 200,
          success: false,
          type: "username",
          message: "Username already in use",
        });
      } else {
        const createResult = await createNewUser(req.body);
        const token = await generateVerifyToken({
          email: createResult?.email,
          username: createResult?.username,
          _id: createResult?._id,
        });
        await sendVerifyEmail(createResult, token);
        res.status(200).json({
          status: 200,
          success: true,
          type: "verify",
          message: "Please check your email, and verify your email address",
        });
      }
    }
  } catch (error) {
    res.status(201).json({
      status: 201,
      success: false,
      message: "User Create Failed!",
      error_message: error.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const tokenUser = await decodeToken(req.params.token);
    if (tokenUser?.success) {
      const user = await getUser(tokenUser?.data?.email);
      if (user) {
        if (user?.verified) {
          return res.status(200).json({
            status: 200,
            success: true,
            message: "Email Already Verified",
          });
        } else {
          const result = await User.findByIdAndUpdate(
            {
              _id: tokenUser?.data?._id,
              email: tokenUser?.data?.email,
            },
            {
              $set: {
                verified: true,
              },
            },
            { new: true }
          );
          res.status(200).json({
            status: 200,
            success: true,
            message:
              "Welcome! Your email has been successfully verified. Thank you for completing your registration and joining the society!",
            data: result,
          });
        }
      } else {
        res.status(404).json({
          status: 404,
          success: false,
          type: "email",
          message: "Account Not Found!",
        });
      }
    } else {
      res.status(200).json({
        status: 201,
        success: false,
        message: "Verification is Expired!. please try again",
      });
    }
  } catch (error) {
    res.status(201).json({
      status: 201,
      success: false,
      message: "User Verification Failed!",
      error_message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const isExistUser = await getUserWithPassword(req.body.email);
    if (isExistUser) {
      if (isExistUser?.verified) {
        if (bcrcypt.compareSync(req.body.password, isExistUser.password)) {
          const accessToken = await generateToken({
            email: isExistUser?.email,
            username: isExistUser?.username,
            verified: isExistUser?.verified,
            _id: isExistUser?._id,
          });
          const user = await getUserInfoById(isExistUser?._id?.toString());
          return res.status(200).json({
            status: 200,
            success: true,
            message: "User Login Success",
            data: { accessToken: accessToken, user: user },
          });
        } else {
          return res.status(201).json({
            status: 201,
            success: false,
            type: "password",
            message: "Incorrect Password",
          });
        }
      } else {
        const token = await generateVerifyToken({
          email: isExistUser?.email,
          username: isExistUser?.username,
          _id: isExistUser?._id,
        });
        await sendVerifyEmail(isExistUser, token);
        res.status(200).json({
          status: 200,
          type: "unverified",
          success: false,
          message:
            "This Email have an account and account is unverified. Please check your email, and verify your email address",
        });
      }
    } else {
      return res.status(404).json({
        status: 404,
        success: false,
        type: "email",
        message: "User not Found!",
      });
    }
  } catch (error) {
    res.status(201).json({
      status: 201,
      success: false,
      message: "User Login Failed!",
      error_message: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ verified: true }).sort({ _id: -1 });
    // Return the combined data
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    res.status(201).json({
      status: 201,
      success: false,
      message: "User Retrieve Failed!",
      error_message: error.message,
    });
  }
};

module.exports = {
  createUser,
  verifyEmail,
  loginUser,
  getAllUsers,
};
