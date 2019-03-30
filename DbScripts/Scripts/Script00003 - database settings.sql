CREATE TABLE mapClustering.databaseSettings (
    settingId VARCHAR(100) NOT NULL
    , settingValue VARCHAR(255) NOT NULL
)

INSERT INTO mapClustering.databaseSettings (settingId, settingValue)
SELECT 'appName', 'Map Clustering'