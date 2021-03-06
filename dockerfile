FROM balenalib/raspberrypi3-node

ARG api_port=7070
RUN apt-get update
RUN sudo apt-get install build-essential python
# Create app directory
WORKDIR /opt/app

# Install app dependencies
COPY package.json package-lock.json* ./
RUN npm cache clean --force && npm install

COPY . /opt/app
RUN npm rebuild bcrypt --build-from-source
RUN npm rebuild i2c-bus
EXPOSE $api_port
CMD [ "npm", "run", "start" ]