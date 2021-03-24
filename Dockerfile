# Specify package and version
FROM node:14.11.0

# Create docker app directory
RUN mkdir -p /usr/src/smart-brain-api
WORKDIR /usr/src/smart-brain-api

# Install app dependencies
COPY package.json /usr/src/smart-brain-api
RUN npm install

# Bundle app source
COPY . /usr/src/smart-brain-api

# Build arguments
ARG NODE_VERSION=14.11.0

# Environment
ENV NODE_VERSION $NODE_VERSION

# The final command to run - open the /bin/bash command line
CMD ["/bin/bash"]
