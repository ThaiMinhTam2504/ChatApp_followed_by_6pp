import { userSocketIDs } from "../app.js"

export const getOtherMember = (members, userId) => {
    return members.find((member) => member._id.toString() !== userId.toString())
}

// export const getSockets = (users = []) => {
//     const sockets = users.map(user => userSocketIDs.get(user._id.toString()))
//     return sockets
// }

export const getSockets = (users = []) => {
    const sockets = users.map(user => {
        if (!user) return undefined;
        // Nếu là object có _id thì lấy _id, nếu là string thì dùng luôn
        const id = typeof user === "object" ? user._id : user;
        // console.log(user)
        return userSocketIDs.get(id?.toString());
    });
    return sockets.filter(Boolean); // loại bỏ undefined
}

export const getBase64 = (file) =>
    `data:${file.mimetype};base64,${file.buffer.toString('base64')}`