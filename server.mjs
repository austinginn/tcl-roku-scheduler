//TCL ROKU TV SCHEUDLER | AUSTIN GINN 2023
import TCLRokuTV from "./tcl-roku.mjs";
import JSONFileHandler from "./json-file-handler.mjs";
import express from 'express';
import expressAPI from './expressAPI.mjs';
import cron from 'node-cron';
import cronstrue from 'cronstrue';
import logger from './logger.mjs';

const tcl = new TCLRokuTV(logger); // TCL 

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
app.use('/api', expressAPI(TVs, tvFileHandler, cronJobs, tcl, logger)); // Pass the TV data as an argument

app.listen(port, () => {
    logger.log('info', `Server is running on port ${port}`);
});


async function initTVs() {
    logger.log('info',"Loading save data...");
    try {
        const tvData = await tvFileHandler.readJSON();
        logger.info("Loaded!");
        return tvData;
    } catch (error) {
        logger.error(error.message);
        logger.info("Creating new tvs.json save file...");
        await tvFileHandler.saveJSON({ "tvs": [], "groups": [] });
        return {};
    }
}

 function initCron() {
    // Initialize cron jobs from JSON data
    logger.info("Initializing cron jobs...");
    if(TVs.groups.length == 0){
        logger.info("No groups found.");
        return;
    }
    TVs.groups.forEach((job) => {
        if (job.powerOn != "") {
            const onCron = cron.schedule(job.powerOn, async () => {
                //Power on all tvs in the group
                //Logic for finding tvs in matching group
                logger.info("Powering on all tvs in group: " + job.name);
                for(let i = 0; i < TVs.tvs.length; i++){
                    // console.log("tv index", i);
                    for(let x = 0; x < TVs.tvs[i].group.length; x++){
                        // console.log("group index", x);
                        if(TVs.tvs[i].group[x] == job.name){
                            logger.info("Powering on tv: " + TVs.tvs[i].name);
                            try {
                                await tcl.powerOn(TVs.tvs[i].ipAddress);
                            } catch (error) {
                                logger.error(error.message);
                            } 
                        }
                    }
                }
            });
            cronJobs[job.name + " - on"] = onCron;
            logger.info("Created power on job for: " + job.name + " - " + cronstrue.toString(job.powerOn));
        }

        if(job.powerOff != ""){
            const offCron = cron.schedule(job.powerOff, async () => {
                //Power off all tvs in the group
                //Logic for finding tvs in matching group
                logger.info("Powering off all tvs in group: " + job.name);
                for(let i = 0; i < TVs.tvs.length; i++){
                    for(let x = 0; x < TVs.tvs[i].group.length; x++){
                        if(TVs.tvs[i].group[x] == job.name){
                            logger.info("Powering off tv: " + TVs.tvs[i].name);
                            try {
                                await tcl.powerOff(TVs.tvs[i].ipAddress);
                            } catch (error) {
                                logger.error(error.message);
                            }
                            
                        }
                    }
                }
            });

            cronJobs[job.name + " - off"] = offCron;
            logger.info("Created power off job for: " + job.name + " - " + cronstrue.toString(job.powerOff));
        }
    });
}

process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error.message}`);
    process.exit(1); // Exit the application or handle it appropriately.
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });