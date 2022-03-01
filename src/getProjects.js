import ora from 'ora';
import fetchData from './fetchData.js';

const getProjects = async () => {
  const spinner = ora('Retrieving project information...').start();
  const projects = await fetchData(
    'projects',
    'GET'
  )
  spinner.stop()

  return projects
}

export default getProjects;