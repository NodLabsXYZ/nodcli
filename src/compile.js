import ora from 'ora';
import hre from 'hardhat'

const compile = async (name) => {
  const spinner = ora('Compiling project: ').start();
  await hre.run('compile', name)
  spinner.stop()
}

export default compile