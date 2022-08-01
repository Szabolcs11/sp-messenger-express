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
            console.log(args.input.image)
            const { data } = await axios.post(strapiurl + '/api/messages', {data:{
                "Message": args.input.message,
                "sender": Number(args.input.sender),
                "RoomKey": args.input.roomkey,
                "Image": args.input.image
            }})
            // console.log("Create:")
            // console.log(args.input.roomkey)
            // console.log(data.data)

            // const { imageurl } = await axios.get()

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
            return {id: data.data.id, message: data.data.attributes.Message, date: data.data.attributes.createdAt, imageurl: data.data.attributes.imageurl, sender: {id: Number(args.input.sender), username: args.input.sendername}}
            // console.log(data.data)
            // return data.data;
        },


        setAvatar: async (root, args, context, info) => {
            // const { data } = await axios.post(strapiurl + '/api/auth/local/u')
            console.log(args)
            return "asd"
        }
    },
    Subscription: {
        messagesent: {
            subscribe: async (root, args, context, info) => {
                // console.log("Sub")
                // console.log(args.room_id)
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
            // console.log(data.data[0].attributes)
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

            // console.log(array)
            // console.log(array[1])
            // console.log(data.meta.pagination.total)
            // console.log("---")
            // console.log(data.data[0])
            return array;
            // return [[{id: "a"}], [{id: "a"}]]
        },

        messages: async (root, args, context, info) => {
            // const {data} = await axios.get(strapiurl + '/api/messages?populate=sender&filters[$and][0][sender][id][$eq]=' + args.user_id)
            // console.log(args)
            // /api/messages?populate=Image&populate=sender&filters[$and][0][sender][id][$eq]=
            // const {data} = await axios.get(strapiurl + '/api/messages?populate=sender&filters[$and][0][RoomKey][$eq]=' + args.room_id)
            // const {data} = await axios.get(strapiurl + '/api/messages?populate=Image&populate=sender&filters[$and][0][RoomKey][$eq]=' + args.room_id)
            const {data} = await axios.get(strapiurl + '/api/messages?populate=Image&populate=sender.Avatar&filters[$and][0][RoomKey][$eq]=' + args.room_id)
            // console.log(data)
            let retundata = []
            data.data.forEach(e => {
                let url = undefined
                // console.log(e.attributes.sender.data.attributes.Avatar.data.attributes.url)
                let avaturl = e.attributes.sender.data.attributes.Avatar.data.attributes.url
                // console.log(e.attributes.Image.data[0])

                // if (e.attributes.Image.data) { 
                //     url = e.attributes.Image.data[0].attributes.url
                // }
                
                // if (e.attributes.Image) {
                    // console.log(e.attributes.Image.data[0].attributes.url)
                    // console.log(e.attributes.Image.data[1].attributes.url)
                    // console.log("----------")
                // }
                // console.log(e.attributes.Image.data[0].attributes.url)
                // console.log(e.attributes.Image.data)

                let imageurls = []
                if (e.attributes.Image.data) {
                    if (e.attributes.Image.data.length > 0 ) {
                        for (i=0; i<e.attributes.Image.data.length; i++) {
                            // imageurls[i] = e.attributes.Image.data[i].attributes.url
                            imageurls.push(e.attributes.Image.data[i].attributes.url)
                        }
                        // console.log(imageurls)
                        // console.log("----")
                    }
                }
                retundata.push({id: e.id, message: e.attributes.Message, roomkey: e.attributes.RoomKey, date: e.attributes.createdAt, imageurl: imageurls, sender: {username: e.attributes.sender.data.attributes.username, id: e.attributes.sender.data.id, avatarurl: avaturl}})
                // retundata.push({id: e.id, message: e.attributes.Message, roomkey: e.attributes.RoomKey, date: e.attributes.createdAt, imageurl: url, sender: {username: e.attributes.sender.data.attributes.username, id: e.attributes.sender.data.id}})
                // retundata.push({id: e.id, message: e.attributes.Message, roomkey: e.attributes.RoomKey, date: e.attributes.createdAt, imageurl: e.attributes.Image.data[0].attributes.url, sender: {username: e.attributes.sender.data.attributes.username, id: e.attributes.sender.data.id}})
            });

            // console.log(retundata)
            return retundata
            // return [{id: 1, message: "TEXT", date:"2022-02-22", sender: {username: "asd", id: 1}}]
        },

        getusers: async (root, args, context, info) => {
            const data = await axios.get(strapiurl + "/api/users?populate=Avatar")
            let returndata = []
            data.data.map((d) => {
                // console.log(d)
                if (args.myid != d.id) {
                    returndata.push({id: d.id, username: d.username, avatarurl: d.Avatar.url})
                }
            })
            console.log(returndata)
            return returndata
        },
    }
}