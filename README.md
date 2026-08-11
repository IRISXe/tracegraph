# TraceGraph — Production Dependency & Incident Intelligence

TraceGraph is a graph-backed production intelligence application for
exploring software dependencies, identifying service ownership,
understanding incident impact, and calculating failure blast radius.

## Live Demo

Frontend:
https://tracegraph-sandy.vercel.app

API:
https://tracegraph-api-u6ul.onrender.com

Health:
https://tracegraph-api-u6ul.onrender.com/health

Readiness:
https://tracegraph-api-u6ul.onrender.com/ready

## Problem

Modern production systems are networks of applications, services,
databases, third-party APIs, teams, and incidents.

TraceGraph helps answer:

- What does this service depend on?
- What depends on this service?
- If this service fails, what else is affected?
- Which team owns it?
- What caused an incident?
- How many hops away are affected applications?

## Why a Graph Database?

The problem is relationship-heavy.

A relational implementation would require join tables and recursive CTEs
or repeated self-joins for dependency traversal.

A graph database lets us express these questions directly using paths.

Example:

```cypher
MATCH path =
  (dependent)
  -[:DEPENDS_ON*1..4]->
  (target:Service {id: $serviceId})

WHERE dependent:Service
   OR dependent:Application

WITH dependent, min(length(path)) AS depth

RETURN dependent, labels(dependent), depth
ORDER BY depth, dependent.name