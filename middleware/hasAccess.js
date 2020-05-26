const ROLES = require('../constants/roles');

module.exports = (roles = []) =>
    function (req, res, next) {
        // Get role
        const { role, currentUserId } = req.body;

        // No role
        if (!!roles && !roles.length && !role) {
            return res.status(400).json({
                msg: 'Ошибка в проверке доступа. Пожалуйста, обратитесь в службу поддержки',
                status: 400,
            });
        }

        // Verify token
        if (roles.includes(role)) {
            if (role !== ROLES.ADMIN) {
                const userId = req.user.id;
                if (userId !== currentUserId) {
                    return res
                        .status(400)
                        .json({ msg: 'У вас нет полномочий для данной операции' });
                }
            }
            next();
        } else {
            return res.status(400).json({ msg: 'У вас нет полномочий для данной операции' });
        }
    };
