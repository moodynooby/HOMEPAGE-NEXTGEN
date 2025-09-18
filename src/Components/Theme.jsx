import {Citrus, Angry} from 'lucide-react'

function Theme ({size}) {

  return (
<label className="swap swap-rotate ">
  {/* this hidden checkbox controls the state */}
  <input type="checkbox" className="theme-controller" value="lemonade" />

  {/* sun icon */}
  <Angry     className="swap-off" size={size}/>

  {/* moon icon */}
  <Citrus     className="swap-on "size={size}/>
</label>  
)
}

export default Theme

