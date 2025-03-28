'use client'

import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { useEffect, useState } from 'react'

interface ShareholdersProps {
  onClose: () => void;
  setStep: (step: number) => void;
  currentStep: number; // Optional
}

interface Shareholder {
  id: string
  type: 'individual' | 'organization'
  name: string
  percentage: number
  capitalAmount: number
  permanent: Address
  current: Address
}

interface Address {
  city: string
  district: string
  ward: string
  detail: string
}

interface Province {
  code: string
  name: string
}

export default function ShareholdersPage({ onClose, setStep, currentStep }: ShareholdersProps) {
  const [charterCapital, setCharterCapital] = useState<number>(0)
  const [individualCount, setIndividualCount] = useState(0)
  const [organizationCount, setOrganizationCount] = useState(0)
  const [shareholders, setShareholders] = useState<Shareholder[]>([])
  const [provinceOptions, setProvinceOptions] = useState<Province[]>([])
  const [warningOver100, setWarningOver100] = useState(false)
  const [districtsMap, setDistrictsMap] = useState<Record<string, Province[]>>({})
  const [wardsMap, setWardsMap] = useState<Record<string, Province[]>>({})

  useEffect(() => {
    const data = localStorage.getItem('companyData')
    if (data) {
      const parsed = JSON.parse(data)
      if (parsed.vonDieuLe) setCharterCapital(parsed.vonDieuLe)
    }
  }, [])

  useEffect(() => {
    fetch('https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1')
      .then(res => res.json())
      .then(data => {
        if (data?.data?.data) setProvinceOptions(data.data.data)
      })
  }, [])

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('vi-VN').format(value)

  const parseCurrency = (value: string) =>
    parseInt(value.replace(/\D/g, '')) || 0

  const handleCapitalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseCurrency(e.target.value)
    setCharterCapital(value)
    const updated = shareholders.map(s => ({
      ...s,
      capitalAmount: parseFloat(((value * s.percentage) / 100).toFixed(0))
    }))
    setShareholders(updated)
  }

  const handleAddShareholders = (type: 'individual' | 'organization', count: number) => {
    const newShareholders: Shareholder[] = []
    for (let i = 0; i < count; i++) {
      newShareholders.push({
        id: `${type}-${Date.now()}-${i}`,
        type,
        name: '',
        percentage: 0,
        capitalAmount: 0,
        permanent: { city: '', district: '', ward: '', detail: '' },
        current: { city: '', district: '', ward: '', detail: '' }
      })
    }
    setShareholders(prev =>
      [...prev.filter(s => s.type !== type), ...newShareholders]
    )
  }

  const handleUpdateShareholder = async (
    id: string,
    field: keyof Shareholder | 'permanent' | 'current',
    value: any,
    subfield?: keyof Address
  ) => {
    const updated = await Promise.all(
      shareholders.map(async s => {
        if (s.id === id) {
          if (field === 'permanent' || field === 'current') {
            const updatedAddress = { ...s[field], [subfield!]: value }

            // Tải district
            if (subfield === 'city') {
              const dists = await fetchDistricts(value)
              setDistrictsMap(prev => ({ ...prev, [`${id}-${field}`]: dists }))
              updatedAddress.district = ''
              updatedAddress.ward = ''
            }

            // Tải ward
            if (subfield === 'district') {
              const wards = await fetchWards(value)
              setWardsMap(prev => ({ ...prev, [`${id}-${field}`]: wards }))
              updatedAddress.ward = ''
            }

            return {
              ...s,
              [field]: updatedAddress
            }
          }

          if (field === 'percentage') {
            const percentage = parseFloat(value) || 0
            return {
              ...s,
              percentage,
              capitalAmount: Math.round((charterCapital * percentage) / 100)
            }
          }

          if (field === 'capitalAmount') {
            const capitalAmount = parseCurrency(value)
            return {
              ...s,
              capitalAmount,
              percentage: charterCapital
                ? parseFloat(((capitalAmount / charterCapital) * 100).toFixed(2))
                : 0
            }
          }

          return { ...s, [field]: value }
        }
        return s
      })
    )

    setShareholders(updated)
  }

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

  useEffect(() => {
    const total = shareholders.reduce((sum, s) => sum + s.percentage, 0)
    setWarningOver100(total > 100)
  }, [shareholders])

  const handleSave = () => {
    const data = {
      vonDieuLe: charterCapital,
      capitalContributors: {
        individuals: shareholders.filter(s => s.type === 'individual'),
        organizations: shareholders.filter(s => s.type === 'organization')
      }
    }
    localStorage.setItem('companyData', JSON.stringify(data))
    setStep(6)

  }

  const renderAddressSelect = (
    shareholder: Shareholder,
    group: 'permanent' | 'current',
    label: string
  ) => {
    const key = `${shareholder.id}-${group}`
    const districts = districtsMap[key] || []
    const wards = wardsMap[key] || []

    return (
      <div>
        <h4>{label}</h4>
        <div className="form-group">
          <Label>Thành phố</Label>
          <select
            className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700'
            value={shareholder[group].city}
            onChange={(e) =>
              handleUpdateShareholder(shareholder.id, group, e.target.value, 'city')
            }
          >
            <option value="">Chọn thành phố</option>
            {provinceOptions.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <Label>Quận/Huyện</Label>
          <select
            className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700'
            value={shareholder[group].district}
            onChange={(e) =>
              handleUpdateShareholder(shareholder.id, group, e.target.value, 'district')
            }
          >
            <option value="">Chọn quận/huyện</option>
            {districts.map((d) => (
              <option key={d.code} value={d.code}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <Label>Phường/Xã</Label>
          <select
            className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700'
            value={shareholder[group].ward}
            onChange={(e) =>
              handleUpdateShareholder(shareholder.id, group, e.target.value, 'ward')
            }
          >
            <option value="">Chọn phường/xã</option>
            {wards.map((w) => (
              <option key={w.code} value={w.code}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <Label>Địa chỉ chi tiết</Label>
          <Input
            className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700'
            defaultValue={shareholder[group].detail}
            onChange={(e) =>
              handleUpdateShareholder(shareholder.id, group, e.target.value, 'detail')
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="capital-contributor-container">
      <div className='flex justify-between'>
        <h3 className=' text-xl '>Thông tin Cổ đông góp vốn  ( Bước {currentStep} )</h3>
        <Button
          onClick={onClose}
          className=" text-gray-600 hover:text-black"
        >
          ✕
        </Button>
      </div>

      <div className="form-group">
        <Label>Vốn điều lệ *</Label>
        <Input
          className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700'
          type="text"
          defaultValue={formatCurrency(charterCapital)}
          onChange={handleCapitalChange}
        />
      </div>

      <h3>Cổ đông cá nhân</h3>
      <div className="form-group">
        <Label>Số lượng cổ đông</Label>
        <div className="flex content-center justify-between">
          <Input
            className='w-[600px] px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700'
            type="number"
            // min={0}
            defaultValue={individualCount}
            onChange={(e) => setIndividualCount(Number(e.target.value))}
          />
          <Button className='w-[180px]' onClick={() => handleAddShareholders('individual', individualCount)}>Thêm</Button>
        </div>

      </div>

      <h3>Tổ chức góp vốn</h3>
      <div className="form-group">
        <Label>Số lượng tổ chức</Label>
        <div className="flex content-center justify-between">
          <Input
            className='w-[600px] px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700'
            type="number"
            // min={0}
            defaultValue={organizationCount}
            onChange={(e) => setOrganizationCount(Number(e.target.value))}
          />
          <Button className='w-[180px]' onClick={() => handleAddShareholders('organization', organizationCount)}>Thêm</Button>
        </div>

      </div>

      {shareholders.map((s, idx) => (
        <div key={s.id} className="shareholder-box">
          <h4>{s.type === 'individual' ? 'Cổ đông cá nhân' : 'Tổ chức'} #{idx + 1}</h4>

          <div className="form-group">
            <Label>{s.type === 'individual' ? 'Họ và Tên' : 'Tên tổ chức'} *</Label>
            <Input
              className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700'
              type="text"
              defaultValue={s.name}
              onChange={(e) => handleUpdateShareholder(s.id, 'name', e.target.value)}
            />
          </div>

          <div className="form-group">
            <Label>Tỷ lệ góp vốn (%) *</Label>
            <Input
              className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700'
              type="number"

              defaultValue={s.percentage}
              onChange={(e) => handleUpdateShareholder(s.id, 'percentage', e.target.value)}
            />
          </div>

          <div className="form-group">
            <Label>Số tiền góp vốn *</Label>
            <Input
              className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700'
              type="text"

              defaultValue={formatCurrency(s.capitalAmount)}
              onChange={(e) => handleUpdateShareholder(s.id, 'capitalAmount', e.target.value)}
            />
          </div>

          {renderAddressSelect(s, 'permanent', 'Hộ khẩu thường trú')}
          {renderAddressSelect(s, 'current', 'Chỗ ở hiện nay')}
        </div>
      ))}

      {warningOver100 && (
        <p className="share-warning">Tổng tỷ lệ góp vốn vượt quá 100%</p>
      )}

      <div className='flex gap-5'>
        <Button onClick={() => setStep(4)} className='mt-4 w-full' >  Back</Button>
        <Button onClick={handleSave} className='mt-4 w-full' >  Next</Button>
      </div>
    </div>
  )
}
