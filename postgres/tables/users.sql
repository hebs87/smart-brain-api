BEGIN TRANSACTION;

CREATE TABLE users (
    id serial PRIMARY KEY,
    name VARCHAR(100),
    email text UNIQUE NOT NULL,
    joined TIMESTAMP NOT NULL,
    entries BIGINT DEFAULT 0,
    age text DEFAULT '',
    pet text DEFAULT ''
);

COMMIT;
