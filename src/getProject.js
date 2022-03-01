import ora from 'ora';
import fetchData from './fetchData.js';

const getProject = async (id) => {
  const spinner = ora('Retrieving project information...').start();
  const projects = await fetchData(
    `projects/${id}`,
    'GET'
  )
  spinner.stop()

  return projects
}

export default getProject;