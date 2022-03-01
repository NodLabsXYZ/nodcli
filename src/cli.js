import path from "path";
import { Command } from 'commander';

import uploadContractInfo from '../src/uploadContractInfo.js';
import getProjects from "./getProjects.js";
import getProject from "./getProject.js";
import findDeployment from "./findDeployment.js";
import writeFile from './writeFile.js';
import openWebsite from './openWebsite.js';

const dashboardURL = 'https://contract-deployment-dashboard-test.vercel.app/'

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
      console.log("")
      console.log("")
      console.log("To view your dashboard visit:")
      console.log("")
      console.log(`${dashboardURL}/project/${name}`)
      console.log("")
      console.log(`or run \`nod dashboard ${name}\``)
      console.log("")
      console.log("")
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
      console.log("")
      console.log("")
      console.log("Contract information written to: ", path);
      console.log("")
      console.log("You can now access the contract information in your project:");
      console.log("")
      console.log("")
      console.log(`const ${projectDetails.title} = require('../contracts/${projectDetails.title}.js')`);
      console.log("")
      console.log("or")
      console.log("")
      console.log(`import ${projectDetails.title} from '../contracts/${projectDetails.title}.js'`);
      console.log("")
      console.log("")
      console.log("and then access the network, address, or abi of the contract like so:")
      console.log("")
      console.log(`console.log(${projectDetails.title}.abi)`);    
      console.log("")
      console.log("")  
    });
  
  program.command('dashboard')
    .description('Open your dashboard in a browser')
    .argument(
      '[name]', 
      'go directly to the project page with the given name'
    )
    .action(async (name, _options) => {
      if (!name) {
        openWebsite(dashboardURL);
        return;
      }
      
      const projects = await getProjects();
      const project = projects.find(p => p.title === name);
      if (!project) {
        console.log("Project not found, opening base dashboard instead...");
        openWebsite(dashboardURL);
        return;
      }
      openWebsite(`${dashboardURL}/project/${project.id}`);
    });

  program.parse();  
}

export default cli;