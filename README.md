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

Make sure you have mongo installed locally

## **How to deploy**
#### When running on a branch other than master
**This will create a separate deployed instance where you can do testing - Url will be randomly generated**
```
now
```

#### When running on the master branch
**This will create a new deployed version of the application to production - icarshare.io**
```
now
```