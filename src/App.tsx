import React, {useCallback, useEffect, useState} from 'react';
import { ethers } from 'ethers'
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import Token from './artifacts/contracts/Token.sol/Token.json'

declare global {
  interface Window {
    ethereum: any;
  }
}

const tokenAddress = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'
const greeterAddress = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'

function App() {
  const [greeting, setGreeting] = useState('')
  const [userAccount, setUserAccount] = useState('')
  const [contractGreetingValue, setCurrentGreetingValue] = useState('')
  const [amount, setAmount] = useState('')
  const [accountBalance, setAccountBalance] = useState('')

  // call the smart contract and read the current greeting value
  const fetchGreeting = useCallback(
    async () => {
      if (typeof window?.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window?.ethereum)
        const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)

        try {
          const data = await contract.greet()
          setCurrentGreetingValue(data)
        } catch (err) {
          console.error('ERROR:: Error while reading the smart contract', err)
        }
      }
    }, []
  )

  const getBalance = useCallback(
      async () => {
        if (typeof window?.ethereum !== 'undefined') {
          const [account] = await requestAccount()
          const provider = new ethers.providers.Web3Provider(window?.ethereum)
          const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
          const balance = await contract.balanceOf(account)
          setAccountBalance(balance.toString())
        }
      }, []
  )

  useEffect(() => {
    fetchGreeting()
    getBalance()
  }, [])

  // request access to the user's MetaMask account
  const requestAccount = async () => {
    return window?.ethereum?.request({ method: 'eth_requestAccounts' })
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

  const sendCoins = async () => {
    if (typeof window?.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window?.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer)
      const transaction = await contract.transfer(userAccount, amount)
      await transaction.wait()
    }
  }

  return (
      <div>
        <header>
          <button onClick={fetchGreeting}>Fetch greeting</button>
          <button onClick={updateGreeting}>Set greeting</button>
          <input onChange={event => setGreeting(event?.target?.value)} placeholder="Set greeting" />

          <br />

          <button onClick={getBalance}>Get balance</button>
          <button onClick={sendCoins}>Send coins</button>
          <input onChange={event => setUserAccount(event?.target?.value)} placeholder="Account ID" />
          <input onChange={event => setAmount(event?.target?.value)} placeholder="Amount" />
        </header>
        <main>
          <h1>Contract - greeting value: {contractGreetingValue}</h1>
          <h1>Contract - account balance: {accountBalance}</h1>
        </main>
      </div>
  )
}

export default App;
