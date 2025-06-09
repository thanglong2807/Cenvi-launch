'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import Link from 'next/link'
import Cookies from 'js-cookie'
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
import { Button } from '@/components/ui/button'
import AppHeader from '@/layout/AppHeader'
import HeaderItem from '@/layout/HeaderItem'
import router from 'next/router'
import Image from 'next/image'
import Container from '@/components/Container/Container'

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
      return
    }

    try {
      setError(null)
      const token = Cookies.get('token')
      // --- MOCK DATA BLOCK ---
      if (!token) {
        // Mock BusinessProfile data for UI development
        const mockProfile: BusinessProfile = {
          id: 'mock-123',
          cus_id: 1,
          cus_name: 'Công ty TNHH Demo',
          emp_id: 101,
          emp_name: 'Nguyễn Văn A',
          process: 'Đang xử lý',
          metadata: {
            type: 1,
            general: {
              provide: 'Dịch vụ phần mềm',
              date: { day: 6, month: 6, year: 2025 }
            },
            registration_index: 1001,
            company: {
              name: {
                full: 'Công ty TNHH Demo',
                foreign: 'Demo Co., Ltd.',
                short: 'Demo Ltd'
              },
              address: {
                detail: '123 Đường Lê Lợi',
                ward: 'Phường 1',
                district: 'Quận 1',
                city: 'Hồ Chí Minh',
                country: 'Việt Nam'
              },
              contact: {
                phone: '0909123456',
                fax: '0281234567',
                email: 'contact@demo.com',
                website: 'https://demo.com'
              },
              license: {
                number: '123456789',
                date: '2025-01-01',
                yn_land_use_cert: true,
                ox_kv_CN: false,
                ox_kv_CX: true,
                ox_kv_KT: false,
                ox_kv_CNC: false,
                ox_xahoi: false,
                ox_chungkhoan: false
              },
              capital: {
                amount: 1000000000,
                text: 'Một tỷ đồng',
                currency: 'VND',
                yn_equivalent_value: false
              }
            },
            owner: {
              name: 'Nguyễn Văn A',
              sex: 'Nam',
              position: 'Chủ sở hữu',
              birthdate: '1980-05-20',
              ethnic: 'Kinh',
              nationality: 'Việt Nam',
              id: {
                ox_cccd: true,
                ox_cmnd: false,
                ox_passport: false,
                ox_other: false,
                note: '',
                number: '012345678901',
                issue_date: '2010-01-01',
                issue_place: 'TP.HCM',
                expiry_date: '2030-01-01'
              },
              address: {
                permanent: {
                  street: '123 Đường Lê Lợi',
                  ward: 'Phường 1',
                  district: 'Quận 1',
                  city: 'Hồ Chí Minh',
                  country: 'Việt Nam'
                },
                contact: {
                  street: '123 Đường Lê Lợi',
                  ward: 'Phường 1',
                  district: 'Quận 1',
                  city: 'Hồ Chí Minh',
                  country: 'Việt Nam'
                }
              },
              contact: {
                phone: '0909123456',
                email: 'owner@demo.com'
              }
            },
            representatives: [
              {
                name: 'Trần Thị B',
                sex: 'Nữ',
                position: 'Giám đốc',
                birthdate: '1985-08-15',
                ethnic: 'Kinh',
                nationality: 'Việt Nam',
                id: {
                  ox_cccd: true,
                  ox_cmnd: false,
                  ox_passport: false,
                  ox_other: false,
                  note: '',
                  number: '098765432109',
                  issue_date: '2012-01-01',
                  issue_place: 'TP.HCM',
                  expiry_date: '2032-01-01'
                },
                address: {
                  permanent: {
                    street: '456 Đường Hai Bà Trưng',
                    ward: 'Phường 2',
                    district: 'Quận 3',
                    city: 'Hồ Chí Minh',
                    country: 'Việt Nam'
                  },
                  contact: {
                    street: '456 Đường Hai Bà Trưng',
                    ward: 'Phường 2',
                    district: 'Quận 3',
                    city: 'Hồ Chí Minh',
                    country: 'Việt Nam'
                  }
                },
                contact: {
                  phone: '0912345678',
                  email: 'director@demo.com'
                }
              }
            ],
            industries: [
              {
                is_main: true,
                code: '6201',
                description: 'Lập trình máy vi tính',
                note: ''
              },
              {
                is_main: false,
                code: '6311',
                description: 'Xử lý dữ liệu',
                note: ''
              }
            ],
            tax: {
              manager_name: 'Nguyễn Văn C',
              manager_phone: '0988777666',
              accountant_name: 'Lê Thị D',
              accountant_phone: '0909888777',
              address: {
                street: '789 Đường Pasteur',
                ward: 'Phường 6',
                district: 'Quận 3',
                city: 'Hồ Chí Minh',
                phone: '0288888888',
                fax: '0288888889',
                email: 'tax@demo.com'
              },
              date_start: '2025-01-01',
              finance_start: '2025-01-01',
              finance_end: '2025-12-31',
              num_employees: 20
            },
            ox_bhxh_1m: false,
            ox_bhxh_3m: false,
            ox_bhxh_6m: false
          }
        }
        setProfile(mockProfile)

        // Set company data
        const { company } = mockProfile.metadata
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
        const { tax } = mockProfile.metadata
        setTaxState({
          address: tax.address.street,
          numEmployees: tax.num_employees,
          accountant: tax.accountant_name + ' - ' + tax.accountant_phone
        })

        // Set industries data
        setIndustriesState(mockProfile.metadata.industries)

        // Set members data - convert Person[] to Member[]
        setMembersState(mockProfile.metadata.representatives.map(personToMember))
        setRepresentativeState([mockProfile.metadata.owner])

        // Find main industry
        const mainIndustryIndex = mockProfile.metadata.industries.findIndex(ind => ind.is_main)
        setSelectedMainIndex(mainIndustryIndex >= 0 ? mainIndustryIndex : null)

        const businessTypeMap: Record<string, string> = {
          '1': 'Trách nhiệm hữ hạn 1 thành viên',
          '2': 'Trách nhiệm hữ hạn 2 thành viên',
          '3': 'Công ty cổ phần',
        }
        settypeBussiness(businessTypeMap[mockProfile.metadata.type.toString()] || 'Loại hình khác')
        return
      }
      // --- END MOCK DATA BLOCK ---
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
        accountant: tax.accountant_name + ' - ' + tax.accountant_phone
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



  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  return (
    <div className="">
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

    <div>
      <AppHeader>
        <HeaderItem
          title="Tổng quan hồ sơ"
          left={
            <div className="flex gap-2">
              <Button
                variant="none"
                className="text-center justify-center bg-transparent  border-amber-500 text-amber-500 text-sm font-normal"
                onClick={() => router.back()}
              >
                <Image src="/images/icons/back.svg" alt="back" width={26} height={26} />
              </Button>
            </div>
          }
        />
      </AppHeader>
      <Container>
        <div className='p-4'><BusinessProfileDetailsContent /></div>
        </Container>
    </div>

  )
}
