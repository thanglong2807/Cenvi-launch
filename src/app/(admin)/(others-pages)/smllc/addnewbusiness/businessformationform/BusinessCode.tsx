'use client'

import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { useState, useEffect, useRef } from 'react'
interface BusinessCodePageProps {

  setStep: (step: number) => void;
  currentStep: number; // Optional
}
interface BusinessCode {
  code: string
  title: string
  isRestricted: boolean
}

interface IndustryItem {
  name: string
  code: string
}

interface IndustryResponse {
  total: number
  level: number
  data: IndustryItem[]
}

export default function BusinessCodePage({  setStep, currentStep }: BusinessCodePageProps) {
  const [businessCodes, setBusinessCodes] = useState<BusinessCode[]>([])
  const [industries, setIndustries] = useState<IndustryItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ONRENDER}industry/4`)
        if (!response.ok) {
          throw new Error('Failed to fetch industries')
        }
        const data: IndustryResponse = await response.json()
        setIndustries(data.data)
      } catch (error) {
        console.error('Error fetching industries:', error)
      }
    }
    fetchIndustries()

    const existing = JSON.parse(localStorage.getItem('companyData') || '{}')
    if (existing.businessCodes) {
      setBusinessCodes(existing.businessCodes)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const filteredIndustries = industries.filter(industry =>
    industry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    industry.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setShowDropdown(true)
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
        <h3 className='text-xl'>Mã ngành nghề (Bước {currentStep})</h3>
      </div>
      <div>
        <label className="block font-medium mb-2">Nhập Mã ngành nghề</label>
        <div className="flex gap-2 mb-4">
          <div className="flex-1" ref={dropdownRef}>
            <div onClick={() => setShowDropdown(true)}>
              <Input
                type="text"
                className="w-full border rounded px-3 py-2 mb-2"
                defaultValue={searchTerm}
                onChange={handleSearchChange}
                placeholder="Tìm kiếm ngành nghề..."
              />
            </div>
            {showDropdown && (
              <div className='relative'>
                <ul className='w-[380px] h-[300px] overflow-y-auto absolute top-0 left-0 bg-white border rounded shadow-lg z-10'>
                  {filteredIndustries.length > 0 ? (
                    filteredIndustries.map((industry, index) => (
                      <li
                        className='w-full px-3 py-2 hover:bg-gray-100 cursor-pointer'
                        key={index}
                        onClick={() => {
                          const existing = businessCodes.find((b) => b.code === industry.code)
                          if (existing) {
                            alert('Mã ngành đã tồn tại')
                            return
                          }

                          const newCode: BusinessCode = {
                            code: industry.code,
                            title: industry.name,
                            isRestricted: false
                          }

                          const updatedList = [...businessCodes, newCode]
                          setBusinessCodes(updatedList)

                          const current = JSON.parse(localStorage.getItem('companyData') || '{}')
                          localStorage.setItem(
                            'companyData',
                            JSON.stringify({ ...current, businessCodes: updatedList })
                          )

                          setSearchTerm('')
                          setShowDropdown(false)
                        }}
                      >
                        {industry.code} - {industry.name}
                      </li>
                    ))
                  ) : (
                    <li className='w-full px-3 py-2 text-gray-500'>
                      Không tìm thấy ngành nghề phù hợp
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-200 p-4 rounded space-y-4">
          {businessCodes.map((item) => (
            <div key={item.code} className="flex justify-between items-start bg-white p-3 rounded shadow">
              <div>
                <p className="font-semibold">{item.code} {item.title}</p>
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
      </div>
      <div className='flex gap-5 mt-4'>
        <Button onClick={() => setStep(3)} className='w-full'>Back</Button>
        <Button onClick={() => setStep(0)} className='w-full'>Next</Button>
      </div>
    </div>
  )
}
