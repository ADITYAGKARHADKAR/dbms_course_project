CREATE TABLE item (
    item_id INT PRIMARY KEY,
    item_type_id INT,
    complaint_id INT,
    status VARCHAR(10) NOT NULL,
    FOREIGN KEY (item_type_id) REFERENCES item_type(item_type_id),
    FOREIGN KEY (complaint_id) REFERENCES complaint(complaint_id),
    CONSTRAINT chk_item_status CHECK (status IN ('lost','found'))
);

INSERT INTO item (item_id, item_type_id, complaint_id, status) VALUES
(100, 1, 1, 'lost'),
(200, 2, 1, 'lost'),
(201, 1, 2, 'lost'),
(202, 3, 1, 'lost'),
(301, 4, 3, 'lost'),
(303, 1, 4, 'lost'),
(305, 4, 4, 'lost'),
(306, 2, 3, 'lost'),
(307, 1, 5, 'lost'),
(309, 5, 5, 'lost'),
(310, 2, 6, 'lost'),
(311, 3, 6, 'lost'),
(312, 1, 7, 'lost'),
(313, 2, 7, 'lost'),
(314, 3, 8, 'lost'),
(315, 4, 8, 'lost'),
(316, 5, 8, 'lost'),
(317, 1, 9, 'lost'),
(318, 5, 10, 'lost');