// const { ApolloServer } = require('apollo-server')
// const { makeExecutableSchema } = require('@graphql-tools/schema')
// const { applyMiddleware } = require("graphql-middleware");

// // const { createServer } = require('http')
// // const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
// const { WebSocketServer } = require('ws');
// // const { useServer } = require('graphql-ws/lib/use/ws');

// // const { WebSocketLink } = require("@apollo/client/link/ws");


// const { PubSub } = require("graphql-subscriptions")
// const pubsub = new PubSub();



// const axios = require('axios').default;


// const strapiurl = 'http://localhost:1337'

// // type MessageResponse {
// //     id: ID
// //     message: String
// //     sender: User 
// // }


// const typeDefs = `
// type User {
//     username: String
//     id: ID
// }

// type MessageResponse {
//     id: ID
//     message: String
//     date: String
//     sender: User 
// }


// type Query {
//   hello(name: String): String
//   bye(name: String): String

//   messages(user_id: ID!): [MessageResponse]
// }

// input MessageInput {
//     message: String
//     sender: ID
// }

// type Mutation {
//     createMessage(input: MessageInput!): MessageResponse
// }

// type Subscription {
//   messageSent: String
// }

// `

// // messages(user_id: ID!): [MessageResponse]
// // messages(user_username: String!): [MessageResponse]


// // type Subscription {
// //   messageSent: MessageResponse
// // }

// const resolvers = {
//   Query: {
    
//     // hello: (root, args, context, info) => {
//     //   console.log(`3. resolver: hello`)
//     //   return `Hello ${args.name ? args.name : 'world'}!`
//     // },
//     // bye: (root, args, context, info) => {
//     //   console.log(`3. resolver: bye`)
//     //   return `Bye ${args.name ? args.name : 'world'}!`
//     // },

//         messages: async (root, args, context, info) => {
//             // lekerni az adatoka a strapibol 
//             // console.log(args)
//             // const {data} = await axios.get(strapiurl + '/api/messages?populate=sender&filters[sender][$eq]=' + args.user_id)
//             const {data} = await axios.get(strapiurl + '/api/messages?populate=sender&filters[$and][0][sender][id][$eq]=' + args.user_id)
//             let retundata = []
//             data.data.forEach(e => {
//                 retundata.push({id: e.id, message: e.attributes.Message, date: e.attributes.createdAt, sender: {username: e.attributes.sender.data.attributes.username, id: e.attributes.sender.data.id}})
//             });
//             return retundata
//             // return [{id: 1, message: "TEXT", date:"2022-02-22", sender: {username: "asd", id: 1}}]
//         },
//     },

//     Mutation: {
//         createMessage: async (root, args, context, info) => {
//           console.log(args)
//           const { data } = await axios.post(strapiurl + '/api/messages', {data:{
//               "Message": args.input.message,
//               "sender": Number(args.input.sender)
//             }})
//             console.log(data)
//             // console.log(data, args.input)
//             // pubsub.publish("message_sent", {test: "asd"})
//           return data.data;
//         }
//     },
    

// }

// // const wsServer = new WebSocketServer({
// //   // This is the `httpServer` we created in a previous step.
// //   server: httpServer,
// //   // Pass a different path here if your ApolloServer serves at
// //   // a different path.
// //   path: '/graphql',
// // });

// // const wsLink = new WebSocket({
// //   uri: SUBSCRIPTION_URI,
// //   options: {
// //     reconnect: true,
// //     timeout: 20000,
// //     lazy: true,
// //   },
// // });

// // window.addEventListener('beforeunload', () => {
// //   // @ts-ignore - the function is private in typescript
// //   wsLink.subscriptionClient.close();
// // });



// const logInput = async (resolve, root, args, context, info) => {
// //   console.log(`1. logInput: ${JSON.stringify(args)}`)
//   const result = await resolve(root, args, context, info)
// //   console.log(`5. logInput`)
//   return result
// }

// const logResult = async (resolve, root, args, context, info) => {
// //   console.log(`2. logResult`)
//   const result = await resolve(root, args, context, info)
// //   console.log(`4. logResult: ${JSON.stringify(result)}`)
//   return result
// }

// const schema = makeExecutableSchema({ typeDefs, resolvers })

// const schemaWithMiddleware = applyMiddleware(schema, logInput, logResult)


// const server = new ApolloServer({
//   schema: schemaWithMiddleware,
//   context: ({ req, res}) => ({ req, res, pubsub})
  
// })

// server.listen({ port: 8008 })












//// Github
// const { ApolloServer, gql } = require("apollo-server");

// const { PubSub } = require("graphql-subscriptions")
// // const pubsub = new PubSub();

// // type checking
// // query vs. mutation
// // objects
// // arrays
// // arguments

// // crud

// const typeDefs = gql`
//   type Query {
//     hello(name: String): String
//     user: User
//   }
//   type User {
//     id: ID!
//     username: String
//     firstLetterOfUsername: String
//   }
//   type Error {
//     field: String!
//     message: String!
//   }
//   type RegisterResponse {
//     errors: [Error!]!
//     user: User
//   }
//   input UserInfo {
//     username: String!
//     password: String!
//     age: Int
//   }
//   type Mutation {
//     register(userInfo: UserInfo!): RegisterResponse!
//     login(userInfo: UserInfo!): String!
//   }
//   type Subscription {
//     newUser: User!
//   }
// `;

// const NEW_USER = "NEW_USER";

// const resolvers = {
//   Subscription: {
//     newUser: {
//       subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(NEW_USER)
//     }
//   },
//   User: {
//     firstLetterOfUsername: parent => {
//       return parent.username ? parent.username[0] : null;
//     }
//     // username: parent => { return parent.username;
//     // }
//   },
//   Query: {
//     hello: (parent, { name }) => {
//       return `hey ${name}`;
//     },
//     user: () => ({
//       id: 1,
//       username: "tom"
//     })
//   },
//   Mutation: {
//     login: async (parent, { userInfo: { username } }, context) => {
//       // check the password
//       // await checkPassword(password);
//       return username;
//     },
//     register: (_, { userInfo: { username } }, { pubsub }) => {
//       const user = {
//         id: 1,
//         username
//       };

//       pubsub.publish(NEW_USER, {
//         newUser: user
//       });

//       return {
//         errors: [
//           {
//             field: "username",
//             message: "bad"
//           },
//           {
//             field: "username2",
//             message: "bad2"
//           }
//         ],
//         user
//       };
//     }
//   }
// };

// const pubsub = new PubSub();

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context: ({ req, res }) => ({ req, res, pubsub })
// });

// server.listen().then(({ url }) => console.log(`server started at ${url}`));













const express = require("express");
const { createServer } = require("http");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { execute, subscribe } = require("graphql");
const { ApolloServer } = require("apollo-server-express");

const typeDefs = require("./graphql/typeDefs.js");
const resolvers = require("./graphql/resolver.js");



(async function() {
  const app = express();

  const httpServer = createServer(app)

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  });

  const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: '/graphql'}
  )

  const server = new ApolloServer({
    schema,
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            }
          }
        }
      }
    ],
  })

  await server.start();
  server.applyMiddleware({ app });

  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log("Server is now running on port " + PORT);
  })

})();

// (async function() {
//   console.log("hello")
// })();


















// const { GraphQLWsLink } = require('@apollo/client/link/subscriptions');
// const { createClient } = require('graphql-ws');
// const { split, HttpLink } = require('@apollo/client');
// const { getMainDefinition } = require('@apollo/client/utilities');
// const { ApolloClient, InMemoryCache } = require('@apollo/client');

// const httpLink = new HttpLink({
//   uri: 'http://localhost:4000/graphql'
// });

// const wsLink = new GraphQLWsLink(createClient({
//   url: 'ws://localhost:4000/subscriptions',
//   connectionParams: {
//     authToken: user.authToken,
//   },
// }));


// // The split function takes three parameters:
// //
// // * A function that's called for each operation to execute
// // * The Link to use for an operation if the function returns a "truthy" value
// // * The Link to use for an operation if the function returns a "falsy" value
// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition.kind === 'OperationDefinition' &&
//       definition.operation === 'subscription'
//     );
//   },
//   wsLink,
//   httpLink,
// );

// const client = new ApolloClient({
//   link: splitLink,
//   cache: new InMemoryCache()
// });















// const { ApolloServer, gql } = require("apollo-server")
// const context = require("./context")
// const { PubSub } = require("graphql-subscriptions");


// const resolvers = {
//   Query: {

//       messages: async (root, args, context, info) => {
//           // lekerni az adatoka a strapibol 
//           // console.log(args)
//           // const {data} = await axios.get(strapiurl + '/api/messages?populate=sender&filters[sender][$eq]=' + args.user_id)
//           const {data} = await axios.get(strapiurl + '/api/messages?populate=sender&filters[$and][0][sender][id][$eq]=' + args.user_id)
//           let retundata = []
//           data.data.forEach(e => {
//               retundata.push({id: e.id, message: e.attributes.Message, date: e.attributes.createdAt, sender: {username: e.attributes.sender.data.attributes.username, id: e.attributes.sender.data.id}})
//           });

//           return retundata
//           // return [{id: 1, message: "TEXT", date:"2022-02-22", sender: {username: "asd", id: 1}}]
//       },
//     },

//     Mutation: {
//         createMessage: async (root, args, context, info) => {
//           const { data } = await axios.post(strapiurl + '/api/messages', {data:{
//               "Message": args.input.message,
//               "sender": Number(args.input.sender)
//             }})
//             // console.log(data, args.input)
//             // pubsub.publish("message_sent", {test: "asd"})
//           return data.data;
//         }
//     },
//     Subscription: {
//       messageSent: {
//         subscription: () => pubsub.asyncIterator("MESSAGE_SENT")
//         // async subscribe(parent, arguments, { pubsub }) {
//         //   return pubsub.asyncIterator("message_sent")
//         // }
//       }
//     },

// }

// const typeDefs = `
// type User {
//     username: String
//     id: ID
// }

// type MessageResponse {
//     id: ID
//     message: String
//     date: String
//     sender: User 
// }


// type Query {
//   hello(name: String): String
//   bye(name: String): String

//   messages(user_id: ID!): [MessageResponse]
// }

// input MessageInput {
//     message: String
//     sender: ID
// }

// type Mutation {
//     createMessage(input: MessageInput!): MessageResponse
// }

// type Subscription {
//   messageSent: MessageResponse
// }

// `

// const PORT = 8080;

// const server = new ApolloServer({
//   typeDefs: typeDefs,
//   resolvers,
//   context,
// })

// server.listen(PORT)
// console.log(`Server started at http://localhost:` + PORT)

