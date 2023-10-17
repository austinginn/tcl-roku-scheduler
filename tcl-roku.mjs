class TCLRokuTV {
    constructor() {
        // You can initialize any required properties here
    }

    // Function to power on the TCL TV
    async powerOn(ipAddress) {
        try {
            const url = 'http://' + ipAddress + ':8060/keypress/PowerOn';
            const response = await fetch(url, "POST");
            // const data = await response.json();
            return response;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    // Function to power off the TCL TV
    async powerOff(ipAddress) {
        try {
            const url = 'http://' + ipAddress + ':8060/keypress/PowerOff';
            const response = await fetch(url, "POST");
            // const data = await response.json();
            return response;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    // Function to get the current status of the TCL TV
    async status(ipAddress) {
        try {
            const url = 'http://' + ipAddress + ':8060/';
            const response = await fetch(url, "GET");
            // const data = await response.json();
            return response;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    // Custom endpoint function
    async command(ipAddress, endpoint) {
        try {
            const url = 'http://' + ipAddress + endpoint;
            const response = await fetch(url, "POST");
            // const data = await response.json();
            return response;
        } catch (error) {
            console.error(error);
            return error;
        }
    }
}

export default TCLRokuTV;