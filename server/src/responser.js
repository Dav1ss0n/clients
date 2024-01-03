class Responser {
  async BadRequest(res, ini) {
    return res
      .status(400)
      .json({
        status: "error",
        message: "Bad request",
        ini
      });
  }

  async Unauthorized(res, ini) {
    return res
    .status(403)
    .json({
      status: "error",
      message: "Unauthorized",
      ini
    });
  }

  async NotFound(res, ini) {
    return res
    .status(404)
    .json({
      status: "error",
      message: "Not found",
      ini
    });
  }

  async InternalServerError(res, ini) {
    return res
    .status(500)
    .json({
      status: "error",
      message: "Internal Server Error",
      ini
    });
  }
}

module.exports = new Responser();