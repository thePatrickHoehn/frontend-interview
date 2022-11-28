# Orderly Front End Interview


## Before running the servers:

### npm install

### npm install -g json-server 
json-server is used to run a local db by looking at a local json file. Used to simulate a back end. 


## To Start Servers run:

### 'json-server --watch db.json'

watches the top level db.json file and allows access to through port 8080


Notes: When you make changes in the app it will overwrite the db.json file. Included is a dbBackup.json file with all the original data. 
You can cpoy/paste this data into the db.json to reset the data in the db.

Items are modified using their Id.

For more info on json-server visit: [https://www.npmjs.com/package/json-server]

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.
