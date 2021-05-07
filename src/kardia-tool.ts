import KardiaClient from 'kardia-js-sdk'

const KARDIA_NODE_ENDPOINT = 'https://dev-1.kardiachain.io'

const kardiaClient = new KardiaClient({endpoint: KARDIA_NODE_ENDPOINT})
const kardiaContract = kardiaClient.contract
const kardiaChain = kardiaClient.kaiChain

export  {
    kardiaClient,
    kardiaContract,
    kardiaChain
}