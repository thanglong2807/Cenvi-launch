'use client'

import { useState } from 'react'
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';

interface AccountantPageProps {
    onClose: () => void;
    setStep: (step: number) => void;
    currentStep: number; // Optional
}

export default function AccountantPage({ onClose, setStep, currentStep }: AccountantPageProps) {

    const [accountantName, setAccountantName] = useState('')
    const [accountantPhone, setAccountantPhone] = useState('')
    const [phoneError, setPhoneError] = useState('')

    const validateForm = () => {
        const phoneRegex = /^(0|\+84)[0-9]{9}$/ // bạn có thể chỉnh sửa theo format VN
        if (accountantPhone && !phoneRegex.test(accountantPhone)) {
            setPhoneError('Số điện thoại không hợp lệ')
            return
        }

        setPhoneError('')
        const data = {
            accountant: {
                name: accountantName,
                phone: accountantPhone
            }
        }

        const existing = JSON.parse(localStorage.getItem('companyData') || '{}')
        const updated = { ...existing, ...data }

        localStorage.setItem('companyData', JSON.stringify(updated))
        setStep(7)

    }

    return (
        <div className=' min-h-[100%]' >
            <div className='flex justify-between'>
                <h3 className=' text-xl '>Thông tin Cổ đông góp vốn  ( Bước {currentStep} )</h3>
                <Button
                    onClick={onClose}
                    className=" text-gray-600 hover:text-black"
                >
                    ✕
                </Button>
            </div>
            <div className='content-center h-full'>
                <div>
                    <Label>Họ và tên Người Phụ trách kế toán/Kế toán trưởng (Không bắt buộc)</Label>
                    <Input
                        type="text"
                        id="accountantName"
                        placeholder="Nhập họ và tên"
                        defaultValue={accountantName}
                        onChange={(e) => setAccountantName(e.target.value)}
                    />
                </div>

                <div >
                    <Label>Số điện thoại</Label>
                    <Input
                        type="text"
                        id="accountantPhone"
                        placeholder="Nhập số điện thoại"
                        defaultValue={accountantPhone}
                        onChange={(e) => setAccountantPhone(e.target.value)}
                    />
                    {phoneError && <div className="error" id="phoneError">{phoneError}</div>}
                </div>

                <div className='flex gap-5'>
                    <Button onClick={() => setStep(4)} className='mt-4 w-full' >  Back</Button>
                    <Button onClick={validateForm} className='mt-4 w-full' >  Next</Button>
                </div>
            </div>
        </div>
    )
}
