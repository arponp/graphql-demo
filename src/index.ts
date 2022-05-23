import express from "express";
import { graphqlHTTP } from "express-graphql";
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} from "graphql";
import { authors } from "./authors";
import { books } from "./books";

const app = express();

const AuthorType: GraphQLObjectType = new GraphQLObjectType({
  name: "Author",
  description: "This represents the author of a book",
  fields: () => ({
    id: {
      type: GraphQLNonNull(GraphQLInt),
    },
    name: {
      type: GraphQLNonNull(GraphQLString),
    },
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter((book) => book.authorId == author.id);
      },
    },
  }),
});

const BookType: GraphQLObjectType = new GraphQLObjectType({
  name: "Book",
  description: "This represents a book written by an author",
  fields: () => ({
    id: {
      type: GraphQLNonNull(GraphQLInt),
    },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (book) => {
        return authors.find((author) => author.id == book.authorId);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    book: {
      type: BookType,
      description: "Book",
      args: {
        id: {
          type: GraphQLInt,
        },
      },
      resolve: (parent, args) => books.find((book) => (book.id = args.id)),
    },
    author: {
      type: AuthorType,
      description: "Author",
      args: {
        id: {
          type: GraphQLInt,
        },
      },
      resolve: (parent, args) => authors.find((author) => author.id == args.id),
    },
    books: {
      type: new GraphQLList(BookType),
      description: "List of All Books",
      resolve: () => books,
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of All Authors",
      resolve: () => authors,
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(3000, () => {
  console.log("Server running");
});
