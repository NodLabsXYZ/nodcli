const findDeployment = (projects, address) => {
  const allDeployments = projects.contracts.reduce(
    (acc, contract) => acc.concat((contract.info.deployments || []).map(
      deployment => ({
        deployedAt: new Date(deployment.deployedAt),
        address: deployment.contractAddress,
        abi: contract.info.abi,
        network: deployment.network
      })
    )),
    []
  )

  return address ?
    allDeployments.find(d => d.address === address) :
    allDeployments.sort(
      (a, b) => new Date(b.deployedAt) - new Date(a.deployedAt)
    )[0]
}

export default findDeployment;