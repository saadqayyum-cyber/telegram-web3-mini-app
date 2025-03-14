import { ConnectWallet} from "@thirdweb-dev/react";
import { Container,Navbar} from 'react-bootstrap';
import MangoLogo from '../imgs/Mango.png';
import Client from '../client';

const Header = ()=>{
    return(
        <Navbar bg="light" expand="lg">
        <Container> 
           {/* Make the logo clickable */}
              <img
                src={MangoLogo}
                width="50"
                height="50"
                alt="Mango Logo"
                style={{ cursor: "pointer" }}
              />
          <div className="ml-auto">
          <ConnectWallet  client={Client}/>
          {/**console.log(connectionsStatus)retrn=> connected || disconnected */}
          </div>
        </Container>
      </Navbar>
    )

}
export default Header;