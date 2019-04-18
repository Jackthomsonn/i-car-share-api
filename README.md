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
Production Mongo URI
```
mongodb://root:u4E6u4amL8ysblnV@maincluster-shard-00-00-cvfbm.mongodb.net:27017,maincluster-shard-00-01-cvfbm.mongodb.net:27017,maincluster-shard-00-02-cvfbm.mongodb.net:27017/test?ssl=true&replicaSet=MainCluster-shard-0&authSource=admin&retryWrites=true
```
#### The services should be up and running now! Open http://localhost:8080 in postman and start hitting the endpoints