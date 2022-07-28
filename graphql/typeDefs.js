const { gql } = require("apollo-server")

module.exports = gql`

    type User {
        username: String
        id: ID
        avatarurl: String
    }

    type MessageResponse {
        id: ID
        message: String
        date: String
        roomkey: String
        imageurl: [String]
        sender: User
    }

    type Rooms {
        id: String
    }


    input MessageInput {
        message: String
        sender: ID
        sendername: String
        roomkey: String
        image: [ID]
    }

    type Query {

        messages(room_id: ID!): [MessageResponse]

        getrooms(user_id: ID!): [Rooms]

        getusers(myid: ID!): [User]
    }

    type Mutation {
        createMessage(input: MessageInput!): MessageResponse

        setAvatar(imgid: ID!): String
    }


    type Subscription {
        messagesent(room_id: ID!): MessageResponse
    }

`


// Megjelenites DONE 
// Mire kellene atirni az IDt a MessageInput ba.
// Hogy "insertelek" 2 adatot az uzenetekbe, hogy irok be 2 ID-t



// module.exports = gql`

//     type User {
//         username: String
//         id: ID
//     }

//     type MessageResponse {
//         id: ID
//         message: String
//         date: String
//         roomkey: String
//         sender: User 
//     }

//     type Rooms {
//         id: String
//     }


//     input MessageInput {
//         message: String
//         sender: ID
//         sendername: String
//         roomkey: String
//     }

//     type Query {

//         messages(room_id: ID!): [MessageResponse]

//         getrooms(user_id: ID!): [Rooms]
//     }

//     type Mutation {
//         createMessage(input: MessageInput!): MessageResponse
//     }


//     type Subscription {
//         messagesent(room_id: ID!): MessageResponse
//     }

// `




// const { gql } = require("apollo-server")

// module.exports = gql`

//     type User {
//         username: String
//         id: ID
//     }

//     type MessageResponse {
//         id: ID
//         message: String
//         date: String
//         sender: User 
//     }


//     input ExpMessageInput {
//         message: String
//         sender: ID
//     }




//     type Message {
//         text: String
//         createdBy: String
//     }

//     input MessageInput {
//         text: String
//         username: String
//     }

//     type Query {
//         message(id: ID!): Message

//         messages(user_id: ID!): [MessageResponse]
//     }

//     type Mutation {
//         createMessage(messageInput: MessageInput): Message!


//         ExpcreateMessage(input: ExpMessageInput!): MessageResponse
//     }

//     type Subscription {
//         messageCreated: Message
//     }
// `