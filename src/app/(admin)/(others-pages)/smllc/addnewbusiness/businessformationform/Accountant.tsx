'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';

interface AccountantPageProps {
    setStep: (step: number) => void;
    currentStep: number;
}

interface AccountantData {
    accountant: {
        name: string;
        phone: string;
    };
}

export default function AccountantPage({ setStep, currentStep }: AccountantPageProps) {
    const [accountantName, setAccountantName] = useState<string>('')
    const [accountantPhone, setAccountantPhone] = useState<string>('')
    const [phoneError, setPhoneError] = useState<string>('')
    const [isFormValid, setIsFormValid] = useState<boolean>(false)

    useEffect(() => {
        const phoneRegex = /^(0|\+84)[0-9]{9}$/
        const isValid = !accountantPhone || phoneRegex.test(accountantPhone)
        setPhoneError(isValid ? '' : 'Số điện thoại không hợp lệ')
        setIsFormValid(isValid)
    }, [accountantPhone])

    const handleSubmit = () => {
        if (!isFormValid) return

        const data: AccountantData = {
            accountant: {
                name: accountantName,
                phone: accountantPhone
            }
        }

        try {
            const existingData = localStorage.getItem('companyData')
            const existing = existingData ? JSON.parse(existingData) : {}
            const updated = { ...existing, ...data }
            localStorage.setItem('companyData', JSON.stringify(updated))
            setStep(7)
        } catch (error) {
            console.error('Error saving accountant data:', error)
        }
    }

    return (
        <div className="p-6 max-w-md mx-auto">
            <div className="flex justify-between mb-6">
                <h3 className="text-xl">Thông tin Kế toán (Bước {currentStep})</h3>
            </div>
            
            <div className="space-y-4">
                <div>
                    <Label htmlFor="accountantName">Họ và tên Người Phụ trách kế toán/Kế toán trưởng (Không bắt buộc)</Label>
                    <Input
                        type="text"
                        id="accountantName"
                        name="accountantName"
                        placeholder="Nhập họ và tên"
                        defaultValue={accountantName}
                        onChange={(e) => setAccountantName(e.target.value)}
                        className="w-full"
                    />
                </div>

                <div>
                    <Label htmlFor="accountantPhone">Số điện thoại</Label>
                    <Input
                        type="text"
                        id="accountantPhone"
                        name="accountantPhone"
                        placeholder="Nhập số điện thoại"
                        defaultValue={accountantPhone}
                        onChange={(e) => setAccountantPhone(e.target.value)}
                        className="w-full"
                        error={!!phoneError}
                    />
                    {phoneError && <div className="text-red-500 text-sm mt-1">{phoneError}</div>}
                </div>
            </div>

            <div className="flex gap-4 mt-6">
                <Button onClick={() => setStep(4)} className="w-full">Back</Button>
                <Button 
                    onClick={handleSubmit} 
                    className="w-full"
                    disabled={!isFormValid}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
