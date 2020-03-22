START TRANSACTION;

CREATE SCHEMA mc;

CREATE TABLE mc.users (
    user_id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR NULL,
    token VARCHAR NULL
);

CREATE TABLE mc.item_types (
    item_type_id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL
);

INSERT INTO mc.item_types (name)
SELECT 'Points Group';

CREATE TABLE mc.item_permission_types (
    item_permission_type_id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    description VARCHAR(100) NOT NULL
);

INSERT INTO mc.item_permission_types (description)
SELECT 'Private' AS description UNION
SELECT 'Public' AS description;

CREATE TABLE mc.items (
    item_id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    item_type_id INT NOT NULL REFERENCES mc.item_types(item_type_id),
    item_permission_type_id INT NOT NULL REFERENCES mc.item_permission_types(item_permission_type_id),
    dateCreated DATE NOT NULL DEFAULT CURRENT_DATE,
    dateDeleted DATE NULL
);

CREATE TABLE mc.user_items (
    user_id INT NOT NULL REFERENCES mc.users(user_id),
    item_id iNT NOT NULL REFERENCES mc.items(item_id)
);

CREATE TABLE mc.user_favorites (
    user_id iNT NOT NULL REFERENCES mc.users(user_id),
    item_id INT NOT NULL REFERENCES mc.items(item_id)
);

COMMIT;









