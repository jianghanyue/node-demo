FROM node:latest

RUN mkdir -p /home/node

WORKDIR /home/node

COPY . /home/node

run npm config set registry https://registry.npm.taobao.org

RUN npm install

ENTRYPOINT ["npm", "run"]

CMD ["start"]