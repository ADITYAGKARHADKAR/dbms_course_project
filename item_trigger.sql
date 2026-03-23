DROP TRIGGER IF EXISTS chg_item_status;


DELIMITER //


CREATE TRIGGER chg_item_status BEFORE UPDATE ON item  FOR EACH ROW

BEGIN

if new.status='found' and old.status='lost' THEN 
    set new.status_change_date=now();
END if;
END //

DELIMITER ;