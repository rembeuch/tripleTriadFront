import { Flex, Text } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { ethers } from 'ethers'
import { contractAddress, abi } from "../../public/constants"
import { useAccount, useSigner, useProvider } from 'wagmi'
import { useState, useEffect } from 'react';
import useOwnerAddress from "../../hooks/useOwnerAddress";




const Header = () => {
    const { data: signer } = useSigner()
    const provider = useProvider()
    const contract = new ethers.Contract(contractAddress, abi, provider)
    const [balance, setBalance] = useState()
    const { address, isConnected } = useAccount()
    const [isOwner] = useOwnerAddress(address, contract);


    useEffect(() => {
        getBalance()
    }, [balance]);

    const getBalance = async () => {
        const contract = new ethers.Contract(contractAddress, abi, provider)

        const balance = await provider.getBalance(contractAddress)
        setBalance(ethers.utils.formatEther(balance))

    }


    const withdraw = async () => {
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            await contract.withdraw()
            setBalance(0)
            // router.push('/getNumber')

        }
        catch (e) {
            console.log(e.reason)
        }
    }



    return (
        <Flex justifyContent="space-between" alignItems="center" height="10vh" width="100%" p="2rem">
            <Text fontWeight="bold">Logo</Text>
            {isOwner ? (<button className='withdraw' onClick={withdraw}>WITHDRAW {balance} eth</button>) : ("")}
            <Flex width="30%" justifyContent="space-between" alignItems="center">
                <Text
                    fontWeight="bold"
                    sx={{
                        ':hover': {
                            textDecoration: 'underline',
                        },
                    }}
                >
                    <Link href="/" passHref>
                        Home
                    </Link>
                </Text>
            </Flex>
            <ConnectButton />
        </Flex>
    )
}

export default Header;