import { ApolloServer } from 'apollo-server';
import fs from 'fs';
import { makeAugmentedSchema } from 'neo4j-graphql-js';
import neo4j from 'neo4j-driver';

// we load the GraphQL schema
const typeDefs = fs.readFileSync('schema.graphql', 'utf-8');

// we define custom resolvers
const resolvers = {
  Query: {
    // implement the visibleObjects query
    visibleObjects: async (_, args, context) => {
      // we select the arguments provided in the query 
      const { viewerPosition, viewerDirection, fieldOfViewAngle } = args;

      // starting a new session with the Neo4j database
      const session = context.driver.session();
    
      try {
        // now we run the Cypher query to find visible objects based on viewer's position and field of view
        const result = await session.run(
          // we put the query implemented already in Neo4j
          `WITH point($viewerPosition) AS viewerPosition,  
                point($viewerDirection) AS viewDirection,   
                radians($fieldOfViewAngle) AS fieldOfView
           MATCH (o)
           WITH o, viewerPosition, viewDirection, fieldOfView,
                point({x: o.center.x - viewerPosition.x, y: o.center.y - viewerPosition.y, z: o.center.z - viewerPosition.z}) AS translatedPosition
           WITH o, viewerPosition, viewDirection, fieldOfView, translatedPosition,
                point.distance(point({x: 0, y: 0, z: 0}), translatedPosition) AS objectDistance,
                acos(
                    (viewDirection.x * translatedPosition.x +
                     viewDirection.y * translatedPosition.y +
                     viewDirection.z * translatedPosition.z) / 
                     (sqrt(viewDirection.x^2 + viewDirection.y^2 + viewDirection.z^2) * 
                      sqrt(translatedPosition.x^2 + translatedPosition.y^2 + translatedPosition.z^2))
                ) AS angleBetween
           WHERE angleBetween <= fieldOfView / 2

           RETURN o.id AS id, translatedPosition, round(angleBetween * 180 / 3.14159 * 100) / 100 AS angleFromViewer, round(objectDistance * 100) / 100 AS distanceFromViewer`,
          {
            viewerPosition,
            viewerDirection,
            fieldOfViewAngle
          }
        );
    
        // we process the results and format them according to the GraphQL schema
        return result.records.map(record => {
          const translatedPositionObj = record.get('translatedPosition');
          return {
            id: record.get('id'),
            translatedPosition: {
              x: translatedPositionObj.x,
              y: translatedPositionObj.y,
              z: translatedPositionObj.z
            },
            angleFromViewer: record.get('angleFromViewer') ,
            distanceFromViewer: record.get('distanceFromViewer'),
          };
        });
      } finally {
        // we close the session
        await session.close();
      }
    }
  }
};

// we create the augmented schema with custom resolvers
const schema = makeAugmentedSchema({ typeDefs, resolvers });

// we create a Neo4j driver instance
const driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'password') // Replace with your credentials
);

// we verify the Neo4j connectivity
driver.verifyConnectivity()
  .then(() => console.log('Successfully connected to Neo4j'))
  .catch(error => console.error('Could not connect to Neo4j', error));

// we setup Apollo Server setup with a context function
const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    return {
      driver
    };
  }
});

// we start the Apollo Server
server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
