class Responser {
  /**
   * Used in situations with validation errors
   * @param {Object} res - an existing response
   * @param {String} ini - the initiator of an error
   * @param {String} msg - a message to be sent
   * @returns a response with 400 code
   */
  async BadRequest(res, ini, msg) {
    return res
      .status(400)
      .json({
        status: "error",
        error: "Bad request",
        ini,
        msg
      });
  }

  async Unauthorized(res, ini) {
    return res
    .status(401)
    .json({
      status: "error",
      error: "Unauthorized",
      ini
    });
  }

  async NotFound(res, ini) {
    return res
    .status(404)
    .json({
      status: "error",
      error: "Not found",
      ini
    });
  }

  /**
   * Used in situations where existing data was tried to be created
   * @param {Object} res - an existing response
   * @param {String} ini - the initiator of an error
   * @param {String} msg - a message to be sent
   * @returns a response with 409 code
   */
  async Conflict(res, ini, msg) {
    return res
      .status(409)
      .json({
        status: "error",
        error: "Conflict",
        ini,
        msg
      });
  }

  async InternalServerError(res, ini) {
    return res
    .status(500)
    .json({
      status: "error",
      error: "Internal Server Error",
      ini
    });
  }
}

module.exports = new Responser();