import TCLRokuTV from "./tcl-roku.mjs";
import JSONFileHandler from "./json-file-handler.mjs";
import express from 'express';
import expressAPI from './expressAPI.mjs';
import cron from 'node-cron';

const app = express();
const port = 3000;
app.use(express.json());

//Init file handler
const tvFileHandler = new JSONFileHandler('./tvs.json');

//Cron jobs
let cronJobs = {};

// Call init to load files and initialize cron jobs
let TVs = await initTVs();
initCron();


// Mount the TV control API
app.use('/api', expressAPI(TVs, tvFileHandler)); // Pass the TV data as an argument

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


async function initTVs() {
    try {
        const tvData = await tvFileHandler.readJSON();
        return tvData;
    } catch (error) {
        console.error(error);
        console.log("Creating new tvs.json file");
        await tvFileHandler.saveJSON({ "tvs": [], "groups": [] });
        return {};
    }
}

function initCron() {
    // Initialize cron jobs from JSON data
    TVs.groups.forEach((job) => {
        if (job.powerOn != "") {
            const onCron = cron.schedule(job.powerOn, () => {
                //Power on all tvs in the group
                console.log("Powering on all tvs in group: " + job.name);
                for(let i = 0; i < TVs.tvs.length; i++){
                    console.log("Powering on tv: " + TVs.tvs[i].name);
                }
            });

            cronJobs[job.name + " - on"] = onCron;
        }

        if(job.powerOff != ""){
            const offCron = cron.schedule(job.powerOff, () => {
                //Power off all tvs in the group
                console.log("Powering off all tvs in group: " + job.name);
                for(let i = 0; i < TVs.tvs.length; i++){
                    console.log("Powering off tv: " + TVs.tvs[i].name);
                }
            });

            cronJobs[job.name + " - off"] = offCron;
        }
    });
}

