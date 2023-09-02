const 
    generateAccessToken = require("./tokenService").generateAccessToken,
    validateToken = require("./tokenService").validateToken,
    AuthError = require("../exceptions/authError"),
    User = require('../models/userModel'),
    Role = require('../models/roleModel'),
    bcrypt = require("bcrypt");



class authService {
    async registration(data) {
        const {email, username, password} = data;

        const candidateEmail = await User.findOne({email})
        if (candidateEmail) {
            throw AuthError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);
        }

        const candidateUsername = await User.findOne({username})
        if (candidateUsername) {
            throw AuthError.BadRequest(`Пользователь с именем ${username} уже существует`);
        }

        const hashPassword = bcrypt.hashSync(password, 7);
        const userRole = await Role.findOne({value: "User"});
        const user = new User({email, username: username, password: hashPassword, roles: [userRole.value]})
        await user.save()

        const token = generateAccessToken(email, [userRole.value]);
        return {token};
    }

    async login(data) {
        const {email, password} = data;
        const user = await User.findOne({email: email});
        if (!user) {
            throw AuthError.BadRequest('Пользователь с таким email не найден');
        }

        const validPassword = bcrypt.compareSync(password, user.password)
        if (!validPassword) {
            throw AuthError.BadRequest('Неверный пароль');
        }

        const token = generateAccessToken(user.email, user.roles)
        return {token};
    }

    async getUsers() {
        const users = await User.find()
        return users;
    }

    async validateToken(token) {
        const result = validateToken(token);
        return {result};
    }
}

module.exports = new authService()