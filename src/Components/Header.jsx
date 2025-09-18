import Sidebar from './Sidebar'
import {Menu} from 'lucide-react'
import Theme from './Theme'
import socialLinks from '../Content/socialLinks.json';


function SocialLinksComponent() {
  return (
    <div className="flex gap-2 ml-auto">
      {socialLinks.map((social, index) => (
        <a 
          key={index}
          className="link btn btn-ghost btn-circle p-2" 
          href={social.link}
        >
          <img 
            src={social.img} 
            className="size-8" 
            alt={social.alt} 
          />
        </a>
      ))}
    </div>
  );
}
function Header () {
 return (
    <header className='bg-base-100 shadow-md flex items-baseline p-2 w-screen absolute top-0 z-5 justify-baseline gap-4 content-baseline'>
          <Sidebar drawer={<Menu/>} active=""/>
      <h1 className='font-mono text-4xl min-w-fit'>Manas Doshi </h1>
  <SocialLinksComponent/>      

<Theme size={32} className="p-5 cursor-pointer"/>
    </header>
  )
}

export default Header
