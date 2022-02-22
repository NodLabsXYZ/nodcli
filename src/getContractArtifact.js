import hre from 'hardhat'

const getContractArtifact = async (name) => {
  return await hre.artifacts.readArtifact(name)
}

export default getContractArtifact;