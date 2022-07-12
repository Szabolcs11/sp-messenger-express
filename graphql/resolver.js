const { PubSub } = require("graphql-subscriptions");
const axios = require("axios").default;
const strapiurl = 'http://localhost:1337'

const pubsub = new PubSub();

module.exports = {
    Mutation: {
        // async createMessage(_, {messageInput: { text, username}}) {

        //     pubsub.publish('MESSAGE_CREATED', {
        //         messageCreated: {
        //             text: text,
        //             createdBy: username
        //         }
        //     });

        //     return {
        //         id: 1,
        //         text: text
        //     }
        // },

        createMessage: async (root, args, context, info) => {
            // console.log(args.input.roomkey)
            const { data } = await axios.post(strapiurl + '/api/messages', {data:{
                "Message": args.input.message,
                "sender": Number(args.input.sender),
                "RoomKey": args.input.roomkey
            }})
            console.log("Create:")
            console.log(args.input.roomkey)
            pubsub.publish(args.input.roomkey, {
                messagesent: {
                    id: data.data.id,
                    message: data.data.attributes.Message,
                    date: data.data.attributes.createdAt,
                    roomkey: args.input.roomkey,
                    sender: {
                        id: Number(args.input.sender),
                        username: args.input.sendername
                    }
                }
            })
            return {id: data.data.id, message: data.data.attributes.Message, date: data.data.attributes.createdAt, sender: {id: Number(args.input.sender), username: args.input.sendername}}
            // console.log(data.data)
            // return data.data;
        }
    },
    Subscription: {
        messagesent: {
            subscribe: async (root, args, context, info) => {
                console.log("Sub")
                console.log(args.room_id)
                return pubsub.asyncIterator(args.room_id)
            } 
            // subscribe: () => pubsub.asyncIterator('MESSAGE_CREATED')
        }
    },

    Query: {
        // message: (_, {ID}) => Message.FindById(ID),
        getrooms: async (root, args, context, info) => {
            // console.log(args)
            const {data} = await axios.get(strapiurl + '/api/messages?populate=sender&filters[$and][0][sender][id][$eq]=' + args.user_id)
            // let returnrooms = []
            // data.data.forEach(e => {
            //     returnrooms.push({id: e.attributes.RoomKey})
            // })
            // console.log(returnrooms)
            // return returnrooms
            const array = new Object()
            let i = 0;
            for (i=0; i<data.meta.pagination.total; i++) {
                // console.log(i)
                if (array[data.data[i].attributes.RoomKey]) {

                }
                else {
                    array[data.data[i].attributes.RoomKey] = data.data[i].attributes.RoomKey
                }
            }
            // array[i] = ({ id: data.data[i].attributes.RoomKey})

            console.log(array)
            // console.log(array[1])
            // console.log(data.meta.pagination.total)
            // console.log("---")
            // console.log(data.data[0])
            return array;
        },

        messages: async (root, args, context, info) => {
            // const {data} = await axios.get(strapiurl + '/api/messages?populate=sender&filters[$and][0][sender][id][$eq]=' + args.user_id)
            // console.log(args)
            const {data} = await axios.get(strapiurl + '/api/messages?populate=sender&filters[$and][0][RoomKey][$eq]=' + args.room_id)
            // console.log(data)
            let retundata = []
            data.data.forEach(e => {
                retundata.push({id: e.id, message: e.attributes.Message, roomkey: e.attributes.RoomKey, date: e.attributes.createdAt, sender: {username: e.attributes.sender.data.attributes.username, id: e.attributes.sender.data.id}})
            });

            // console.log(retundata)
            return retundata
            // return [{id: 1, message: "TEXT", date:"2022-02-22", sender: {username: "asd", id: 1}}]
        },
    }
}