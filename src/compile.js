import ora from 'ora';
import hre from 'hardhat'

const compile = async (name) => {
  const spinner = ora('Compiling project: ').start();
  await hre.run('compile', name)
  spinner.stop()
  console.log("Compilation complete...")
}

export default compile