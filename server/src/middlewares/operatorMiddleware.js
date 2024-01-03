module.exports = function (req, res, next) {
    try {
        const enteredRoles = req.body.roles;

        if (enteredRoles.includes("Staff") || enteredRoles.includes("Head Staff")) {
            return res
                .status(403)
                .json({
                    message: 'Forbidden'
                });
        }

        if (enteredRoles.includes('Clerk')) {
            const index = enteredRoles.indexOf('Clerk');
            if (index !== -1) {
                enteredRoles.splice(0, index);
                enteredRoles.splice(1);
            }
        }

        if (enteredRoles.includes('Clerk')) {
            const index = enteredRoles.indexOf('Clerk');
            if (index !== -1) {
                enteredRoles.splice(0, index);
                enteredRoles.splice(1);
            }
        }

        next();
    } catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({
                error: e
            });
    }
};