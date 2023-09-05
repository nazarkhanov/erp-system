FROM node:18

RUN mkdir -p /app/container/src
COPY ./src/package*.json /app/container/src
RUN npm install --prefix /app/container/src

RUN groupmod -g 1001 node && \
    usermod -u 1001 node && \ 
    groupadd -g 1000 app && \
    useradd -u 1000 -g 1000 -m -d /app -s /bin/bash app

WORKDIR /app/container
COPY . /app/container

RUN chown -R app:app /app && \
    chmod +x /app/container/bin/*
ENV PATH "$PATH:/app/container/bin"

USER app
CMD start
