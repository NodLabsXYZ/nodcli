import path from "path";
import { Command } from 'commander';

import uploadContractInfo from '../src/uploadContractInfo.js';
import getProjects from "./getProjects.js";
import getProject from "./getProject.js";
import findDeployment from "./findDeployment.js";
import writeFile from './writeFile.js';

const cli = () => {
  const directoryName = path.basename(process.cwd());

  const program = new Command();

  program
    .name('nod')
    .description('Tools for building in web3')
    .version('0.0.1');
  
  program.command('compile')
    .description('Compile the project and upload the contacts to the network')
    .argument(
      '[name]', 
      'the name of the contract to compile - if not specified will default to the contract that matches the current working directory'
    )
    // .option('--first', 'display just the first substring')
    .action(async (name=directoryName, _options) => {
      const compile = (await import('../src/compile.js')).default;
      const getContractArtifact = (await import('../src/getContractArtifact.js')).default;

      await compile(name);
      const artifact = await getContractArtifact(name);
      await uploadContractInfo(artifact);
    });

  program.command('import')
    .description('Import the network, address, and abi of a contract')
    .argument(
      '[name]', 
      'the name of the project - if not specified and there are multiple projects you will be asked to select which one'
    )
    .argument(
      '[address]', 
      'the address of the contract deployment to import - if not specified will default to the last contract deployment'
    )
    .action(async (name, address, _options) => {
      const projects = await getProjects();

      let project;
      if (projects.length > 1) {
        if (name) {
          project = projects.find(p => p.title === name)
        }
        
        if (!project) {
          console.log("Multiple projects found. Please specify which one you want to import:");
        }
      } else {
        project = projects[0]
      }

      const projectDetails = await getProject(project.id);
      const deployment = findDeployment(projectDetails, address);
       
      const path = `contracts/${projectDetails.title}.js`
      writeFile(
        path, 
        JSON.stringify(deployment, null, 2)
      )
      console.log("Contract information written to: ", path);
    });
  
  program.parse();  
}

export default cli;