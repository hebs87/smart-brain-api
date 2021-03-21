-- Deploy fresh database table - the order matters if the tables depend on each other
\i '/docker-entrypoint-initdb.d/tables/users.sql'
\i '/docker-entrypoint-initdb.d/tables/login.sql'
-- Run the sql file to create test users
\i '/docker-entrypoint-initdb.d/seed/seed.sql'
