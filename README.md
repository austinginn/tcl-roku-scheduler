# TCL Roku TV Scheduler

## Overview

A web server used to set power schedules for TCL Roku TVs.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Prerequisites

Before you can use this application, make sure you have the following prerequisites installed:

- **Node.js:** See - [nodejs.org](https://nodejs.org/) for installation instructions.
- **PM2:** See - [pm2.keymetrics.io](https://pm2.keymetrics.io/). Not required. Used to keep the server alive in a production environment

## Installation

1. Clone this repository to your local machine:

   ```shell
   git clone https://github.com/austinginn/tcl-roku-scheduler
    ```
2. Navigate to the directory:
    ```shell
    cd tcl-roku-scheduler
    ```
3. Install dependecies:
    ```shell
    npm install
    ```

## Configuration

## Usage
```shell
npm run
```
For long term usage use PM2.
```shell
pm2 start server.mjs
```
See [pm2](https://pm2.keymetrics.io/) docs for pm2 usage.

## API Endpoints

This section outlines the available API endpoints, their purposes, request methods, and required parameters.

### 1. GET /api

- **Method:** GET
- **Description:** GET API VERSION.
- **Request Parameters:**
    - none
- **Response:** A JSON object { version: 1.0.0 }

**Example:**

```http
GET /api
```

### 2. GET /api/data

- **Method:** GET
- **Description:** GET all schedule and TV data.
- **Request Parameters:**
    - none
- **Response:** A JSON object containing an array of tv objects and an array of group objects { tvs: [], groups: [] }

**Example:**

```http
GET /api/data
```

### 3. POST /api/tv/add

- **Method:** POST
- **Description:** Add a tv.
- **Request Body:**
    - name, ip address, array of groups, description
- **Response:** A JSON object with a response message.

**Example:**

```http
POST /api/tv/add
Content-Type: application/json

    {
        "name": "", 
        "ipAddress": "192.168.0.2", 
        "group": [""], 
        "description": ""
    }
```

### 4. POST /api/group/add

- **Method:** POST
- **Description:** Add a group.
- **Request Body:**
    - name, ip address, array of groups, description
- **Response:** A JSON object with a response message.

**Example:**

```http
POST /api/tv/add
Content-Type: application/json

    {
        "name": "", 
        "ipAddress": "192.168.0.2", 
        "group": [""], 
        "description": ""
    }
```

### 5. PUT /api/tv/update

- **Method:** PUT
- **Description:** Update a tv.
- **Request Body:**
    - name, ip address, array of groups, description
- **Response:** A JSON object with a response message.

**Example:**

```http
PUT /api/tv/update
Content-Type: application/json

    {
        "name": "", 
        "ipAddress": "192.168.0.2", 
        "group": [""], 
        "description": ""
    }
```

### 6. DELETE /api/tv/delete

- **Method:** DELETE
- **Description:** Delete a tv.
- **Request Parameters:**
    - ip address
- **Response:** A JSON object with a response message.

**Example:**

```http
DELETE /api/tv/update?ipAddress=192.168.0.2
```
## Contributing
If you'd like to contribute to this project, please follow these guidelines:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your fork.
5. Create a pull request, describing your changes in detail.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

MIT License

## Contact
Hey! My name is Austin.  I specialize in creating custom AVL Integration solutions. If you're interseted in collaborating you can reach me at [austinleeginn@gmail.com](mailto:austinleeginn@gmail.com).