// JSON FILE HANDLER | AUSTIN GINN 2023
import fs from 'fs';

class JSONFileHandler {
  constructor(filePath) {
    this.filePath = filePath;
  }

  // Read JSON data from a file using async/await
  async readJSON() {
    try {
      const data = await fs.promises.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw error;
    }
  }

  // Save JSON data to a file using async/await
  async saveJSON(data) {
    try {
      const jsonData = JSON.stringify(data, null, 2); // Pretty-print with 2-space indentation
      await fs.promises.writeFile(this.filePath, jsonData, 'utf8');
    } catch (error) {
      throw error;
    }
  }
}

export default JSONFileHandler;
