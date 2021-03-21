FROM postgres:13

# We want to add the tables folder files to the tables location in our docker app
ADD /tables/ /docker-entrypoint-initdb.d/tables/
# We want to add the seed folder files to the seed location in our docker app
ADD /seed/ /docker-entrypoint-initdb.d/seed/
# We want to add the deploy_schemas.sql file into the entrypoint to add the tables
ADD deploy_schemas.sql /docker-entrypoint-initdb.d/
