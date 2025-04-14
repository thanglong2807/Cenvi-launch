'use client'

import Label from '@/components/form/Label'
import Select from '@/components/form/Select'
import Button from '@/components/ui/button/Button'
import { useEffect, useState } from 'react'


interface Option {
  value: string
  label: string
}
interface AddressPageProps {
    onClose: () => void;
    setStep: (step: number) => void;
    currentStep: number; // Optional
  }

export default function Addressform({ onClose, setStep, currentStep }:AddressPageProps) {
  const [provinces, setProvinces] = useState<Option[]>([])
  const [districts, setDistricts] = useState<Option[]>([])
  const [wards, setWards] = useState<Option[]>([])

  const [selectedCity, setSelectedCity] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedWard, setSelectedWard] = useState('')
  const [address, setAddress] = useState('')

  useEffect(() => {
    const fetchProvinces = async () => {
      const cached = localStorage.getItem('provincesData')
      if (cached) {
        setProvinces(JSON.parse(cached).map((p: any) => ({ value: p.code, label: p.name })))
        return
      }

      try {
        const res = await fetch('https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1')
        await new Promise(resolve => setTimeout(resolve, 500))
        const json = await res.json()
        const data = json.data.data
        const formatted = data.map((p: any) => ({ value: p.code, label: p.name }))
        setProvinces(formatted)
        localStorage.setItem('provincesData', JSON.stringify(data))
      } catch (error) {
        console.error('Lỗi khi tải danh sách tỉnh:', error)
      }
    }

    fetchProvinces()
  }, [])

  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedCity) return
      try {
        const res = await fetch(`https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${selectedCity}&limit=-1`)
        await new Promise(resolve => setTimeout(resolve, 500))
        const json = await res.json()
        const data = json.data.data
        const formatted = data.map((d: any) => ({ value: d.code, label: d.name }))
        setDistricts(formatted)
      } catch (error) {
        console.error('Lỗi khi tải danh sách quận/huyện:', error)
      }
    }

    setDistricts([])
    setWards([])
    fetchDistricts()
  }, [selectedCity])

  useEffect(() => {
    const fetchWards = async () => {
      if (!selectedDistrict) return
      try {
        const res = await fetch(`https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${selectedDistrict}&limit=-1`)
        await new Promise(resolve => setTimeout(resolve, 500))
        const json = await res.json()
        const data = json.data.data
        const formatted = data.map((w: any) => ({ value: w.code, label: w.name }))
        setWards(formatted)
      } catch (error) {
        console.error('Lỗi khi tải danh sách phường/xã:', error)
      }
    }

    setWards([])
    fetchWards()
  }, [selectedDistrict])

  useEffect(() => {
    const saved = {
      city: selectedCity,
      district: selectedDistrict,
      ward: selectedWard,
      address
    }
    localStorage.setItem('companyAddress', JSON.stringify(saved))
  }, [selectedCity, selectedDistrict, selectedWard, address])

  const fetchDistricts = async (provinceCode: string) => {
  if (!provinceCode) return []
  const res = await fetch(
    `https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${provinceCode}&limit=-1`
  )
  const json = await res.json()
  return json?.data?.data || []
}

const fetchWards = async (districtCode: string) => {
  if (!districtCode) return []
  const res = await fetch(
    `https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${districtCode}&limit=-1`
  )
  const json = await res.json()
  return json?.data?.data || []
}

  const handleNext = () => {
    if (!selectedCity || !selectedDistrict || !selectedWard || !address.trim()) {
      alert('Vui lòng điền đầy đủ thông tin địa chỉ!')
      return
    }

    const provinceName = provinces.find(p => p.value === selectedCity)?.label || ''
    const districtName = districts.find(d => d.value === selectedDistrict)?.label || ''
    const wardName = wards.find(w => w.value === selectedWard)?.label || ''

    const existing = localStorage.getItem('companyData')
    const companyData = existing ? JSON.parse(existing) : {}

    companyData.companyAddress = {
      city: provinceName,
      district: districtName,
      ward: wardName,
      address: address.trim()
    }

    localStorage.setItem('companyData', JSON.stringify(companyData))
    
  }

  return (
    <>
      <div className='flex justify-between'>
                    <h3 className=' text-xl '>Địa chỉ doanh nghiệp ( Bước {currentStep} )</h3>
                 
                </div>

      <div className="mb-4">
        <Label className="mb-1 block text-sm font-medium">Tỉnh / Thành phố</Label>
        <Select 
        className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700' 
          options={provinces}
          placeholder="Chọn tỉnh/thành phố"
          onChange={setSelectedCity}
          defaultValue={selectedCity}
        />
      </div>

      <div className="mb-4">
        <Label className="mb-1 block text-sm font-medium">Quận / Huyện</Label>
        <Select 
        className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700' 
          options={districts}
          placeholder="Chọn quận/huyện"
          onChange={setSelectedDistrict}
          defaultValue={selectedDistrict}
        />
      </div>

      <div className="mb-4">
        <Label className="mb-1 block text-sm font-medium">Phường / Xã</Label>
        <Select
        className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700' 
          options={wards}
          placeholder="Chọn phường/xã"
          onChange={setSelectedWard}
          defaultValue={selectedWard}
        />
      </div>

      <div className="mb-4">
        <Label className="mb-1 block text-sm font-medium">Địa chỉ chi tiết</Label>
        <input
          type="text"
          className="w-full rounded border px-3 py-2 text-sm"
          placeholder="Số nhà, tên đường..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
<div className='flex gap-5'>
                <Button  onClick={()=>setStep(2)} className='mt-4 w-full' >  Back</Button>
      <Button onClick={()=>setStep(4)} className='mt-4 w-full' >  Next</Button>

</div>
    </>
  )
}
