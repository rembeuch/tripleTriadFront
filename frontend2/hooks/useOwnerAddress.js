import { useState, useEffect } from "react";

const useOwnerAddress = (address, contract) => {
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        getOwnerAddress()
    }, [address, contract]);

    const getOwnerAddress = async () => {
        if (!contract) return;

        const ownerAddress = await contract.owner();
        address === ownerAddress ? setIsOwner(true) : setIsOwner(false);
    }

    return [isOwner];
};

export default useOwnerAddress;