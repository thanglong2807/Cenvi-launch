'use client'

import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { useState, useEffect } from 'react'
interface BusinessCodePageProps {
    onClose: () => void;
    setStep: (step: number) => void;
    currentStep: number; // Optional
}
interface BusinessCode {
  code: string
  title: string
  isRestricted: boolean
}

export default function BusinessCodePage({ onClose, setStep, currentStep }:BusinessCodePageProps) {
  const [codeInput, setCodeInput] = useState('')
  const [businessCodes, setBusinessCodes] = useState<BusinessCode[]>([])

  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem('companyData') || '{}')
    if (existing.businessCodes) {
      setBusinessCodes(existing.businessCodes)
    }
  }, [])

  const mockBusinessCodeLookup = (code: string): BusinessCode => {
    // 🔎 Giả lập tra cứu mã ngành
    return {
      code,
      title: `Ngành nghề ${code}`,
      isRestricted: code.endsWith('4') // ví dụ: mã kết thúc bằng 4 là ngành có điều kiện
    }
  }

  const handleAddCode = () => {
    if (!codeInput.trim()) return

    const existing = businessCodes.find((b) => b.code === codeInput)
    if (existing) return alert('Mã ngành đã tồn tại')

    const newCode = mockBusinessCodeLookup(codeInput.trim())
    const updatedList = [...businessCodes, newCode]
    setBusinessCodes(updatedList)

    const current = JSON.parse(localStorage.getItem('companyData') || '{}')
    localStorage.setItem(
      'companyData',
      JSON.stringify({ ...current, businessCodes: updatedList })
    )

    setCodeInput('')
  }

  const handleRemoveCode = (code: string) => {
    const updatedList = businessCodes.filter((b) => b.code !== code)
    setBusinessCodes(updatedList)

    const current = JSON.parse(localStorage.getItem('companyData') || '{}')
    localStorage.setItem(
      'companyData',
      JSON.stringify({ ...current, businessCodes: updatedList })
    )
  }

  return (
    <div className="p-6 max-w-md mx-auto">
        <div className='flex justify-between'>
                <h3 className=' text-xl '>Mã ngành nghề  ( Bước {currentStep} )</h3>
                <Button
                    onClick={onClose}
                    className=" text-gray-600 hover:text-black"
                >
                    ✕
                </Button>
            </div>
      <label className="block font-medium mb-2">Nhập Mã ngành nghề</label>
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          className="flex-1 border rounded w-[316px] px-3 py-2"
          defaultValue={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
          placeholder="Nhập mã ngành"
        />
        <Button
          onClick={handleAddCode}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Thêm
        </Button>
      </div>

      <div className="bg-gray-200 p-4 rounded space-y-4">
        {businessCodes.map((item) => (
          <div key={item.code} className="flex justify-between items-start bg-white p-3 rounded shadow">
            <div>
              <p className="font-semibold">{item.code} {item.title}...</p>
              {item.isRestricted && (
                <p className="text-sm text-red-600 mt-1">Lưu ý: ngành nghề kinh doanh có điều kiện</p>
              )}
            </div>
            <Button
              onClick={() => handleRemoveCode(item.code)}
              className="text-red-600 font-bold text-lg px-2"
            >
              ×
            </Button>
          </div>
        ))}
        {businessCodes.length === 0 && <p className="text-gray-500">Chưa có mã ngành nào</p>}
      </div>
      <div className='flex gap-5'>
        <Button onClick={() => setStep(3)} className='mt-4 w-full' >  Back</Button>
        <Button onClick={()=>setStep(0)} className='mt-4 w-full' >  Next</Button>
      </div>
    </div>
  )
}
