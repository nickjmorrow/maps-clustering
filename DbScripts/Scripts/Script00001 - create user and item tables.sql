CREATE TABLE dbo.Users (
    userId INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(MAX) NOT NULL,
    token VARCHAR(MAX) NULL
)

CREATE TABLE dbo.itemTypes (
    itemTypeId INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL
)

CREATE TABLE dbo.itemPermissionTypes (
    itemPermissionTypeId INT NOT NULL IDENTITY(1, 1) PRIMARY KEY,
    description VARCHAR(100) NOT NULL
)

CREATE TABLE dbo.items (
    itemId INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    itemTypeId INT NOT NULL FOREIGN KEY REFERENCES dbo.itemTypes(itemTypeId),
    itemPermissionTypeId INT NOT NULL FOREIGN KEY REFERENCES dbo.itemPermissionTypes(itemPermissionTypeId),
    dateCreated DATETIME NOT NULL DEFAULT GETDATE(),
    dateDeleted DATETIME NULL
)

CREATE TABLE dbo.userItems (
    userId INT NOT NULL FOREIGN KEY REFERENCES dbo.users(userId),
    itemId iNT NOT NULL FOREIGN KEY REFERENCES dbo.items(itemId)
)

CREATE TABLE dbo.userFavorites (
    userId iNT NOT NULL FOREIGN KEY REFERENCES dbo.users(userId),
    itemId INT NOT NULL FOREIGN KEY REFERENCES dbo.items(itemId)
)



