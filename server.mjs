import TCLRokuTV from "./tcl-roku.mjs";
import JSONFileHandler from "./json-file-handler.mjs";
import express from 'express';
import expressAPI from './expressAPI.mjs';

const app = express();
const port = 3000;
app.use(express.json());

//Init file handler
const tvFileHandler = new JSONFileHandler('./tvs.json');

// Call init and load tv json file into memory
let TVs = await init();



// Mount the TV control API
app.use('/api', expressAPI(TVs, tvFileHandler)); // Pass the TV data as an argument

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


async function init() {
    try {
        const tvData = await tvFileHandler.readJSON();
        return tvData;
    } catch (error) {
        console.error(error);
        console.log("Creating new tvs.json file");
        await tvFileHandler.saveJSON({ "tvs": [], "groups": []});
        return {};
    }
}

