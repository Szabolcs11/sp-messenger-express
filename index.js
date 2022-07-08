const { ApolloServer } = require('apollo-server')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { applyMiddleware } = require("graphql-middleware");

const axios = require('axios').default;


const strapiurl = 'http://localhost:1337'

// type MessageResponse {
//     id: ID
//     message: String
//     sender: User 
// }


const typeDefs = `
type User {
    username: String
    id: ID
}

type MessageResponse {
    id: ID
    message: String
    date: String
    sender: User 
}


type Query {
  hello(name: String): String
  bye(name: String): String

  messages: [MessageResponse]
}

input MessageInput {
    message: String
    sender: ID
}

type Mutation {
    createMessage(input: MessageInput!): MessageResponse
}
`
const resolvers = {
  Query: {
    
    // hello: (root, args, context, info) => {
    //   console.log(`3. resolver: hello`)
    //   return `Hello ${args.name ? args.name : 'world'}!`
    // },
    // bye: (root, args, context, info) => {
    //   console.log(`3. resolver: bye`)
    //   return `Bye ${args.name ? args.name : 'world'}!`
    // },

        messages: async (root, args, context, info) => {
            // lekerni az adatoka a strapibol 
            const {data} = await axios.get(strapiurl + '/api/messages?populate=sender')
            let retundata = []
            data.data.forEach(e => {
                retundata.push({id: e.id, message: e.attributes.Message, date: e.attributes.createdAt, sender: {username: e.attributes.sender.data.attributes.username, id: e.attributes.sender.data.id}})
            });

            return retundata
        },
    },

    Mutation: {
        createMessage: async (root, args, context, info) => {
          const { data } = await axios.post(strapiurl + '/api/messages', {data:{
              "Message": args.input.message,
              "sender": Number(args.input.sender)
            }})
            console.log(data, args.input)
          return data.data;
        }
    },

}

const logInput = async (resolve, root, args, context, info) => {
//   console.log(`1. logInput: ${JSON.stringify(args)}`)
  const result = await resolve(root, args, context, info)
//   console.log(`5. logInput`)
  return result
}

const logResult = async (resolve, root, args, context, info) => {
//   console.log(`2. logResult`)
  const result = await resolve(root, args, context, info)
//   console.log(`4. logResult: ${JSON.stringify(result)}`)
  return result
}

const schema = makeExecutableSchema({ typeDefs, resolvers })

const schemaWithMiddleware = applyMiddleware(schema, logInput, logResult)

const server = new ApolloServer({
  schema: schemaWithMiddleware,
})

server.listen({ port: 8008 })