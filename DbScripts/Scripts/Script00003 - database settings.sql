START TRANSACTION;

CREATE TABLE mc.database_settings (
    setting_id VARCHAR(100) NOT NULL
    , setting_value VARCHAR(255) NOT NULL
);

INSERT INTO mc.database_settings (setting_id, setting_value)
SELECT 'appName', 'Map Clustering';

COMMIT;