import fs from 'fs';

const getFile = (path: string) => {
  return fs.readFileSync(path, 'utf-8');
};

export = { getFile };
