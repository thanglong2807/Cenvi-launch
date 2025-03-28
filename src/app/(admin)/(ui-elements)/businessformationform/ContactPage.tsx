// app/contact/page.tsx
'use client'

import { useState } from 'react'
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
interface ContactPageProps {
    onClose: () => void;
    setStep: (step: number) => void;
    currentStep: number; // Optional
}
export default function ContactPage({ onClose, setStep, currentStep }: ContactPageProps) {

    const [phone, setPhone] = useState('')
    const [fax, setFax] = useState('')
    const [email, setEmail] = useState('')
    const [website, setWebsite] = useState('')
    const [phoneError, setPhoneError] = useState('')
    const [emailError, setEmailError] = useState('')
    const handleNextClick = () => {
        setStep(3);
    };


    const handleSubmit = () => {
        let isValid = true

        if (!phone) {
            setPhoneError('Vui lòng nhập số điện thoại')
            isValid = false
        } else {
            setPhoneError('')
        }

        if (!email) {
            setEmailError('Vui lòng nhập email công ty')
            isValid = false
        } else {
            setEmailError('')
        }

        if (isValid) {
            alert('Thông tin đã được gửi!')
            // Xử lý dữ liệu tại đây
        }
    }

    return (
        <>
            <div className='flex justify-between'>
                <h3 className=' text-xl '>Nhập thông tin doanh nghiệp ( Bước {currentStep} )</h3>
                <Button
                    onClick={onClose}
                    className=" text-gray-600 hover:text-black"
                >
                    ✕
                </Button>
            </div>

            <div className=''>
                <Label htmlFor='phone'>Số điện thoại Công ty </Label>
                <Input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    type="text"
                    id="phone"
                    placeholder="Nhập số điện thoại"
                    defaultValue={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                {phoneError && <div className=''>{phoneError}</div>}
            </div>

            <div className=''>
                <Label htmlFor='fax'>FAX (nếu có)</Label>
                <Input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    type="text"
                    id="fax"
                    placeholder="Nhập số fax"
                    defaultValue={fax}
                    onChange={(e) => setFax(e.target.value)}
                />
            </div>

            <div className=''>
                <Label htmlFor='email'>Email Công ty <span className=''>*</span></Label>
                <Input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    type="email"
                    id="email"
                    placeholder="Nhập email công ty"
                    defaultValue={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && <div className=''>{emailError}</div>}
            </div>

            <div className=''>
                <Label htmlFor='website'>Website (nếu có)</Label>
                <Input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    type="text"
                    id="website"
                    placeholder="Nhập website"
                    defaultValue={website}
                    onChange={(e) => setWebsite(e.target.value)}
                />
            </div>
            <div className='flex gap-5'>

                <Button onClick={() => setStep(1)} className='mt-4 w-full' >  Back</Button>
                <Button onClick={() => setStep(3)} className='mt-4 w-full' >  Next</Button>
            </div>
        </>
    )
}
