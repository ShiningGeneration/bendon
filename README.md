# Bendon REST API Server

The project is generated by [LoopBack](http://loopback.io).

##Installation
```
npm install
npm install -g strongloop #optional, gives you loopback commandline tools
```

##Running the dev server

```
node .
```

Then open http://0.0.0.0:3000/explorer to explore the REST APIs

##Populate the server with test data

```
node_modules/jasmine-node/bin/jasmine-node test/
```
It will run `test/populate_ref_workload.js`


##Connecting to MongoDB backend

When you fininsh the above steps, the dev server stores the data in memory, so everytime you close the server (by Ctrl+C), the data is lost. To have persistent data storage, you need a MongoDB server.

```
docker run -p 27017:27017 --name some-mongo -v /abs/path/to/local/directory:/data/db -d mongo
```

Note that the docker image will be called `some-mongo`, and you need to specify a directory (`/abs/path/to/local/directory`)in the host system to store the MongoDB data files. This runs the MongoDB in auth-free mode (no login required) so be careful.

Then, add the MongoDB as a data source in loopback

```
slc loopback:datasource
```

Remeber to change the `dataSource` in `server/model-config.json`

reference: http://docs.strongloop.com/display/public/LB/Connecting+models+to+data+sources;jsessionid=811FF5809FDFDA26A2E08144A7914771

