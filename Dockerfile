# Specify package and version
FROM node:14

# Specify the working directory in which to run the docker app
WORKDIR /usr/src/smart-brain-api

# Specify what we want to copy and to where - all files in our project root directory to the docker app root directory
COPY ./ ./

# Any commands we want to run on starting our app
RUN npm install

# The final command to run - open the /bin/bash command line
CMD ["/bin/bash"]
