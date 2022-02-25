import ora from 'ora';
import fetchData from './fetchData.js';

const uploadContractInfo = async ({ contractName, abi, bytecode }) => {
  const spinner = ora('Looking up projects...').start();
  const projects = await fetchData(
    'projects',
    'GET'
  )
  spinner.stop()

  let activeProject = projects.find(
    project => project.title === contractName
  )

  if (!activeProject) {
    console.log("No matching project found. Please create a new project first.")
    return;
  }

  const data = {
    contract: {
      projectId: activeProject.id,
      name: contractName,
      info: {
        abi,
        bytecode
      },
      compiledAt: new Date().toISOString()  
    }
  }

  const uploadSpinner = ora(`Uploading information for contract "${contractName}"`).start();
  await fetchData(
    'contracts',
    'POST',
    data
  )
  uploadSpinner.stop()
}

export default uploadContractInfo;