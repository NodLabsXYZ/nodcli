import fs from 'fs';

const writeFile = (filePath, data) => {
  fs.writeFileSync(filePath, data);
}

export default writeFile;