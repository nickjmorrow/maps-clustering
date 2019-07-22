CREATE SCHEMA mapClustering;

CREATE TABLE mapClustering.Users (
    userId INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(MAX) NULL,
    token VARCHAR(MAX) NULL
)

CREATE TABLE mapClustering.itemTypes (
    itemTypeId INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL
)

INSERT INTO mapClustering.ItemTypes (name)
SELECT 'Points Group'

CREATE TABLE mapClustering.itemPermissionTypes (
    itemPermissionTypeId INT NOT NULL IDENTITY(1, 1) PRIMARY KEY,
    description VARCHAR(100) NOT NULL
)

INSERT INTO mapClustering.itemPermissionTypes
SELECT 'Private' AS description UNION
SELECT 'Public' AS description

CREATE TABLE mapClustering.items (
    itemId INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    itemTypeId INT NOT NULL FOREIGN KEY REFERENCES mapClustering.itemTypes(itemTypeId),
    itemPermissionTypeId INT NOT NULL FOREIGN KEY REFERENCES mapClustering.itemPermissionTypes(itemPermissionTypeId),
    dateCreated DATETIME NOT NULL DEFAULT GETDATE(),
    dateDeleted DATETIME NULL
)

CREATE TABLE mapClustering.userItems (
    userId INT NOT NULL FOREIGN KEY REFERENCES mapClustering.users(userId),
    itemId iNT NOT NULL FOREIGN KEY REFERENCES mapClustering.items(itemId)
)

CREATE TABLE mapClustering.userFavorites (
    userId iNT NOT NULL FOREIGN KEY REFERENCES mapClustering.users(userId),
    itemId INT NOT NULL FOREIGN KEY REFERENCES mapClustering.items(itemId)
)



