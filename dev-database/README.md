# Development database

## Usage

Either do `docker-compose up` in the project root directory (recommended). No other steps required.

Or build a separate image based on the `Dockerfile` in this directory (see the `docker-compose.yml` at root to get an idea on how to run it). You will then need to update your `.env` file to point to this container. For example:

```
...
DATABASE_URL = "mysql://root:rootpassword@localhost:3306/mydb"
...
```

## Requirements

You need to install `docker-compose`. Otherwise, other requirements should be handled inside the Docker containers. Unless you want to fiddle with the data generation code, which is in Python. Then I would recommend making a virtual environment within the `data-generation/` directory.

## How it works

There are some templates in `data-generation/csv-in`. The script that actually generates the new data is `data-generation/script.py`.

The `Dockerfile` runs `python script.py csv-in/users.csv`. This should download some SSB name data, and create some random names. This new data is loaded into the MySQL container, and it initializes the tables and parses the new CSV file (see the `mysql-init/` directory).

## To do

- [x] Support the `User` table
- [ ] Support other tables. Right now, the website crashes if you try to fetch data from other tables than `User`.
