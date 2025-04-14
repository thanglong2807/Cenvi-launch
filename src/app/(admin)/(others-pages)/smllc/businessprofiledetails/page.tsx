'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { useSearchParams } from 'next/navigation'
import LoadingProgressCircle from '@/components/ui/loading/Loading'
import Button from '@/components/ui/button/Button'
import CompanyInfo from './components/CompanyInfo'
import AddressInfo from './components/AddressInfo'
import IndustryInfo from './components/IndustryInfo'
import CapitalInfo from './components/CapitalInfo'
import MemberInfo from './components/MemberInfo'
import RepresentativeInfo from './components/RepresentativeInfo'
import TaxInfo from './components/TaxInfo'

export interface BusinessProfile {
  id: string
  cus_id: number
  cus_name: string
  emp_id: number
  emp_name: string
  process: string | null
  metadata: Metadata
}

export interface Metadata {
  type: number
  general: {
    provide: string
    date: {
      day: number
      month: number
      year: number
    }
  }
  registration_index: number
  company: {
    name: {
      full: string
      foreign: string
      short: string
    }
    address: {
      detail: string
      ward: string
      district: string
      city: string
      country: string
    }
    contact: {
      phone: string
      fax: string
      email: string
      website: string
    }
    license: {
      number: string
      date: string
      yn_land_use_cert: boolean | null
      ox_kv_CN: boolean
      ox_kv_CX: boolean
      ox_kv_KT: boolean
      ox_kv_CNC: boolean
      ox_xahoi: boolean
      ox_chungkhoan: boolean
    }
    capital: {
      amount: number
      text: string
      currency: string
      yn_equivalent_value: boolean
    }
  }
  owner: Person
  representatives: Person[]
  industries: Industry[]
  tax: {
    manager_name: string
    manager_phone: string
    accountant_name: string
    accountant_phone: string
    address: {
      street: string
      ward: string
      district: string
      city: string
      phone: string
      fax: string
      email: string
    }
    date_start: string
    finance_start: string
    finance_end: string
    num_employees: number
  }
  ox_bhxh_1m: boolean
  ox_bhxh_3m: boolean
  ox_bhxh_6m: boolean
}

export interface Person {
  name: string
  sex: string
  position?: string
  birthdate: string
  ethnic: string
  nationality: string
  id: {
    ox_cccd: boolean
    ox_cmnd: boolean
    ox_passport: boolean
    ox_other: boolean
    note: string
    number: string
    issue_date: string
    issue_place: string
    expiry_date: string
  }
  address: {
    permanent: {
      street: string
      ward: string
      district: string
      city: string
      country: string
    }
    contact: {
      street: string
      ward: string
      district: string
      city: string
      country: string
    }
  }
  contact: {
    phone: string
    email: string
  }
}

export interface Industry {
  is_main: boolean
  code: string
  description: string
  note: string
}

export default function BusinessProfileDetails() {
  const [profile, setProfile] = useState<BusinessProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [typeBussiness, settypeBussiness] = useState('')
  
  // Công ty
  const [companyState, setCompanyState] = useState({
    fullName: '',
    shortName: '',
    email: '',
    foreign: "",
    detail: '',
    ward: "",
    district: '',
    city: '',
    country: "",
    phone: "",
    fax: "",
    website: "",
    amount: "",
    text: "",
    currency: ""
  })

  // Thuế
  const [taxState, setTaxState] = useState({
    address: '',
    numEmployees: 0,
    accountant: ''
  })

  // ngành nghề
  const [industriesState, setIndustriesState] = useState<Industry[]>([])
  const [selectedMainIndex, setSelectedMainIndex] = useState<number | null>(null)

  // Thành viên
  const [membersState, setMembersState] = useState<any[]>([])

  // người đại diện pháp luật
  const [representativeState, setRepresentativeState] = useState<Person[]>([])

  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  useEffect(() => {
    if (!id) return
    
    const fetchProfile = async () => {
      try {
        const token = Cookies.get('token')
  
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
    
        const datas = await res.json()
        const data = datas.find((item:any)=>item.id==id)
        setProfile(data)
        console.log(data);
        
        const businessTypeMap: Record<string, string> = {
          '1': 'Trách nhiệm hữu hạn 1 thành viên',
          '2': 'Trách nhiệm hữu hạn 2 thành viên',
          '3': 'Công ty cổ phần',
        }
      
        settypeBussiness(businessTypeMap[data.metadata.type] || 'Loại hình khác')
  
        const company = data.metadata.company
        const tax = data.metadata.tax
  
        setIndustriesState(data.metadata.industries)
  
        const mainIdx = data.metadata.industries.findIndex((i: any) => i.is_main)
        setSelectedMainIndex(mainIdx)
  
        setCompanyState({
          fullName: company.name.full || '',
          shortName: company.name.short || '',
          foreign: company.name.foreign || '',
          email: company.contact.email || '',
          detail: company.address.detail,
          ward: company.address.ward,
          district: company.address.district,
          city: company.address.city,
          country: company.address.country,
          phone: company.contact.phone,
          fax: company.contact.fax,
          website: company.contact.website,
          amount: company.capital.amount,
          text: company.capital.text,
          currency: company.capital.currency,
        })
  
        setTaxState({
          address: `${tax.address.street}, ${tax.address.ward}, ${tax.address.district}, ${tax.address.city}`,
          numEmployees: tax.num_employees || 0,
          accountant: `${tax.accountant_name || ''} - ${tax.accountant_phone || ''}`,
        })
  
        setMembersState(data.metadata.members || [])
        setRepresentativeState(data.metadata.representatives || [])
      } catch (err) {
        console.error('❌ Error fetching profile:', err)
      }
    }
  
    fetchProfile()
  }, [])

  const handleUpdate = async () => {
    if (!profile) return

    const updatedProfile = {
      ...profile,
      metadata: {
        ...profile.metadata,
        company: {
          ...profile.metadata.company,
          name: {
            ...profile.metadata.company.name,
            full: companyState.fullName,
            short: companyState.shortName
          },
          contact: {
            ...profile.metadata.company.contact,
            email: companyState.email
          },
        },
        tax: {
          ...profile.metadata.tax,
          address: {
            ...profile.metadata.tax.address,
            street: taxState.address.split(',')[0].trim()
          },
          num_employees: Number(taxState.numEmployees),
          accountant_name: taxState.accountant.split('-')[0].trim(),
          accountant_phone: taxState.accountant.split('-')[1]?.trim() || ''
        },
        members: membersState,
        industries: industriesState,
      }
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/${profile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProfile)
      })

      if (res.ok) {
        alert('✅ Hồ sơ đã được cập nhật thành công!')
        setIsEditing(false)
      } else {
        alert('❌ Cập nhật thất bại.')
      }
    } catch (error) {
      console.error('Update error:', error)
      alert('🚨 Không thể kết nối đến máy chủ.')
    }
  }

  const handleAddIndustry = () => {
    setIndustriesState((prev) => [
      ...prev,
      {
        code: '',
        description: '',
        note: '',
        is_main: false,
      }
    ])
  }

  const handleRemoveIndustry = (index: number) => {
    setIndustriesState(prev => {
      const updated = [...prev]
      updated.splice(index, 1)

      if (selectedMainIndex === index) {
        return updated.map((item) => ({ ...item, is_main: false }))
      }

      return updated
    })

    if (selectedMainIndex !== null) {
      if (selectedMainIndex === index) {
        setSelectedMainIndex(null)
      } else if (selectedMainIndex > index) {
        setSelectedMainIndex((prev) => (prev ?? 0) - 1)
      }
    }
  }

  const handleDownloadProfile = () => {
    if (!profile) return;
  
    const jsonStr = JSON.stringify(profile, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.download = `business-profile-${profile.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!profile) return <div className='w-full h-[70vh] flex justify-center items-center'><LoadingProgressCircle percentage={90} duration={1000}/></div>

  return (
    <div className="p-6 space-y-10 max-w-5xl mx-auto relative">
      <Link className="absolute left-0 top-0" href="/smllc">
        Quay lại danh sách hồ sơ
      </Link>

      <CompanyInfo
        companyState={companyState}
        setCompanyState={setCompanyState}
        isEditing={isEditing}
        typeBussiness={typeBussiness}
        general={profile.metadata.general}
      />

      <AddressInfo
        companyState={companyState}
        setCompanyState={setCompanyState}
        isEditing={isEditing}
      />

      <IndustryInfo
        industriesState={industriesState}
        setIndustriesState={setIndustriesState}
        selectedMainIndex={selectedMainIndex}
        setSelectedMainIndex={setSelectedMainIndex}
        isEditing={isEditing}
        handleAddIndustry={handleAddIndustry}
        handleRemoveIndustry={handleRemoveIndustry}
      />

      <CapitalInfo
        companyState={companyState}
        setCompanyState={setCompanyState}
        isEditing={isEditing}
      />

      <MemberInfo
        membersState={membersState}
        setMembersState={setMembersState}
        isEditing={isEditing}
      />

      <RepresentativeInfo
        representativeState={representativeState}
        setRepresentativeState={setRepresentativeState}
        isEditing={isEditing}
      />

      <TaxInfo
        taxState={taxState}
        setTaxState={setTaxState}
        isEditing={isEditing}
      />

      <div className='flex justify-between'>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Sửa hồ sơ</Button>
        ) : (
          <Button onClick={handleUpdate}>Cập nhật hồ sơ</Button>
        )}
        <Button variant="outline" onClick={handleDownloadProfile}>📥 Tải hồ sơ xuống</Button>
      </div>
    </div>
  )
}
