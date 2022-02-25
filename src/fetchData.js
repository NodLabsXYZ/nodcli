import fetch from 'node-fetch';

const baseURI = 'http://localhost:3001'

const fetchData = async (relativePath, method, body) => {
  const data = {
    method: method,
    headers: { 'Content-Type': 'application/json' }
  }

  if (body) {
    data.body = JSON.stringify(body)
  }

  const response = await fetch(
    `${baseURI}/api/${relativePath}`, 
    data
  );
  return await response.json();
}

export default fetchData;