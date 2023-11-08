import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { deploy, deployExisting } from './deploy';
import Escrow from './Escrow';
import { store } from "./storage"

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
    const approveTxn = await escrowContract.connect(signer).approve();
    await approveTxn.wait();
}

function App() {
    const [escrows, setEscrows] = useState([]);
    const [account, setAccount] = useState();
    const [signer, setSigner] = useState();

    useEffect(() => {
        async function getAccounts() {
            const accounts = await provider.send('eth_requestAccounts', []);

            setAccount(accounts[0]);
            setSigner(provider.getSigner());
        }

        getAccounts();
    }, [account]);

    async function newContract() {
        const beneficiary = document.getElementById('beneficiary').value;
        const arbiter = document.getElementById('arbiter').value;
        const value = ethers.utils.parseEther(document.getElementById('eth').value);
        return doNewContract({ beneficiary, arbiter, value, signer });
    }

    async function doNewContract({ beneficiary, arbiter, value, signer }) {
        const escrowContract = await deploy(signer, arbiter, beneficiary, value);


        const escrow = {
            address: escrowContract.address,
            arbiter,
            beneficiary,
            value: value.toString(),
            date: Date(),
            status: 'deployed',
            escrow: null, // this
        }
        // escrow.escrow = escrow;

        escrow.handleApprove = async () => {
            escrowContract.on('Approved', () => {
                document.getElementById(escrowContract.address).className =
                    'complete';
                document.getElementById(escrowContract.address).innerText =
                    "✓ It's been approved!";
                escrow.status = "approved";
                store(escrow);
            });

            await approve(escrowContract, signer);
        }
        setEscrows([...escrows, escrow]);
        store(escrow);
    }

    return (
        <>
            <div className="container">
                <div className="Header">
                    <h1>Larry's triptastic Escrow service</h1>
                    <p>Trust us! After all, its all on-chain.</p>
                </div>
                <div className="readme">
                    <h1>Instructions</h1>
                    <div>
                        <ol>
                            <li>The depositor / purchaser should log in with their Web3 wallet</li>
                            <li>They enter in the details -
                                <ol>
                                    <li>The Arbiter is who will coordinate and approve the transfer of money and
                                        goods.
                                    </li>
                                    <li>The beneficiary is who is selling their goods and receiving the deposit /
                                        payment.
                                    </li>
                                    <li>The deposit amount is in Ethereum. (Coming! Deposit from a larger seelction of
                                        cryptocurrencies).
                                    </li>
                                </ol>
                            </li>
                            <li>...and hit deposit</li>
                            <li>The Arbiter logs in with their Web3 wallet to confirm the deposit and coordinate the
                                physical transfer of the goods being sold.
                            </li>
                            <li>Once happy they hit approve and the funds will be transferred to the beneficiary /
                                seller.
                            </li>
                            <li>The Arbiter can see all deposits waiting for approval and a historical list of those
                                they have already approved.
                            </li>
                            <li>They can hit the <code>delete</code> button to remove from the list.</li>
                        </ol>
                    </div>
                </div>
                <div className="contract">
                    <h1> New Contract </h1>
                    <label>
                        Arbiter Address
                        <input type="text" id="arbiter"/>
                    </label>

                    <label>
                        Beneficiary Address
                        <input type="text" id="beneficiary"/>
                    </label>

                    <label>
                        Deposit Amount (in ETH)
                        <input type="text" id="eth"/>
                    </label>

                    <div
                        className="button"
                        id="deploy"
                        onClick={(e) => {
                            e.preventDefault();

                            newContract();
                        }}
                    >
                        Deploy
                    </div>
                </div>

                <div className="existing-contracts">
                    <h1> Existing Contracts </h1>

                    <div id="container">
                        {escrows.map((escrow) => {
                            return <Escrow key={escrow.address} {...escrow} />;
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
