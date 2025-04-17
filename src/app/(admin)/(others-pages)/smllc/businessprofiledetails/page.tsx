'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import Link from 'next/link'
import Cookies from 'js-cookie'
import LoadingProgressCircle from '@/components/ui/loading/Loading'
import Button from '@/components/ui/button/Button'
import CompanyInfo from './components/CompanyInfo'
import AddressInfo from './components/AddressInfo'
import IndustryInfo from './components/IndustryInfo'
import CapitalInfo from './components/CapitalInfo'
import MemberInfo from './components/MemberInfo'
import RepresentativeInfo from './components/RepresentativeInfo'
import TaxInfo from './components/TaxInfo'
import { CompanyState, CapitalState } from './types'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'

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

export interface Member {
  name: string
  sex: string
  birthdate: string
  ethnic: string
  nationality: string
  id_number: string
  issue_place: string
  issue_date: string
  expiry_date: string
  capital: {
    amount: string
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
}

const personToMember = (person: Person): Member => {
  return {
    name: person.name,
    sex: person.sex,
    birthdate: person.birthdate,
    ethnic: person.ethnic,
    nationality: person.nationality,
    id_number: person.id.number,
    issue_place: person.id.issue_place,
    issue_date: person.id.issue_date,
    expiry_date: person.id.expiry_date,
    capital: {
      amount: '0' // Default value since Person doesn't have capital
    },
    address: {
      permanent: {
        street: person.address.permanent.street,
        ward: person.address.permanent.ward,
        district: person.address.permanent.district,
        city: person.address.permanent.city,
        country: person.address.permanent.country
      },
      contact: {
        street: person.address.contact.street,
        ward: person.address.contact.ward,
        district: person.address.contact.district,
        city: person.address.contact.city,
        country: person.address.contact.country
      }
    }
  }
}

function BusinessProfileDetailsContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<BusinessProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [typeBussiness, settypeBussiness] = useState('')
  
  // Công ty
  const [companyState, setCompanyState] = useState<CompanyState>({
    fullName: '',
    shortName: '',
    email: '',
    foreign: '',
    detail: '',
    ward: '',
    district: '',
    city: '',
    country: '',
    phone: '',
    fax: '',
    website: ''
  })

  const [capitalState, setCapitalState] = useState<CapitalState>({
    amount: '',
    text: '',
    currency: ''
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
  const [membersState, setMembersState] = useState<Member[]>([])
  const [representativeState, setRepresentativeState] = useState<Person[]>([])

  const fetchProfile = useCallback(async () => {
    if (!id) {
      setError('Không tìm thấy ID công ty')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const token = Cookies.get('token')
      if (!token) {
        setError('⚠️ Không có token. Không thể lấy dữ liệu.')
        return
      }

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data: BusinessProfile = res.data
      setProfile(data)

      // Set company data
      const { company } = data.metadata
      setCompanyState({
        fullName: company.name.full,
        shortName: company.name.short,
        email: company.contact.email,
        foreign: company.name.foreign,
        detail: company.address.detail,
        ward: company.address.ward,
        district: company.address.district,
        city: company.address.city,
        country: company.address.country,
        phone: company.contact.phone,
        fax: company.contact.fax,
        website: company.contact.website
      })

      // Set tax data
      const { tax } = data.metadata
      setTaxState({
        address: tax.address.street,
        numEmployees: tax.num_employees,
        accountant: tax.accountant_name
      })

      // Set industries data
      setIndustriesState(data.metadata.industries)

      // Set members data - convert Person[] to Member[]
      setMembersState(data.metadata.representatives.map(personToMember))
      setRepresentativeState([data.metadata.owner])

      // Find main industry
      const mainIndustryIndex = data.metadata.industries.findIndex(ind => ind.is_main)
      setSelectedMainIndex(mainIndustryIndex >= 0 ? mainIndustryIndex : null)

      const businessTypeMap: Record<string, string> = {
        '1': 'Trách nhiệm hữ hạn 1 thành viên',
        '2': 'Trách nhiệm hữ hạn 2 thành viên',
        '3': 'Công ty cổ phần',
      }
      
      settypeBussiness(businessTypeMap[data.metadata.type] || 'Loại hình khác')

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu'
      setError(errorMessage)
      console.error('❌ Error fetching profile:', errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchProfile()
    }
  }, [id, fetchProfile])

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

  if (isLoading) {
    return <div className='w-full h-[70vh] flex justify-center items-center'><LoadingProgressCircle percentage={90} duration={1000}/></div>
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  return (
    <div className="p-6 space-y-10 max-w-5xl mx-auto relative">
      <Link className="absolute left-0 top-0" href="/smllc">
        Quay lại danh sách hồ sơ
      </Link>

      <CompanyInfo
        companyState={companyState}
        setCompanyState={setCompanyState}
        capitalState={capitalState}
        setCapitalState={setCapitalState}
        isEditing={isEditing}
        typeBussiness={typeBussiness}
        general={profile?.metadata?.general || {
          provide: '',
          date: {
            day: 0,
            month: 0,
            year: 0
          }
        }}
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
        companyState={capitalState}
        setCompanyState={setCapitalState}
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

export default function BusinessProfileDetails() {
  return (
    <Suspense fallback={<div className='w-full h-[70vh] flex justify-center items-center'><LoadingProgressCircle percentage={90} duration={1000}/></div>}>
      <BusinessProfileDetailsContent />
    </Suspense>
  )
}
