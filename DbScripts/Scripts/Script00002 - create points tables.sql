CREATE TABLE mapClustering.pointsGroups (
    pointsGroupId INT NOT NULL IDENTITY(1, 1) PRIMARY KEY,
    name VARCHAR(255) not null,
    averageHorizontalDisplacement FLOAT NOT NULL,
    averageVerticalDisplacement FLOAT NOT NULL,
    ahcInfoJson VARCHAR(MAX) NULL,
    clusteringOutputJson VARCHAR(MAX) NULL,
    itemId INT NULL
)

CREATE TABLE mapClustering.points (
    pointId iNT NOT NULL IDENTITY(1, 1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    horizontalDisplacement FLOAT NOT NULL,
    verticalDisplacement FLOAT NOT NULL,
    pointsGroupId INT NOT NULL FOREIGN KEY REFERENCES mapClustering.pointsGroups(pointsGroupId)
)