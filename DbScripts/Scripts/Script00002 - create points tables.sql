START TRANSACTION;

CREATE TABLE mc.points_groups (
    points_group_id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    average_horizontal_displacement FLOAT NOT NULL,
    average_vertical_displacement FLOAT NOT NULL,
    ahc_info_json VARCHAR NULL,
    clustering_output_json VARCHAR NULL,
    item_id INT NULL
);

CREATE TABLE mc.points (
    point_id iNT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    horizontal_displacement FLOAT NOT NULL,
    vertical_displacement FLOAT NOT NULL,
    points_group_id INT NOT NULL REFERENCES mc.points_groups(points_group_id)
);

COMMIT;