const { generateUniqueCode } = require("../../core/common_func");
const { hashPassword, verifyPassword } = require("../../core/pass_enc_dec");
const { storeData, retrieveData } = require("../../core/redis");
const {
  getUsers,
  createUser,
  getUserDetails,
} = require("../services/user-service");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function GET_USERS(request, reply) {
  try {
    const response = await getUsers(this);
    return reply.code(200).send(response);
  } catch (error) {
    console.error("Something went Wrong!", error);
  }
}

async function CREATE_USER(request, reply) {
  try {
    const body = request.body;
    const hashedPassword = await hashPassword(body.password);
    const userDetails = {
      username: body.username,
      email: body.email,
      password: hashedPassword,
      mobile: body.mobile,
      first_name: body.first_name,
      last_name: body.last_name,
      middle_name: body.middle_name,
    };

    const userCreateResponse = await createUser(this, userDetails);
    if (userCreateResponse?.error) {
      return reply.status(401).send({
        message: userCreateResponse.message,
        error: userCreateResponse.error,
      });
    }
    return reply.code(200).send({ userCreateResponse, success: true });
  } catch (error) {
    return reply
      .status(500)
      .send({ success: false, message: error.message, error: error.stack });
  }
}

async function LOGIN_USER(request, reply) {
  try {
    const email = request.body.email;
    const password = request.body.password;
    const JWT_SECRET = process.env.JWT_SECRET;
    const user = await getUserDetails(this, email);
    if (user.length === 0) {
      return reply.status(401).send({ message: "User not found", error: true });
    }
    if (user.error) {
      return reply
        .status(401)
        .send({ message: user.message, error: user.error });
    }
    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return reply
        .status(401)
        .send({ message: "Username or password is incorrect" });
    }

    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        middle_name: user.middle_name,
        last_name: user.middle_name,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    return reply.code(200).send({ token: token, success: true });
  } catch (error) {
    return reply
      .status(500)
      .send({ success: false, message: error.message, error: error.stack });
  }
}

async function GENERATE_LOGIN_CODE(request, reply) {
  try {
    const token = request.body.token;
    // const validateAndUserData = validateToken(token)
    const code = generateUniqueCode();
    storeData(code, token, 360);
    await retrieveData(code);
    return reply.code(200).send(code);
  } catch (error) {
    return reply
      .status(500)
      .send({ success: false, message: error.message, error: error.stack });
  }
}

async function LOGIN_WITH_CODE(request, reply) {
  try {
    const loginCode = request.params.code;
    const cachedData = await retrieveData(loginCode);
    if (!cachedData) {
      return reply.send({
        status: false,
        message: "Invalid code or code has been expired",
      });
    }
    return reply.send({
      status: "success",
      token: cachedData,
    });
  } catch (error) {
    return reply
      .status(500)
      .send({ success: false, message: error.message, error: error.stack });
  }
}

module.exports = {
  GET_USERS,
  CREATE_USER,
  LOGIN_USER,
  GENERATE_LOGIN_CODE,
  LOGIN_WITH_CODE,
};
