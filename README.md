# Instructions

## When first running the app
Open a terminal and run the following commands:

```
cd i-car-share-api
docker-compose up -d
mongo
use i-car-share
db.carshares.createIndex( { origin : "2dsphere" }
```

#### The services should be up and running now! Open http://localhost:8080 in postman and start hitting the endpoints