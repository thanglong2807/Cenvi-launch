import React from 'react'
import Image from 'next/image'
function Status({status}: {status:string}) {
    if (status==="hủy") {
        return (
          <div className='flex justify-end '>
            <div className='relative'>
              <Image src="/images/icons/cancelled.svg" alt="cancelled" width={146} height={40} />
              <span className='absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center'>Đã hủy</span>
            </div>
          </div>
        )
    }
    if (status==='chưa hoàn thành') {
        return (
            <div className='flex justify-end '>
            <div className='relative'>
              <Image src="/images/icons/succes.svg" alt="cancelled" width={146} height={40} />
              <span className='absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center text-amber-700 text-sm font-medium'>Chưa thanh toán</span>
            </div>
          </div>
        )
    }
    if (status==='hồ sơ mới') {
        return (
          <div className='flex justify-end items-center'>
            <div className='flex items-center justify-end '>
            <div className='relative'>
              <Image src="/images/icons/ArrowStepper.svg" className="" alt="cancelled" width={146} height={40} />
              <span className='absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center text-amber-700 text-sm font-medium'>Hồ sơ mới</span>
            </div>
          </div>
          <div className='flex items-center justify-end '>
            <div className='relative'>
              <Image src="/images/icons/ArrowStepper2.svg" alt="cancelled" width={150} height={50} />
              <span className='absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center  text-zinc-800 text-sm font-medium'>Chỉnh sửa bổ sung</span>
            </div>
          </div>
          <div className='flex items-center justify-end '>
            <div className='relative'>
              <Image src="/images/icons/ArrowStepper2.svg" alt="cancelled" width={150} height={50} />
              <span className='absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center   text-zinc-800 text-sm font-medium'>Nhận hồ sơ giấy</span>
            </div>
          </div>
          <div className='flex  items-center justify-end '>
            <div className='relative'>
              <Image src="/images/icons/ArrowStepper2.svg" alt="cancelled" width={150} height={50} />
              <span className='absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center   text-zinc-800 text-sm font-medium'>Chuyển cho CQNN</span>
            </div>
          </div>
          <div className='flex items-center justify-end '>
            <div className='relative'>
              <Image src="/images/icons/ArrowStepper3.svg" alt="cancelled" width={150} height={50} />
              <span className='absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center   text-zinc-800 text-sm font-medium'>Hoàn thành</span>
            </div>
          </div>
          </div>
        )
    }

}

export default Status