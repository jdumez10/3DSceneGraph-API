The following provides a detailed guide on implementing a Neo4j database schema for 3D scene analysis and a specialized query for retrieving objects within a viewer's field of view. The schema and query are designed for applications like urban planning, virtual reality, and environmental monitoring, where understanding spatial relationships in 3D scenes is crucial.

## Neo4j Schema Description

The schema consists of various objects in a 3D scene, including lamps, chairs, and tables, each with unique properties like position, color, and bounding box. Relationships between these objects and the scene are also defined.

### Entities:

- **Scene**: Represents the whole 3D scene.
- **Lamp/Chair/Table**: Individual objects within the scene. Each object has an ID, center coordinates, a color, and bounding box coordinates.

### Relationships:

- **INCLUDES**: A relationship type linking the Scene with each object it contains.

## Step-by-Step Implementation

### Prerequisites

Make sure [Neo4j](https://neo4j.com/download/) is installed and running on your local machine 

### Creating the Schema

1. **Launch Neo4j**: Open the Neo4j Desktop application and start your database.
2. **Open Neo4j Browser**: Click on 'Open Browser' in the Neo4j Desktop application.
3. **Create Schema**:
    - In the Neo4j Browser, execute the following Cypher commands to create your scene and objects:

      ```cypher
      CREATE (s1:Scene {id: "1", timestamp: datetime(), rgbImages: ["lamp1.png", "chair1.png", "table1.png"]})
      CREATE (l1:Lamp {id: "lamp1", center: point({x: 2, y: 2, z: 0}), color: "gold", bboxMin: point({x: 1.5, y: 1.5, z: 0}), bboxMax: point({x: 2.5, y: 2.5, z: 2})})
      CREATE (c1:Chair {id: "chair1", center: point({x: 4, y: 2, z: 0}), color: "blue", bboxMin: point({x: 3.5, y: 1.5, z: 0}), bboxMax: point({x: 4.5, y: 2.5, z: 1.5})})
      CREATE (t1:Table {id: "table1", center: point({x: 6, y: 2, z: 0}), color: "brown", bboxMin: point({x: 5, y: 1, z: 0}), bboxMax: point({x: 7, y: 3, z: 1})})
      CREATE (s1)-[:INCLUDES]->(l1), (s1)-[:INCLUDES]->(c1), (s1)-[:INCLUDES]->(t1)
      ```

	#### Verify Creation

	After executing the commands, verify the creation of the scene and objects by running a simple query like:

	```cypher
	MATCH (n) RETURN n
	```

### Scene Analysis Query

This query is designed to calculate and return objects within a viewer's specified field of view, considering their position and orientation in a scene. It is particularly useful for applications that require spatial analysis in 3D environments, such as virtual reality, urban planning, or environmental monitoring.

```cypher
// Define the viewer's position and viewing direction, along with the field of view angle
WITH point({x: 2, y: 2, z: 2}) AS viewerPosition,  
     point({x: 1, y: 0, z: 0}) AS viewDirection,   
     radians(90) AS fieldOfView

// Match all objects in the scene
MATCH (o)

// Translate objects relative to the viewer's position
WITH o, viewerPosition, viewDirection, fieldOfView,
     point({x: o.center.x - viewerPosition.x, y: o.center.y - viewerPosition.y, z: o.center.z - viewerPosition.z}) AS translatedPosition

// Calculate distance and angle for each object relative to the viewer
WITH o, viewerPosition, viewDirection, fieldOfView, translatedPosition,
     point.distance(point({x: 0, y: 0, z: 0}), translatedPosition) AS objectDistance,
     acos(
         (viewDirection.x * translatedPosition.x +
          viewDirection.y * translatedPosition.y +
          viewDirection.z * translatedPosition.z) / 
          (sqrt(viewDirection.x^2 + viewDirection.y^2 + viewDirection.z^2) * 
           sqrt(translatedPosition.x^2 + translatedPosition.y^2 + translatedPosition.z^2))
     ) AS angleBetween

// Filter objects that are within the field of view
WHERE angleBetween <= fieldOfView / 2

// Return the objects that meet the criteria along with their relative positions, angle, and distance
RETURN o AS object, 
       translatedPosition AS relativePosition, 
       round(angleBetween * 180 / 3.14159 * 100) / 100 AS angleFromViewer, 
       round(objectDistance * 100) / 100 AS distanceFromViewer
```

#### Understanding the Query

- **Setting Viewer's Perspective**:
  - The query initializes by defining the viewer's position and viewing direction. This setup is crucial for determining the spatial context of the scene relative to the viewer.

- **Matching Objects**:
  - It matches all objects in the scene, computing their positions relative to the viewer. This step is essential to identify which objects fall within the viewer's field of view.

- **Calculating Distance and Angle**:
  - For each object, the query calculates the distance from the viewer and the angle between the viewer's direction and the object. These calculations help in determining whether an object is within the viewer's field of view.

- **Filtering Visible Objects**:
  - The query filters out objects that are not within the specified field of view angle. This ensures that only relevant objects are considered for further analysis.

- **Returning Results**:
  - The final output includes each object's ID, its relative position to the viewer, the angle from the viewer, and the distance from the viewer. 
  - For clarity and precision, angles and distances are rounded to two decimal places.
