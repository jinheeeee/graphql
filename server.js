import { ApolloServer, gql } from "apollo-server";

let tweets = [
  {
    id: "1",
    text: "first one",
  },
  {
    id: "2",
    text: "second one",
  },
];

let users = [
  {
    id: "1",
    firstName: "lee",
    lastName: "jinhee",
  },
  {
    id: "2",
    firstName: "park",
    lastName: "suman",
  },
];

// gql``는 graphql의 schema definition language
const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String!
    test: String!
  }

  type Tweet {
    id: ID
    text: String
    author: User
  }

  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }

  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`;
//  user가 보낸 data로 mutate하는 동작들을 모두 넣음

// postTweet을 호출할 때 text와 userId를 보내야 한다는 뜻
// mutation은 그냥 url에 POST request를 쓸 수 있도록 해주는거야.

// * !(느낌표)를 쓰지 않는다면 기본적으로 nullable filed가 됨.
// tweet(id: ID) -> id나 null이 들어갈 수 있음
// tweet(id: ID!) -> 절대로 null을 return하지 않음 (이거에 대해서 확신한다면 느낌표 사용)

// type Query -> get방식 db를 건드리지 않음
// type Mutation -> post방식 db를 수정함

//[Tweet!]! -> 항상 list가 되어야하고 list는 항상 Tweet임

const resolvers = {
  // 그저 data를 fetching하는거라면 Query에 써줘.
  Query: {
    allTweets() {
      return tweets;
    },
    // 첫번째 인자는 root 인자임. 그래서 보통 _ (무시)로 많이들 씀
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
    allUsers() {
      // fullName이 없다는 걸 인지
      return users;
    },
  },
  // 만약 database를 mutate한다면 Mutation에 써줘야함.
  Mutation: {
    postTweet(_, { text, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        text,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      console.log(tweet);
      if (!tweet) return false;

      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
  User: {
    // fullName의 resolver function이 호출되어 result data를 만들어 냄
    fullName({ firstName, lastName }) {
      return `${firstName} ${lastName}`;
    },
    // typeDefs > User 안에 키값과 동일하게 만들어주면 자동으로 호출을 해주나보다..
    test() {
      return 'rrrrrrrrr'
    }
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {});
