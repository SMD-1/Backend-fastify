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
    reply.code(200).send(response);
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
    if (userCreateResponse.name == "error") {
      console.log("Error occured while creating user");
    }
    reply.code(200).send(userCreateResponse);
  } catch (error) {
    console.error("Something went Wrong!", error);
  }
}

async function LOGIN_USER(request, reply) {
  try {
    const { username, password } = request.body;
    const JWT_SECRET = process.env.JWT_SECRET;
    const user = await getUserDetails(this, username);
    if (!user) {
      return reply
        .status(401)
        .send({ message: "Username or password is incorrect" });
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
    return reply.code(200).send({ token });
  } catch (error) {
    console.error("Something went Wrong!", error);
  }
}

async function GENERATE_LOGIN_CODE(request, reply) {
  try {
    const token = request.token;
    // const validateAndUserData = validateToken(token)
    const code = generateUniqueCode();
    storeData(code, token, 360);
    await retrieveData(code);
    reply.code(200).send(code);
  } catch (error) {
    console.error("Something went Wrong!", error);
  }
}

async function LOGIN_WITH_CODE(request, reply) {
  try {
    const loginCode = request.params.code;
    const cachedData = await retrieveData(loginCode);
    if (!cachedData) {
      reply.send({
        status: "failed",
        message: "Invalid code or code has been expired",
      });
    }
    reply.send({
      status: "success",
      token: cachedData,
    });
  } catch (error) {
    console.error("Something went Wrong!", error);
  }
}

module.exports = {
  GET_USERS,
  CREATE_USER,
  LOGIN_USER,
  GENERATE_LOGIN_CODE,
  LOGIN_WITH_CODE,
};
