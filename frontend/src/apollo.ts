import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";

export const isLoggedInVar = makeVar(false);

export const client = new ApolloClient({
    uri: "http://localhost:4000/graphql",
    cache: new InMemoryCache({
        typePolicies:{
            Query:{
                fields:{
                    isLoggedIn:{
                        read(){
                            return isLoggedInVar();
                        }
                    }
                }
            }
        }
    }
    ),
})