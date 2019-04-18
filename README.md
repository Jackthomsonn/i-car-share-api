## **How to get the app running locally**

**Terminal Window (cwd)**
```
npm run build:dev
```

**Second Terminal Window (cwd)**
```
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