const { PubSub } = require("graphql-subscriptions");

const pubsub = new PubSub()


module.exports = ({ req, res }) => {
    return {
        req,
        res,
        pubsub,
    };
};