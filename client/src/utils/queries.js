import { gql } from '@apollo/client';

export const QUERY_ME = gql`
query me {
    me {
        id
        name
        email
        bookCount
        savedBooks
      }
`;

