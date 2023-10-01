// expressAPI.js
import express from 'express';
const router = express.Router();

// Middleware to parse JSON request bodies
router.use(express.json());

// TVControl API routes
export default function expressAPI(TVs, tvFileHandler, cronJobs) {

  // API version endpoint
  router.get('/', (req, res) => {
    console.log(TVs);
    return res.status(200).json({ version: '1.0' });
  });

  // add a new tv
  router.post('/tv/add', async (req, res) => {
    try {
      // console.log(req.body);
      const { name, ipAddress, group } = req.body;
      // Check if the TV already exists
      if (TVs.tvs.find((tv) => tv.ipAddress === ipAddress)) {
        return res.status(409).json({ error: `TV '${ipAddress}' already exists.` });
      }

      // save the new TV
      TVs.tvs.push({ name, ipAddress, group });
      await tvFileHandler.saveJSON(TVs);
      console.log(TVs);

      return res.status(201).json({ message: 'TV added successfully' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Delete a TV
  router.delete('/tv/delete', async (req, res) => {
    try {
      const { ipAddress } = req.query;

      // Check if the TV exists
      const tvIndex = TVs.tvs.findIndex((tv) => tv.ipAddress === ipAddress);
      if (tvIndex === -1) {
        return res.status(404).json({ error: `TV '${ipAddress}' does not exist` });
      }

      TVs.tvs.splice(tvIndex, 1);

      await tvFileHandler.saveJSON(TVs);
      console.log(TVs);
      return res.status(200).json({ message: 'TV deleted successfully' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // add a new group
  router.post('/group/add', async (req, res) => {
    try {
      console.log(req.body);
      const { name, powerOn, powerOff } = req.body;
      // Check if the TV already exists
      if (TVs.groups.find((group) => group.name === name)) {
        return res.status(409).json({ error: `Group '${name}' already exists.` });
      }

      // save the new TV
      TVs.groups.push({ name, powerOn, powerOff });
      await tvFileHandler.saveJSON(TVs);

      console.log("Starting cron jobs...");
      if (powerOn != "") {
        const onCron = cron.schedule(powerOn, () => {
          //Power on all tvs in the group
          console.log("Powering on all tvs in group: " + name);
          for (let i = 0; i < TVs.tvs.length; i++) {
            console.log("Powering on tv: " + TVs.tvs[i].name);
          }
        });

        cronJobs[name + " - on"] = onCron;
      }

      if (powerOff != "") {
        const offCron = cron.schedule(powerOff, () => {
          //Power on all tvs in the group
          console.log("Powering off all tvs in group: " + name);
          for (let i = 0; i < TVs.tvs.length; i++) {
            console.log("Powering off tv: " + TVs.tvs[i].name);
          }
        });

        cronJobs[name + " - off"] = offCron;
      }

      return res.status(201).json({ message: 'Group added successfully' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Delete a group
  router.delete('/group/delete', async (req, res) => {
    try {
      const { name } = req.query;

      // Check if the group exists
      const groupIndex = TVs.groups.findIndex((group) => group.name === name);
      if (groupIndex === -1) {
        return res.status(404).json({ error: `Group'${name}' does not exist` });
      }

      TVs.groups.splice(groupIndex, 1);

      //Try to stop the cron job if it exists and log it to the console
      console.log("Attempting to stop cron jobs");
      if (cronJobs[name + " - on"]) {
        cronJobs[name + " - on"].stop();
        console.log("Stopped cron job: " + name + " - on");
      }

      if (cronJobs[name + " - off"]) {
        cronJobs[name + " - off"].stop();
        console.log("Stopped cron job: " + name + " - off");
      }

      await tvFileHandler.saveJSON(TVs);
      console.log(TVs);
      return res.status(200).json({ message: 'Group deleted successfully' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // // Power on a TV
  // router.post('/power-on', async (req, res) => {
  //   // Implement the logic to power on the TV using the provided IP address
  //   const { ipAddress } = req.body;
  //   console.log(`TV at ${ipAddress} powered on`);
  //   return res.status(200).json({ message: `TV at ${ipAddress} powered on` });
  // });

  // // Power off a TV
  // router.post('/power-off', async (req, res) => {
  //   // Implement the logic to power off the TV using the provided IP address
  //   const { ipAddress } = req.body;
  //   console.log(`TV at ${ipAddress} powered off`);
  //   return res.status(200).json({ message: `TV at ${ipAddress} powered off` });
  // });

  return router;
}

