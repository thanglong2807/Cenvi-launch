import React from 'react'

function Container({children}: {children: React.ReactNode}) {
  return (
    <div className="px-6 py-4 pb-8 min-h-[calc(100vh-147px)]  bg-[#fff] flex flex-col justify-between">
        {children}
    </div>
  )
}

export default Container