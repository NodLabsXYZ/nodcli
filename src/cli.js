import path from "path";
import { Command } from 'commander';
import compile from '../src/compile.js';
import getContractArtifact from '../src/getContractArtifact.js'

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
      await compile(name);
      const artifact = await getContractArtifact(name);
    });
  
  program.parse();  
}

export default cli;