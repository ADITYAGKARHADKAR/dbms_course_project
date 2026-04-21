DROP TRIGGER IF EXISTS chg_item_status;

DELIMITER //

CREATE TRIGGER chg_item_status
BEFORE UPDATE ON item
FOR EACH ROW
BEGIN
    IF NEW.status = 'found' AND OLD.status = 'lost' THEN
        SET NEW.status_change_date = NOW();
    END IF;
END//

DELIMITER ;