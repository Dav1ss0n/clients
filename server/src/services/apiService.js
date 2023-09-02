const 
    ApiError = require('../exceptions/apiError'),
    Type = require('../models/typeModel'),
    Business = require('../models/businessModel'),
    tokenService =require("../services/tokenService");

class apiService {
    async createBusiness(data, token, logo) {
        const {name, type, schedule} = data;

        const candidateName = await Business.findOne({name});
        if (candidateName) {
            throw ApiError.Locked('Business with such a name is already existing');
        }

        const candidateType = await Type.findOne({value: type});
        if (!candidateType) {
            throw ApiError.InternalServerError();
        }

        const finalSchedule = {
            'monday': schedule,
            'tuesday': schedule,
            'wednesday': schedule,
            'thursday': schedule,
            'friday': schedule,
            'saturday': schedule,
            'sunday': schedule
        }

        const payload = tokenService.validateToken(token);
        const owner = payload.email;

        // const logo = logo;
        // if (!logo) {
        //     throw ApiError.BadRequest("")
        // }

        const business = new Business({name, owner, schedule: finalSchedule, type});
        await business.save();

        return {
            'msg': 'Succesfully created!'
        }
    }

    async types() {
        const result = await Type.find();
        return result;
    }

    async data(token) {
        const payload = tokenService.validateToken(token);

        const businesses = Business.find({owner: payload.email});
        return businesses;
    }
}

module.exports = new apiService();