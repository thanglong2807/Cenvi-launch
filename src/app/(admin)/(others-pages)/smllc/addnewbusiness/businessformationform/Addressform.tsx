'use client'

import Label from '@/components/form/Label'
import Select from '@/components/form/Select'
import Button from '@/components/ui/button/Button'
import { useEffect, useState } from 'react'
import Input from '@/components/form/input/InputField'

interface Option {
  value: string
  label: string
}

interface AddressPageProps {
  setStep: (step: number) => void
  currentStep?: number
}

interface Province {
  code: string
  name: string
}

interface District {
  code: string
  name: string
}

interface Ward {
  code: string
  name: string
}

interface AddressData {
  city: string
  district: string
  ward: string
  address: string
}

export default function Addressform({ setStep, currentStep }: AddressPageProps) {
  const [provinces, setProvinces] = useState<Option[]>([])
  const [districts, setDistricts] = useState<Option[]>([])
  const [wards, setWards] = useState<Option[]>([])

  const [selectedCity, setSelectedCity] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedWard, setSelectedWard] = useState('')
  const [address, setAddress] = useState('')

  const [isLoading, setIsLoading] = useState({
    provinces: false,
    districts: false,
    wards: false
  })
  const [error, setError] = useState({
    provinces: '',
    districts: '',
    wards: '',
    address: ''
  })

  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoading(prev => ({ ...prev, provinces: true }))
      setError(prev => ({ ...prev, provinces: '' }))
      
      const cached = localStorage.getItem('provincesData')
      if (cached) {
        try {
          const parsedData: Province[] = JSON.parse(cached)
          setProvinces(parsedData.map((p: Province) => ({ value: p.code, label: p.name })))
        } catch {
          setError(prev => ({ ...prev, provinces: 'Lỗi khi đọc dữ liệu từ cache' }))
        }
        setIsLoading(prev => ({ ...prev, provinces: false }))
        return
      }

      try {
        const res = await fetch('https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1')
        await new Promise(resolve => setTimeout(resolve, 500))
        const json = await res.json()
        const data: Province[] = json.data.data
        const formatted = data.map((p: Province) => ({ value: p.code, label: p.name }))
        setProvinces(formatted)
        localStorage.setItem('provincesData', JSON.stringify(data))
      } catch (error) {
        setError(prev => ({ ...prev, provinces: 'Lỗi khi tải danh sách tỉnh' }))
        console.error('Lỗi khi tải danh sách tỉnh:', error)
      } finally {
        setIsLoading(prev => ({ ...prev, provinces: false }))
      }
    }

    fetchProvinces()
  }, [])

  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedCity) {
        setDistricts([])
        setWards([])
        return
      }

      setIsLoading(prev => ({ ...prev, districts: true }))
      setError(prev => ({ ...prev, districts: '' }))

      try {
        const res = await fetch(`https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${selectedCity}&limit=-1`)
        await new Promise(resolve => setTimeout(resolve, 500))
        const json = await res.json()
        const data: District[] = json.data.data
        const formatted = data.map((d: District) => ({ value: d.code, label: d.name }))
        setDistricts(formatted)
      } catch (error) {
        setError(prev => ({ ...prev, districts: 'Lỗi khi tải danh sách quận/huyện' }))
        console.error('Lỗi khi tải danh sách quận/huyện:', error)
      } finally {
        setIsLoading(prev => ({ ...prev, districts: false }))
      }
    }

    setDistricts([])
    setWards([])
    fetchDistricts()
  }, [selectedCity])

  useEffect(() => {
    const fetchWards = async () => {
      if (!selectedDistrict) {
        setWards([])
        return
      }

      setIsLoading(prev => ({ ...prev, wards: true }))
      setError(prev => ({ ...prev, wards: '' }))

      try {
        const res = await fetch(`https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${selectedDistrict}&limit=-1`)
        await new Promise(resolve => setTimeout(resolve, 500))
        const json = await res.json()
        const data: Ward[] = json.data.data
        const formatted = data.map((w: Ward) => ({ value: w.code, label: w.name }))
        setWards(formatted)
      } catch (error) {
        setError(prev => ({ ...prev, wards: 'Lỗi khi tải danh sách phường/xã' }))
        console.error('Lỗi khi tải danh sách phường/xã:', error)
      } finally {
        setIsLoading(prev => ({ ...prev, wards: false }))
      }
    }

    setWards([])
    fetchWards()
  }, [selectedDistrict])

  const handleNext = () => {
    if (!selectedCity || !selectedDistrict || !selectedWard || !address.trim()) {
      setError(prev => ({
        ...prev,
        address: !address.trim() ? 'Vui lòng nhập địa chỉ chi tiết' : ''
      }))
      return
    }

    const provinceName = provinces.find(p => p.value === selectedCity)?.label || ''
    const districtName = districts.find(d => d.value === selectedDistrict)?.label || ''
    const wardName = wards.find(w => w.value === selectedWard)?.label || ''

    const data: AddressData = {
      city: provinceName,
      district: districtName,
      ward: wardName,
      address: address.trim()
    }

    try {
      const existing = localStorage.getItem('companyData')
      const companyData = existing ? JSON.parse(existing) : {}
      companyData.companyAddress = data
      localStorage.setItem('companyData', JSON.stringify(companyData))
      setStep(4)
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error)
    }
  }

  const isFormValid = selectedCity && selectedDistrict && selectedWard && address.trim()

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className='flex justify-between mb-6'>
        <h3 className='text-xl'>Địa chỉ doanh nghiệp (Bước {currentStep})</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="block text-sm font-medium mb-2">Tỉnh / Thành phố</Label>
          <div className={`relative ${isLoading.provinces ? 'opacity-50' : ''}`}>
            <Select 
              className='w-full'
              options={provinces}
              placeholder="Chọn tỉnh/thành phố"
              onChange={setSelectedCity}
              defaultValue={selectedCity}
            />
            {isLoading.provinces && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
              </div>
            )}
          </div>
          {error.provinces && <div className="text-red-500 text-sm mt-1">{error.provinces}</div>}
        </div>

        <div>
          <Label className="block text-sm font-medium mb-2">Quận / Huyện</Label>
          <div className={`relative ${isLoading.districts || !selectedCity ? 'opacity-50' : ''}`}>
            <Select 
              className='w-full'
              options={districts}
              placeholder="Chọn quận/huyện"
              onChange={setSelectedDistrict}
              defaultValue={selectedDistrict}
            />
            {isLoading.districts && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
              </div>
            )}
          </div>
          {error.districts && <div className="text-red-500 text-sm mt-1">{error.districts}</div>}
        </div>

        <div>
          <Label className="block text-sm font-medium mb-2">Phường / Xã</Label>
          <div className={`relative ${isLoading.wards || !selectedDistrict ? 'opacity-50' : ''}`}>
            <Select
              className='w-full'
              options={wards}
              placeholder="Chọn phường/xã"
              onChange={setSelectedWard}
              defaultValue={selectedWard}
            />
            {isLoading.wards && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
              </div>
            )}
          </div>
          {error.wards && <div className="text-red-500 text-sm mt-1">{error.wards}</div>}
        </div>

        <div>
          <Label className="block text-sm font-medium mb-2">Địa chỉ chi tiết</Label>
          <Input
            type="text"
            placeholder="Số nhà, tên đường..."
            defaultValue={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full"
            error={!!error.address}
          />
          {error.address && <div className="text-red-500 text-sm mt-1">{error.address}</div>}
        </div>
      </div>

      <div className='flex gap-4 mt-6'>
        <Button onClick={() => setStep(2)} className='w-full'>Back</Button>
        <Button 
          onClick={handleNext} 
          className='w-full'
          disabled={!isFormValid}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
