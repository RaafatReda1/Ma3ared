import React from 'react'
import manLoad from '../../assets/man-loader-GEMINI-GENERATE.jpg'
import PocketWatchReactComponent from '../PocketWatch/PocketWatchReactComponent'


function manLoade() {
  return (
    <div className='flex relative w-full h-full'>
        
        <img src={manLoad} className=' w-full h-full object-cover ' alt="" />
        <PocketWatchReactComponent/>

    </div>
  )
}

export default manLoade