import ora from 'ora';

const uploadContractInfo = ({ contractName, abi, bytecode }) => {
  const spinner = ora(`Uploading information for contract "${contractName}"`).start();
  spinner.stop()

  console.log(contractName)
}

export default uploadContractInfo;