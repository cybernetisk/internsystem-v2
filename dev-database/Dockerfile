# Stage 1: Data Generation
FROM python:3.9 AS data-generation
WORKDIR /app
COPY ./data-generation/ /app/
RUN pip install --no-cache-dir -r requirements.txt
RUN mkdir -p csv-out
RUN python script.py csv-in/users.csv > csv-out/users.csv

# Stage 2: MySQL
FROM mysql:8.0
WORKDIR /docker-entrypoint-initdb.d
COPY --from=data-generation /app/csv-out/users.csv /var/lib/mysql-files/users.csv
COPY ./mysql-init/ /docker-entrypoint-initdb.d/
