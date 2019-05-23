# Hierarchical Clustering of Google Maps Locations

The demo can be found [here](http://nickjmorrow.github.io/maps-clustering).

## At a Glance

This is a .NET Core application to take in .kml file, convert it into a list of clustered locations, persist that information in a SQL Server database, and send the information to the React (TypeScript) front-end for display.

## What Is It For

-   When I moved to New York in 2018, I had a long list of places to visit. I thought it could be fun to try clustering them together to "maximize the number of places I could visit in a weekend." I ended up spending more time working on this app than visiting places when I got here, but it's still been fun to make!

## Technical Stack: .NET Core / C#, React, SQL Server

-   The **front-end** is built using React with heavy reliance on a [personal component library](https://github.com/nickjmorrow/react-component-library).
-   For **state management**, I'm using Redux. This isn't very necessary because I don't need to perform any complex mutations of the data, but it has been nice for debugging and having a clearer idea of data flow throughout the front-end.
-   For the **back-end**, I'm using a .NET Core Web API deployed to Heroku using Docker. I opted for C# just to build familiarity, but there are no major constraints that would make this language better than others.
-   For the **database**, I'm using SQL Server. The data isn't heavily relational, but I've found it easier to integrate new features to apps using a relational data model, and I originally thought it could be cool to think about user permissioning.

## Callouts

### Computation and Performance

-   The locations are clustered only once, and then sent in a form to the FE that allows the user to change certain inputs while not kicking off new expensive calculations. I like how this makes the UI a bit more zippy and exploratory.

## What could be added to it

-   It would be nice to have a better fallback UI for when locations haven't been loaded.
-   Optimal path finding could be cool, to know what order to visit the locations within a cluster.

## What are the expectations of it

I fully intend for this to just be a hobby project that I check up on now and then.

## How to run it

For the front-end:

```
npm run start
```

For the back-end:

```
dotnet run
```

Note that I use environment variables in [Rider](https://www.jetbrains.com/rider/) for the connection string to the database - that should be swapped out with information to your own database.
