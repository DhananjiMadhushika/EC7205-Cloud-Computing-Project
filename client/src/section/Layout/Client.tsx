import { ReactNode} from 'react'
import Footer from '../Footer';
import Navbar from '../Navbar/ClientNav';

type LayoutCProps = {
  children : ReactNode;
}

const LayoutC = ({ children} : LayoutCProps) => {

    return (
      <div
        className={`flex flex-col w-full justify-center bg-white mb-16 md:mb-0 `}
      >
        <div className="flex flex-col w-full h-auto min-h-screen overflow-hidden ">
          
          <Navbar/>
  
          <main>{children}</main>
  
          <Footer/>
        </div>
      </div>
    );
  };
  
  export default LayoutC;
  