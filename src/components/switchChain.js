import { Button } from 'react-bootstrap';
//import { Base } from "@thirdweb-dev/chains";
import { useSwitchChain } from "@thirdweb-dev/react";
const SwitchChain = (chain) =>{
    const chainId = chain.chain.chainId*1
    /**DEV:
     * to hex is a helper function that convert the chainId '1' and converst it in to the hex valie 0x01
     * to be able to correnlthy handle the change of chains
     */
    function toHex(num) {
        if(num.toString(16).length===1){
            return '0x0' + num.toString(16)
        }else{
            return '0x' + num.toString(16)
        }
    }
    const switchChain = useSwitchChain();
    return(
        <Button onClick={() => switchChain(toHex(chainId))}
                className="w-100" 
                style={{
                    padding: "1rem",
                    fontSize: "1.5rem",
                    backgroundColor: "#F26E01", // Mango orange
                    borderColor: "#FFA500", // Match the border color
                    color: "#FFFFFF", // White text for contrast
                }}>
                  {`Cambiar red a ${chain.chain.chainName}`}
                </Button>
    );

}
export default SwitchChain;