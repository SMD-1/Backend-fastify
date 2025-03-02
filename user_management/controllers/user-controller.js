async function LOGIN_USER(request, reply) {
  try {
    console.log("request.body", request.body);
    return {
      hello: "world",
    };
  } catch (error) {
    console.error("Something went Wrong!", error);
  }
}

module.exports = {
  LOGIN_USER,
};
