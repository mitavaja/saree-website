import React from 'react';

const Title = ({ text1, text2 }) => {
  return (
    <div className='inline-flex gap-3 items-center mb-3 justify-center'>
      <p className='text-[#ecc153] tracking-widest'>
        {text1}
        <span className='text-[#082e21] font-medium tracking-widest'> {text2}</span>
      </p>
      <p className='w-12 h-[2px] bg-[#082e21]'></p>
    </div>
  )
}

export default Title;