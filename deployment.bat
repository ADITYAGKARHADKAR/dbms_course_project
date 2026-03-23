@echo off

set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
set USER=root
set PASSWORD=aditya
set DATABASE=test1

%MYSQL_PATH% -u %USER% -p%PASSWORD% -e "CREATE DATABASE IF NOT EXISTS %DATABASE%;"

REM Run the SQL file
%MYSQL_PATH% -u %USER% -p%PASSWORD% %DATABASE% < "D:\Aditya\Second year\DBMS\DBMS-IT\course_project\drop_tables.sql"
%MYSQL_PATH% -u %USER% -p%PASSWORD% %DATABASE% < "D:\Aditya\Second year\DBMS\DBMS-IT\course_project\user.sql"
%MYSQL_PATH% -u %USER% -p%PASSWORD% %DATABASE% < "D:\Aditya\Second year\DBMS\DBMS-IT\course_project\item_type.sql"
%MYSQL_PATH% -u %USER% -p%PASSWORD% %DATABASE% < "D:\Aditya\Second year\DBMS\DBMS-IT\course_project\complaint.sql"
%MYSQL_PATH% -u %USER% -p%PASSWORD% %DATABASE% < "D:\Aditya\Second year\DBMS\DBMS-IT\course_project\item.sql"
%MYSQL_PATH% -u %USER% -p%PASSWORD% %DATABASE% < "D:\Aditya\Second year\DBMS\DBMS-IT\course_project\complaint_trigger.sql"


echo SQL script executed successfully.
pause