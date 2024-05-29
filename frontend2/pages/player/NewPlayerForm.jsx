import React, { useState } from 'react'
import { useAccount, useProvider, useSigner } from 'wagmi'
import { useRouter } from 'next/router';


const NewPlayerForm = () => {
    const router = useRouter();
    const { address, isConnected } = useAccount()
    const [name, setName] = useState("")


    const handleCreateSubmit = async (e) => {
        e.preventDefault()
        const wallet_address = address
        const playerData = { name, wallet_address }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/players`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(playerData),
                }
            );
        if  (response.ok) {
            const responseData = await response.json();
            const playerId = responseData.id;
            router.push(`/player/${playerId}`)
        }
       
    };


    return (
        <form
            onSubmit={handleCreateSubmit}
        >
            <div>
                <label htmlFor="title">Name:</label>
                <input style={{ border: "1px solid black" }}
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                    }
                    }
                />
            </div>

            <div>
                <button style={{
                    color: "#F9DC5C",
                    backgroundColor: "green",
                    padding: 10,
                    margin: 10,
                    transition: "background-color 0.3s ease",
                    borderRadius: 5,
                    textDecoration: "none"
                }} type="submit">Create Player</button>
            </div>
        </form>
    )
}

export default NewPlayerForm