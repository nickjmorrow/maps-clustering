START TRANSACTION;

DROP TABLE mc.points;
DROP TABLE mc.points_groups;
DROP TABLE mc.database_settings;
DROP TABLE mc.user_favorites;
DROP TABLE mc.user_items;
DROP TABLE mc.items;
DROP TABLE mc.item_permission_types;
DROP TABLE mc.item_types;
DROP TABLE mc.users;

DROP SCHEMA mc;

COMMIT;