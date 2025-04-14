'use client'

import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';

import { useEffect, useState } from 'react'

interface FpoResponse<T> {
  data: {
    data: T[]
  }
}


interface LegalRepresentativePageProps {
    onClose: () => void;
    setStep: (step: number) => void;
    currentStep: number; // Optional
  }
interface Address {
  city: string
  district: string
  ward: string
  streetAddress: string
}

interface Representative {
  id: number
  fullName: string
  position: string
  permanentAddress: Address
  currentAddress: Address
}

interface Province {
  code: string
  name: string
}

export default function LegalRepresentativePage({onClose, setStep, currentStep}:LegalRepresentativePageProps) {
  const [count, setCount] = useState(0)
  const [representatives, setRepresentatives] = useState<Representative[]>([])
  const [businessType, setBusinessType] = useState('Khác')
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districtsMap, setDistrictsMap] = useState<Record<string, Province[]>>({})
  const [wardsMap, setWardsMap] = useState<Record<string, Province[]>>({})

  useEffect(() => {
    const data = localStorage.getItem('companyData')
    if (data) {
      const parsed = JSON.parse(data)
      setBusinessType(parsed.businessType || 'Khác')
    }

    fetch('https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1')
      .then(res => res.json())
      .then((json: FpoResponse<Province>) => {
        setProvinces(json.data.data)
      })
  }, [])

  const handleGenerate = () => {
    if (!count || count < 1) {
      alert('Vui lòng nhập số lượng người đại diện hợp lệ!')
      return
    }
    const reps = Array.from({ length: count }, (_, i) => ({
      id: i,
      fullName: '',
      position: '',
      permanentAddress: { city: '', district: '', ward: '', streetAddress: '' },
      currentAddress: { city: '', district: '', ward: '', streetAddress: '' }
    }))
    setRepresentatives(reps)
  }

  const handleProvinceChange = async (
    index: number,
    prefix: 'permanentAddress' | 'currentAddress',
    cityCode: string
  ) => {
    const res = await fetch(`https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${cityCode}&limit=-1`)
    const json = await res.json()
    setDistrictsMap(prev => ({
      ...prev,
      [`${index}-${prefix}`]: json.data.data
    }))
    setWardsMap(prev => ({
      ...prev,
      [`${index}-${prefix}`]: []
    }))
    updateRepresentative(index, prefix, { city: cityCode, district: '', ward: '' })
  }

  const handleDistrictChange = async (
    index: number,
    prefix: 'permanentAddress' | 'currentAddress',
    districtCode: string
  ) => {
    const res = await fetch(`https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${districtCode}&limit=-1`)
    const json = await res.json()
    setWardsMap(prev => ({
      ...prev,
      [`${index}-${prefix}`]: json.data.data
    }))
    updateRepresentative(index, prefix, { district: districtCode, ward: '' })
  }

  const updateRepresentative = (
    index: number,
    field: keyof Representative | 'permanentAddress' | 'currentAddress',
    value: any,
    subfield?: keyof Address
  ) => {
    setRepresentatives(prev => {
      const updated:any = [...prev]
      if (field === 'permanentAddress' || field === 'currentAddress') {
        updated[index][field] = {
          ...updated[index][field],
          ...value
        }
      } else {
        updated[index][field] = value
      }
      return updated
    })
  }

  const getPositionOptions = () => {
    const base = [
      'Trưởng phòng kinh doanh', 'Kế toán trưởng', 'Phó Tổng giám đốc', 'Giám đốc',
      'Tổng giám đốc', 'Phó Chủ tịch hội đồng quản trị', 'Trưởng phòng', 'Giám đốc nhân sự',
      'Giám đốc điều hành', 'Giám đốc tài chính', 'Giám đốc kinh doanh'
    ]

    const special: Record<string, string[]> = {
      'Công ty TNHH 1 tv': ['Chủ tịch Công ty', 'Chủ tịch Công ty kiêm Giám đốc Điều Hành'],
      'Công ty TNHH': ['Chủ tịch HĐTV kiêm Tổng giám đốc', 'Thành viên Hội đồng thành viên'],
      'CTCP': ['Thành viên Hội đồng quản trị', 'Phó Chủ tịch hội đồng quản trị'],
      'Doanh nghiệp tư nhân': ['Chủ doanh nghiệp tư nhân'],
      'Công ty hợp danh': ['Thành viên hợp danh']
    }

    return [...(special[businessType] || []), ...base]
  }

  const handleSave = () => {
    const companyData = JSON.parse(localStorage.getItem('companyData') || '{}')
    companyData.legalRepresentatives = representatives
    localStorage.setItem('companyData', JSON.stringify(companyData))
    setStep(5)

  }

  return (
    <div className="representative-container">
         <div className='flex justify-between'>
        <h3 className=' text-xl '>Thông tin Người đại diện pháp luật  ( Bước {currentStep} )</h3>
      

      </div>
     

      <div className="form-group">
        <Label>Số lượng người đại diện <span className="required">*</span></Label>
        <div className='flex justify-between'>

        <Input
          type="number"
          defaultValue={count}
          onChange={(e) => setCount(parseInt(e.target.value))}
          placeholder="Nhập số lượng"
        />
        <Button onClick={handleGenerate}>Tạo danh sách</Button>
        </div>
      </div>

      {representatives.map((rep, index) => (
        <div key={rep.id} className="representative">
          <h3>Người đại diện pháp luật {index + 1}</h3>
          <div className="form-group">
            <Label>Họ và Tên <span className="required">*</span></Label>
            <Input
              defaultValue={rep.fullName}
              onChange={(e) => updateRepresentative(index, 'fullName', e.target.value)}
              placeholder="Nhập họ và tên"
            />
          </div>

          <div className="form-group">
            <Label>Chức danh <span className="required">*</span></Label>
            <select
            className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700'
              value={rep.position}
              onChange={(e) => updateRepresentative(index, 'position', e.target.value)}
            >
              <option value="">Chọn chức danh</option>
              {getPositionOptions().map((pos) => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>

          {/* Thường trú */}
          <h4>Hộ khẩu thường trú</h4>
          <div className="form-group">
            <Label>Thành phố</Label>
            <select
            className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700'
              value={rep.permanentAddress.city}
              onChange={(e) => handleProvinceChange(index, 'permanentAddress', e.target.value)}
            >
              <option value="">Chọn</option>
              {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <Label>Quận/Huyện</Label>
            <select
            className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700'
              value={rep.permanentAddress.district}
              onChange={(e) => handleDistrictChange(index, 'permanentAddress', e.target.value)}
            >
              <option value="">Chọn</option>
              {(districtsMap[`${index}-permanentAddress`] || []).map(d => (
                <option key={d.code} value={d.code}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <Label>Phường/Xã</Label>
            <select
            className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700'
              value={rep.permanentAddress.ward}
              onChange={(e) => updateRepresentative(index, 'permanentAddress', { ward: e.target.value })}
            >
              <option value="">Chọn</option>
              {(wardsMap[`${index}-permanentAddress`] || []).map(w => (
                <option key={w.code} value={w.code}>{w.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <Label>Địa chỉ</Label>
            <Input
              defaultValue={rep.permanentAddress.streetAddress}
              onChange={(e) => updateRepresentative(index, 'permanentAddress', { streetAddress: e.target.value })}
            />
          </div>

          {/* Hiện tại */}
          <h4>Chỗ ở hiện nay</h4>
          <div className="form-group">
            <Label>Thành phố</Label>
            <select
            className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700'
              value={rep.currentAddress.city}
              onChange={(e) => handleProvinceChange(index, 'currentAddress', e.target.value)}
            >
              <option value="">Chọn</option>
              {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <Label>Quận/Huyện</Label>
            <select
            className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700'
              value={rep.currentAddress.district}
              onChange={(e) => handleDistrictChange(index, 'currentAddress', e.target.value)}
            >
              <option value="">Chọn</option>
              {(districtsMap[`${index}-currentAddress`] || []).map(d => (
                <option key={d.code} value={d.code}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <Label>Phường/Xã</Label>
            <select
            className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700'
              value={rep.currentAddress.ward}
              onChange={(e) => updateRepresentative(index, 'currentAddress', { ward: e.target.value })}
            >
              <option value="">Chọn</option>
              {(wardsMap[`${index}-currentAddress`] || []).map(w => (
                <option key={w.code} value={w.code}>{w.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <Label>Địa chỉ</Label>
            <Input
              defaultValue={rep.currentAddress.streetAddress}
              onChange={(e) => updateRepresentative(index, 'currentAddress', { streetAddress: e.target.value })}
            />
          </div>
        </div>
      ))}

<div className='flex gap-5'>
        <Button onClick={() => setStep(3)} className='mt-4 w-full' >  Back</Button>
        <Button onClick={handleSave} className='mt-4 w-full' >  Next</Button>
      </div>
    </div>
  )
}
