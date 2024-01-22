const responser = require("../utils/responser");
const logger = require("../utils/logger");

class ClerkController {

    async getEmployees(req, res) {
        try {
            
        } catch (error) {
            logger.error(new Error(error));
            return responser.InternalServerError(res, '~getEmployees ')
        }
    }
}

module.exports = new ClerkController();