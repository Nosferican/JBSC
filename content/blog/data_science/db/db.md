---
title: Databases
linktitle: Databases
toc: true
type: docs
draft: false
date: "2019-10-01"
lastmod: "2021-05-04"
menu:
  data_science:
    weight: 3

# Prev/next pager order (if `docs_section_pager` enabled in `params.toml`)
# weight: 3

---

# Relational

A Relational Database Management System (RDBMS) is software that implements a digital database based on the relational model of data, as proposed by Codd ([1970](https://doi.org/10.1145/362384.362685)). This system allows for efficient storage and operations on tabular data and commonly implements the Structured Query Language (SQL). Other alternatives for storing and managing tabular data includes flat-files (i.e., text files), data formats such as JavaScript Object Notation (JSON), and binary files such as Hierarchical Data Format (e.g., HDF5). For non tabular data other alternatives such as NoSQL approaches are better suited.

[{{< figure src="icons/brands/postgres.svg" alt="Postgresql elephant: Slonik" width="400em">}}](https://www.postgresql.org)

For most cases, PostgreSQL is one of the best solutions and provides a very robust set of functionality. The easiest way to get started is through the desktop [app](https://postgresapp.com) or through a Docker image (e.g., [postgis/postgis:12-3.1-alpine](https://registry.hub.docker.com/r/postgis/postgis)).

[{{< figure src="icons/brands/postgis.svg" alt="Postgis Logo" caption="postGIS brings GIS to PostgreSQL" width="200em" copyright="Under Fair Use from Refractions Research - Artist: Lana Lounsbury for PostGIS" >}}](https://www.postgresql.org)

[{{< figure src="icons/brands/pg.svg" alt="pgAdmin 4" width="200em" >}}](https://www.pgadmin.org)

pgAdmin 4 is a great GUI interface for interacting with PostgreSQL servers.

# Document-based

[{{< figure src="icons/brands/mongo_light.svg" class="mongo_light" >}}](https://www.mongodb.com)
[{{< figure src="icons/brands/mongo_dark.svg" class="mongo_dark" >}}](https://www.mongodb.com)

MongoDB is a general purpose, document-based, distributed database built for modern application developers and for the cloud era. You can obtain an image from Docker (e.g., [mongo:4.4.5](https://hub.docker.com/_/mongo)). You can use MongoDB [Compass](https://www.mongodb.com/try/download/compass) as a GUI for interacting with MongoDB databases.

# Graph-based

<!-- [{{< figure src="icons/brands/Neo4j_dark.svg" class="neo4j_light" >}}](https://neo4j.com)
[{{< figure src="icons/brands/Neo4j_dark_.svg" class="neo4j_dark" >}}](https://neo4j.com) -->

[{{< figure src="icons/brands/Neo4j_light.svg" class="neo4j_light" >}}](https://neo4j.com)
[{{< figure src="icons/brands/Neo4j_dark.svg" class="neo4j_dark" >}}](https://neo4j.com)

Neo4j is a native graph database well-suited for connected data (i.e., leverage relationships). You can access the solution through a Docker image (e.g., [neo4j:4.2.5](https://hub.docker.com/_/neo4j)). A GUI client is available through the Neo4j [Desktop](https://neo4j.com/download-center) application.
