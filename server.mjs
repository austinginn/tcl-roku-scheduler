import TCLRokuTV from "./tcl-roku.mjs";
import JSONFileHandler from "./json-file-handler.mjs";
import express from 'express';
import expressAPI from './expressAPI.mjs';
import cron from 'node-cron';
import cronstrue from 'cronstrue';

const app = express();
const port = process.argv[2] || 3000; // default to port 3000 if no argument is provided
app.use(express.json());

//Init file handler
const tvFileHandler = new JSONFileHandler('./tvs.json');

//Cron jobs
let cronJobs = {};

// Call init to load files and initialize cron jobs
let TVs = await initTVs();
initCron();


// Mount the TV control API
app.use('/api', expressAPI(TVs, tvFileHandler, cronJobs, TCLRokuTV)); // Pass the TV data as an argument

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


async function initTVs() {
    console.log("Loading save data...");
    try {
        const tvData = await tvFileHandler.readJSON();
        console.log("Loaded!");
        return tvData;
    } catch (error) {
        console.error(error);
        console.log("Creating new tvs.json save file...");
        await tvFileHandler.saveJSON({ "tvs": [], "groups": [] });
        return {};
    }
}

function initCron() {
    // Initialize cron jobs from JSON data
    console.log("Initializing cron jobs...");
    if(TVs.groups.length == 0){
        console.log("No groups found.");
        return;
    }
    TVs.groups.forEach((job) => {
        if (job.powerOn != "") {
            const onCron = cron.schedule(job.powerOn, () => {
                //Power on all tvs in the group
                //Logic for finding tvs in matching group
                console.log("Powering on all tvs in group: " + job.name);
                for(let i = 0; i < TVs.tvs.length; i++){
                    for(let x = 0; x < TVs.tvs[i].group.length; x++){
                        if(TVs.tvs[i].group[x] == job.name){
                            console.log("Powering on tv: " + TVs.tvs[i].name);
                            TCLRokuTV.powerOn(TVs.tvs[i].ipAddress);
                        }
                    }
                }
            });
            cronJobs[job.name + " - on"] = onCron;
            console.log("Created power on job for: " + job.name + " - " + cronstrue.toString(job.powerOn));
        }

        if(job.powerOff != ""){
            const offCron = cron.schedule(job.powerOff, () => {
                //Power off all tvs in the group
                //Logic for finding tvs in matching group
                console.log("Powering off all tvs in group: " + job.name);
                for(let i = 0; i < TVs.tvs.length; i++){
                    for(let x = 0; x < TVs.tvs[i].group.length; x++){
                        if(TVs.tvs[i].group[x] == job.name){
                            console.log("Powering off tv: " + TVs.tvs[i].name);
                            TCLRokuTV.powerOff(TVs.tvs[i].ipAddress);
                        }
                    }
                }
            });

            cronJobs[job.name + " - off"] = offCron;
            console.log("Created power off job for: " + job.name + " - " + cronstrue.toString(job.powerOff));
        }
    });
}

