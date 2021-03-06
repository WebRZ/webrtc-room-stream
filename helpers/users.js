const users = [];

const userJoin = (userId, room) => {
    const user = { id: userId, room };
    if (users.some(user => user.id === userId)) {
        return user;
    }
    users.push(user);

    return user;
};

const getCurrentUserById = id => {
    return users.find(user => user.id === id);
};

const userLeave = id => {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

const getRoomUsers = room => {
    return users.filter(user => user.room === room);
};

module.exports = {
    userJoin,
    getCurrentUserById,
    userLeave,
    getRoomUsers,
};
