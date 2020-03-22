START TRANSACTION;

CREATE SCHEMA mc;

CREATE TABLE mc.Users (
    userId INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR NULL,
    token VARCHAR NULL
);

CREATE TABLE mc.itemTypes (
    itemTypeId INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL
);

INSERT INTO mc.ItemTypes (name)
SELECT 'Points Group';

CREATE TABLE mc.itemPermissionTypes (
    itemPermissionTypeId INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    description VARCHAR(100) NOT NULL
);

INSERT INTO mc.itemPermissionTypes (description)
SELECT 'Private' AS description UNION
SELECT 'Public' AS description;

CREATE TABLE mc.items (
    itemId INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    itemTypeId INT NOT NULL REFERENCES mc.itemTypes(itemTypeId),
    itemPermissionTypeId INT NOT NULL REFERENCES mc.itemPermissionTypes(itemPermissionTypeId),
    dateCreated DATE NOT NULL DEFAULT CURRENT_DATE,
    dateDeleted DATE NULL
);

CREATE TABLE mc.userItems (
    userId INT NOT NULL REFERENCES mc.users(userId),
    itemId iNT NOT NULL REFERENCES mc.items(itemId)
);

CREATE TABLE mc.userFavorites (
    userId iNT NOT NULL REFERENCES mc.users(userId),
    itemId INT NOT NULL REFERENCES mc.items(itemId)
);

COMMIT;