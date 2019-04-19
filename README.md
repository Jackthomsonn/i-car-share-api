## **How to get the app running locally**

**Terminal Window (cwd)**
```
docker-compose build
docker-compose up -d
docker-compose exec i-car-share bash
npm run build:dev
```

**Second Terminal Window (cwd)**
```
docker-compose exec i-car-share bash
nodemon build
```

**Create index for carshares (Only needed for first initial local mongo instance instantiation, cwd)**
```
docker-compose exec i-car-share bash
mongo
use icarshare
db.carshares.createIndex({ origin: '2dsphere' })
```

## How to deploy
Pushing or merging a branch into master will trigger a deploy. When raising pull requests a unique instance of your changes is spawned up separately for you & others to quickly view your changes