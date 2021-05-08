import React, {useState} from 'react';
import { ethers } from 'ethers'
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'

declare global {
  interface Window {
    ethereum: any;
  }
}

const greeterAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

function App() {
  const [greeting, setGreeting] = useState('')
  const [contractGreetingValue, setCurrentGreetingValue] = useState('')

  // request access to the user's MetaMask account
  const requestAccount = async () => {
    await window?.ethereum?.request({ method: 'eth_requestAccounts' })
  }

  // call the smart contract and read the current greeting value
  const fetchGreeting = async () => {
    if (typeof window?.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window?.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)

      try {
        const data = await contract.greet()
        setCurrentGreetingValue(data)
        console.log('DEBUG:: data', data)
      } catch (err) {
        console.error('ERROR:: Error while reading the smart contract', err)
      }
    }
  }

  const updateGreeting = async () => {
    if (!greeting) return;
    if (typeof window?.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      await transaction.wait()
      fetchGreeting()
    }
  }

  return (
      <div>
        <header>
          <button onClick={fetchGreeting}>Fetch greeting</button>
          <button onClick={updateGreeting}>Set greeting</button>
          <input onChange={event => setGreeting(event?.target?.value)} placeholder="Set greeting" />
        </header>
        <main>
          <h1>Contract - greeting value: {contractGreetingValue}</h1>
        </main>
      </div>
  )
}

export default App;
