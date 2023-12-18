# Two Scene Comparison in Neo4j

## Overview

This previous version of the Neo4j database schema and queries has the objective to compare two different scenes. The schema facilitates the creation and association of various objects within these scenes, along with the implementation of queries to analyze and compare their attributes. This was a previous iteration before re designing the database that is currently implemented

## Usage

To implement this database and execute the queries just install Neo4j and implement the code explained below

## Neo4j Schema

### Scene Creation

Two separate scenes are created, each with its unique set of objects like tables, chairs, plates, and flowers. Each object is defined with specific attributes such as center coordinates, color, labels, and bounding boxes.

- **Scene 1** is defined with attributes and associated RGB images.
```cypher
// Creating Scene 1 with its attributes and associated RGB images
CREATE (s1:Scene {id: "1", timestamp: datetime(), rgbImages: ["rgb1a.png", "rgb1b.png", "rgb1c.png"]})
```

- **Scene 2** mirrors Scene 1 but includes variations in object positions and attributes.
```cypher
// Creating Scene 2 with its attributes and associated RGB images
CREATE (s2:Scene {id: "2", timestamp: datetime(), rgbImages: ["rgb2a.png", "rgb2b.png", "rgb2c.png"]})
```


### Object Creation, Association and Spatial Relationships

Each scene includes a variety of objects:

- **Tables, Chairs, Plates, and Flowers** are created with unique identifiers, center points, colors, and bounding boxes.
- These objects are then associated with their respective scenes using the `INCLUDES` relationship.
- Spatial relationships between specific pairs of objects are defined using Euclidean distances.
```cypher
// Creating objects with center coordinates, color, specific labels, and bounding boxes
CREATE (t1:Table {id: "table1", center: point({x: 1, y: 2, z: 0}), color: "brown", 
                  bboxMin: point({x: 0, y: 1, z: 0}), bboxMax: point({x: 2, y: 3, z: 1})})
CREATE (t2:Table {id: "table2", center: point({x: 5, y: 2, z: 0}), color: "black", 
                  bboxMin: point({x: 4, y: 1, z: 0}), bboxMax: point({x: 6, y: 3, z: 1})})
CREATE (c1:Chair {id: "chair1", center: point({x: 3, y: 4, z: 0}), color: "red", 
                  bboxMin: point({x: 2, y: 3, z: 0}), bboxMax: point({x: 4, y: 5, z: 1})})
CREATE (p1:Plate {id: "plate1", center: point({x: 1, y: 2, z: 1}), color: "white", 
                  bboxMin: point({x: 0.5, y: 1.5, z: 1}), bboxMax: point({x: 1.5, y: 2.5, z: 2})})
CREATE (p2:Plate {id: "plate2", center: point({x: 1, y: 3, z: 1}), color: "white", 
                  bboxMin: point({x: 0.5, y: 2.5, z: 1}), bboxMax: point({x: 1.5, y: 3.5, z: 2})})
CREATE (p3:Plate {id: "plate3", center: point({x: 1, y: 4, z: 1}), color: "white", 
                  bboxMin: point({x: 0.5, y: 3.5, z: 1}), bboxMax: point({x: 1.5, y: 4.5, z: 2})})
CREATE (f1:Flower {id: "flower1", center: point({x: 5, y: 2, z: 1}), color: "red", 
                  bboxMin: point({x: 4.5, y: 1.5, z: 1}), bboxMax: point({x: 5.5, y: 2.5, z: 2})})


// Associating objects with Scene 1
CREATE (s1)-[:INCLUDES]->(t1), (s1)-[:INCLUDES]->(t2), (s1)-[:INCLUDES]->(c1), 
       (s1)-[:INCLUDES]->(p1), (s1)-[:INCLUDES]->(p2), (s1)-[:INCLUDES]->(p3), 
       (s1)-[:INCLUDES]->(f1)

// Defining spatial relationships between specific pairs of objects using Euclidean distances
CREATE (t1)-[:DISTANCE {meters: point.distance(t1.center, c1.center)}]->(c1),
       (p1)-[:DISTANCE {meters: point.distance(p1.center, f1.center)}]->(f1)


// Creating Scene 2 with its attributes and associated RGB images
CREATE (s2:Scene {id: "2", timestamp: datetime(), rgbImages: ["rgb2a.png", "rgb2b.png", "rgb2c.png"]})

// Creating objects with center coordinates, color, specific labels, and bounding boxes
CREATE (t3:Table {id: "table3", center: point({x: 1, y: 2, z: 0}), color: "brown", 
                  bboxMin: point({x: 0, y: 1, z: 0}), bboxMax: point({x: 2, y: 3, z: 1})})
CREATE (t4:Table {id: "table4", center: point({x: 5, y: 3, z: 0}), color: "black", 
                  bboxMin: point({x: 4, y: 2, z: 0}), bboxMax: point({x: 6, y: 4, z: 1})})
CREATE (c2:Chair {id: "chair2", center: point({x: 3, y: 5, z: 0}), color: "red", 
                  bboxMin: point({x: 2, y: 4, z: 0}), bboxMax: point({x: 4, y: 6, z: 1})})
CREATE (p4:Plate {id: "plate1", center: point({x: 2, y: 2, z: 1}), color: "white", 
                  bboxMin: point({x: 1.5, y: 1.5, z: 1}), bboxMax: point({x: 2.5, y: 2.5, z: 2})}) 
CREATE (p5:Plate {id: "plate2", center: point({x: 2, y: 4, z: 2}), color: "white", 
                  bboxMin: point({x: 1.5, y: 3.5, z: 2}), bboxMax: point({x: 2.5, y: 4.5, z: 3})}) 
CREATE (p6:Plate {id: "plate3", center: point({x: 1, y: 4, z: 3}), color: "white", 
                  bboxMin: point({x: 0.5, y: 3.5, z: 3}), bboxMax: point({x: 1.5, y: 4.5, z: 4})})
CREATE (f2:Flower {id: "flower1", center: point({x: 5, y: 3, z: 1}), color: "yellow", 
                  bboxMin: point({x: 4.5, y: 2.5, z: 1}), bboxMax: point({x: 5.5, y: 3.5, z: 2})})

// Associating objects with Scene 2 and defining spatial relationships
CREATE (s2)-[:INCLUDES]->(t3), (s2)-[:INCLUDES]->(t4), (s2)-[:INCLUDES]->(c2), 
       (s2)-[:INCLUDES]->(p4), (s2)-[:INCLUDES]->(p5), (s2)-[:INCLUDES]->(p6), 
       (s2)-[:INCLUDES]->(f2)

// Defining spatial relationships between specific pairs of objects using Euclidean distances       
CREATE (t3)-[:DISTANCE {meters: point.distance(t3.center, c2.center)}]->(c2),
       (p4)-[:DISTANCE {meters: point.distance(p4.center, f2.center)}]->(f2)

```


## Queries

### Query 1: Scene Comparison

This query compares objects between Scene 1 and Scene 2, identifying objects with the same ID but different center positions. It returns the object's ID, type, and center coordinates in both scenes.

```cypher
MATCH (s1:Scene {id: "1"})-[:INCLUDES]->(o1),
      (s2:Scene {id: "2"})-[:INCLUDES]->(o2)
WHERE o1.id = o2.id AND o1.center <> o2.center
RETURN o1.id AS ObjectID, o1.center AS Scene1Center, o2.center AS Scene2Center, labels(o1)[0] AS Type
```

### Query 2: Object Retrieval

This query focuses on retrieving all objects and their metadata from a specified scene (Scene 1 in this case). It returns each object's ID, center, color, and type.

```cypher
MATCH (s:Scene {id: "1"})-[:INCLUDES]->(o)
RETURN o.id AS ObjectID, o.center AS Center, o.color AS Color, labels(o)[0] AS Type
```

### Query 3: Object Location

This query is designed to locate a specific object or all objects of a given type in Scene 1. It returns the object's ID, center, color, and type.

```cypher
MATCH (s:Scene {id: "1"})-[:INCLUDES]->(o:Table)
RETURN o.id AS ObjectID, o.center AS Center, o.color AS Color, labels(o)[0] AS Type
```

