FROM python:3.11

RUN apt-get update && \
    apt-get install -y gettext && \
    rm -rf /var/lib/apt/lists/*

COPY ./src/requirements.txt /tmp
RUN pip install --no-cache-dir -r /tmp/requirements.txt

RUN groupadd -g 1000 app && \
    useradd -u 1000 -g 1000 -m -d /app -s /bin/bash app

WORKDIR /app/container
COPY . /app/container

RUN chown -R app:app /app && \
    chmod +x /app/container/bin/*
ENV PATH "$PATH:/app/container/bin"

USER app
CMD start
