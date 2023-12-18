# 3D SceneGraph-API
This project integrates a Neo4j database with a GraphQL API via Apollo Server for advanced 3D scene analysis. It allows querying and manipulating scene data, focusing on computing and retrieving objects based on a viewer's perspective and field of view in 3D environments

## Overview

This project integrates a Neo4j database with a GraphQL API via Apollo Server to facilitate the querying and manipulation of 3D scene data. The primary feature is the computation and retrieval of objects within a viewer's perspective in a 3D environment, taking into account their viewpoint and field of vision. This capability is crucial for applications in urban development, environmental monitoring, and virtual navigation.

## Neo4j Schema and Data

### Schema
- **Scene**: Represents a 3D environment containing multiple objects such as lamps, chairs, and tables.
- **Lamp/Chair/Table**: These entities are various objects within the scene, each defined by a unique ID, a central point in 3D space, a color, and a bounding box.
- **BoundingBox**: A spatial construct that defines the limits of an object, enabling efficient spatial queries and analysis.

### Example Data Creation
The following Cypher commands are used to create a scene with a lamp, chair, and table. The way to implement this schema along with the queries that can be implemented in Neo4j are explained in the folder Neo4j Database Implementation. This Schema needs to be implemented in order to the project to be run:

```cypher
CREATE (s1:Scene {id: "1", timestamp: datetime(), rgbImages: ["lamp1.png", "chair1.png", "table1.png"]})
CREATE (l1:Lamp {id: "lamp1", center: point({x: 2, y: 2, z: 0}), color: "gold", bboxMin: point({x: 1.5, y: 1.5, z: 0}), bboxMax: point({x: 2.5, y: 2.5, z: 2})})
CREATE (c1:Chair {id: "chair1", center: point({x: 4, y: 2, z: 0}), color: "blue", bboxMin: point({x: 3.5, y: 1.5, z: 0}), bboxMax: point({x: 4.5, y: 2.5, z: 1.5})})
CREATE (t1:Table {id: "table1", center: point({x: 6, y: 2, z: 0}), color: "brown", bboxMin: point({x: 5, y: 1, z: 0}), bboxMax: point({x: 7, y: 3, z: 1})})
CREATE (s1)-[:INCLUDES]->(l1), (s1)-[:INCLUDES]->(c1), (s1)-[:INCLUDES]->(t1)
```

## GraphQL Schema
The GraphQL schema provides a structured format to query and manipulate scene data. It defines types corresponding to the Neo4j schema, such as Scene, Lamp, Chair, Table, and VisibleObject, and enables queries for scenes and objects based on spatial parameters.

## Apollo Server (index.js)
The Apollo Server acts as an intermediary between the Neo4j database and clients, processing GraphQL queries.

### Key Features:
- **visibleObjects Query**: Computes objects within the viewer's field of view, considering the viewer's position and direction.
- **Neo4j Integration**: Interfaces with the Neo4j database, executing Cypher queries to fetch or manipulate data as requested.
- **GraphQL API**: Provides an endpoint for clients to perform GraphQL queries on the scene data.

## Usage 

The following are the steps required for using this code

### Prerequisites

1. **Install Node.js**: Ensure that [Node.js](https://nodejs.org/en/) is installed on your machine.
2. **Install Neo4j**: Make sure [Neo4j](https://neo4j.com/download/) is installed and running on your local machine or accessible through a network connection.
3. **Neo4j Database Credentials and Implementation**: Have the credentials for your Neo4j database ready, as you will need them to configure the connection in your Apollo Server. Likewise, you should have created a project already and also have implemented the Schema presented before. This database should be running in your pc before running the project.

### Steps to Run the Server:

1.  **Create the Project Folder and Initialize Node.js Project**:
	- Create the respective project folder and put the GraphQL schema (`schema.graphql`) and JS (`index.js`) files available in this repository
	- Run `npm init -y` to create a new `package.json` file with default settings.
	- Open your `package.json` file and add the following line
		```
		"type": "module",
		```

2. **Install Dependencies**:
	- Install the necessary Node.js packages by running:
		```
		npm install apollo-server neo4j-driver graphql fs neo4j-graphql-js
		```
3. **Configure the Neo4j Connection**
    - In `index.js`, replace `'neo4j'` and `'password'` with your actual Neo4j username and password.

4. **Start the Server**:
	- In the terminal, run the command `node index.js` to start the Apollo Server.
    - If everything is configured correctly, you should see a message indicating that the server is running, along with the URL of the GraphQL playground (usually `http://localhost:4000`).

5. **Access Apollo Server**:
    - Open a web browser and navigate to the URL provided in the terminal output. This will open the GraphQL playground, where you can interact with your GraphQL API.

6. **Run Queries**:
    - In the GraphQL playground, you can write and execute queries, mutations, and subscriptions as defined in your `schema.graphql`.
    - To test fetching visible objects, you can use the example query provided in the Example Query section above and execute it in the playground.

	### Example Query

	To fetch visible objects using the GraphQL interface:

	```graphql
	query {
	visibleObjects(
		viewerPosition: { x: 2, y: 2, z: 2 },
		viewerDirection: { x: 1, y: 0, z: 0 },
		fieldOfViewAngle: 90
	) {
		id
		translatedPosition {
		x
		y
		z
		}
		angleFromViewer
		distanceFromViewer
	}
	}
	```
	This query retrieves objects that are visible from a viewer positioned at (2, 2, 2) looking in the direction (1, 0, 0) with a 90-degree field of view.
