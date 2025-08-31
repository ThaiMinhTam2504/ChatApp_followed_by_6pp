export const sampleChats = [
    {
        avatar: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyGo8XzszXwJThST5wxfqGFehUkRrVS6Njdw&s"],
        name: "John Doe",
        _id: "1",
        groupChat: false,
        members: ["1", "2"],
    },
    {
        avatar: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyGo8XzszXwJThST5wxfqGFehUkRrVS6Njdw&s", "https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg", "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg"],
        name: "John Boi",
        _id: "2",
        groupChat: true,
        members: ["1", "2"],
    }
]

export const sampleUsers = [
    {
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyGo8XzszXwJThST5wxfqGFehUkRrVS6Njdw&s",
        name: "John Doe",
        _id: "1"
    },
    {
        avatar: "https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg",
        name: "John Boi",
        _id: "2"
    },
    {
        avatar: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg",
        name: "John Smith",
        _id: "3"
    }
]

export const sampleNotifications = [
    {
        sender: {
            avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyGo8XzszXwJThST5wxfqGFehUkRrVS6Njdw&s',
            name: 'John Doe',
        },
        _id: '1',
    },
    {
        sender: {
            avatar: 'https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg',
            name: 'John Smith',
        },
        _id: '2',
    }
]

export const sampleMessage = [
    {
        attachments: [
            {
                public_id: 'assadas',
                url: 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/hinh-anime-2.jpg'
            }
        ],
        content: 'Hello, this is a sample message.',
        _id: 'sdsadadsa',
        sender: {
            _id: 'user._id',
            name: 'jackie nam',
        },
        chat: 'chatId',
        createdAt: '2024-02-12T10:41:30.630Z'
    },
    {
        attachments: [
            {
                public_id: 'assadas222',
                url: 'https://gamek.mediacdn.vn/133514250583805952/2024/10/2/image-10-1024x576-1727854663787258839106-1727863657755-1727863657841193857596.png'
            }
        ],
        content: 'baby dont hurt me, no more, please',
        _id: 'sdsadadsa1122',
        sender: {
            _id: 'asdasdafff',
            name: 'rick roll',
        },
        chat: 'chatId',
        createdAt: '2024-02-12T10:41:30.630Z'
    },
]