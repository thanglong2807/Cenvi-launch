'use client'

import { useEffect, useState } from 'react'
import Input from '@/components/form/input/InputField'
import Button from '@/components/ui/button/Button'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
// import axios from 'axios'
import Cookies from 'js-cookie'
import { useSearchParams } from 'next/navigation'

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


type Representative = {
    name: string
    sex: string
    position: string
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

    const [representativeState, setRepresentativeState] = useState<Representative[]>([])
    

    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    useEffect(() => {
      
        if (!id) return
        
        const fetchProfile = async () => {
          try {
            const token = Cookies.get('token')
      
            const res = await fetch(
              `https://fastapi-cenvilaunch.onrender.com/profile?id=${id}`,
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
            
            // setProfile(data)
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
                    //    tý thêm trường còn thiếu vào đây
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
            const res = await fetch(`https://67e21df497fc65f53534a70e.mockapi.io/api/v1/hoso/${profile.id}`, {
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

            // Nếu đang xoá ngành chính, reset lựa chọn
            if (selectedMainIndex === index) {
                return updated.map((item) => ({ ...item, is_main: false }))
            }

            return updated
        })

        // Update lại selectedMainIndex nếu cần
        if (selectedMainIndex !== null) {
            if (selectedMainIndex === index) {
                setSelectedMainIndex(null)
            } else if (selectedMainIndex > index) {
                setSelectedMainIndex((prev) => (prev ?? 0) - 1)
            }
        }
    }

    if (!profile) return <div className="p-4">Đang tải dữ liệu...</div>
    const { general } = profile.metadata


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
      
    return (
        <div className="p-6 space-y-10 max-w-5xl mx-auto relative">
            <Link className="absolute left-0 top-0" href="/smllc">
                Quay lại danh sách hồ sơ
            </Link>

            {/* Công ty */}
            <section className="mt-5">
                <div className='flex align-middle justify-between'>
                    <h2 className="text-xl font-semibold mb-4 ">📌 Thông tin công ty {typeBussiness}</h2>
                    <p><strong>Ngày ký hồ sơ:</strong> Ngày {general.date.day} Tháng {general.date.month} Năm {general.date.year}</p>
                </div>

                <div className='border rounded p-4 mb-4 bg-white shadow-sm space-y-2'>
                    <div className="flex  content-center items-center">
                        <strong className="">Tên công ty viết bằng tiếng Việt (ghi bằng chữ in hoa):</strong>
                        <Input
                            disabled={!isEditing}
                            className='outline-0 focus:none border-0'
                            defaultValue={companyState.fullName}
                            onChange={(e) => setCompanyState({ ...companyState, fullName: e.target.value })}
                        />
                    </div>

                    <div className="flex content-center items-center">
                        <strong className="">Tên công ty viết bằng tiếng nước ngoài (nếu có)</strong>
                        <Input
                            disabled={!isEditing}
                            className='outline-0 focus:none border-0'
                            defaultValue={companyState.foreign}
                            onChange={(e) => setCompanyState({ ...companyState, foreign: e.target.value })}
                        />
                    </div>

                    <div className="flex content-center items-center">
                        <strong className="">Tên công ty viết tắt (nếu có)</strong>
                        <Input
                            disabled={!isEditing}
                            className='outline-0 focus:none border-0'
                            defaultValue={companyState.shortName}
                            onChange={(e) => setCompanyState({ ...companyState, shortName: e.target.value })}
                        />
                    </div>

                    <div className="flex content-center items-center">
                        <strong className="">Email:</strong>
                        <Input
                            disabled={!isEditing}
                            className='outline-0 focus:none border-0'
                            defaultValue={companyState.email}
                            onChange={(e) => setCompanyState({ ...companyState, email: e.target.value })}
                        />
                    </div>

                    <div className="flex content-center items-center">
                        <strong className="">Vốn điều lệ:</strong>
                        <Input
                            disabled={!isEditing}
                            className='outline-0 focus:none border-0'
                            defaultValue={companyState.amount}
                            onChange={(e) => setCompanyState({ ...companyState, amount: e.target.value })}
                        />
                    </div>


                </div>
            </section>
            {/* Địa chỉ trụ sở chính */}

            <section>
                <div className="flex justify-between pb-4">
                    <h2 className="text-xl font-semibold mb-4">👥 Địa chỉ trụ sở chính</h2>
                </div>
                <div className='border rounded p-4 mb-4 bg-white shadow-sm space-y-2"'>
                    <div className="flex content-center items-center">
                        <strong className="">Số nhà, ngách, hẻm, ngõ, đường phố/tổ/xóm/ấp/thôn:</strong>
                        <Input
                            disabled={!isEditing}
                            className='outline-0 focus:none border-0'
                            defaultValue={companyState.detail}
                            onChange={(e) => setCompanyState({ ...companyState, detail: e.target.value })}
                        />
                    </div>
                    <div className="flex content-center items-center">
                        <strong className="">Xã/Phường/Thị trấn: </strong>
                        <Input
                            disabled={!isEditing}
                            className='outline-0 focus:none border-0'
                            defaultValue={companyState.ward}
                            onChange={(e) => setCompanyState({ ...companyState, ward: e.target.value })}
                        />
                    </div>
                    <div className="flex content-center items-center">
                        <strong className="">Quận/Huyện/Thị xã/Thành phố thuộc tỉnh: </strong>
                        <Input
                            disabled={!isEditing}
                            className='outline-0 focus:none border-0'
                            defaultValue={companyState.district}
                            onChange={(e) => setCompanyState({ ...companyState, district: e.target.value })}
                        />
                    </div>
                    <div className="flex content-center items-center">
                        <strong className="">Tỉnh/Thành phố:</strong>
                        <Input
                            disabled={!isEditing}
                            className='outline-0 focus:none border-0'
                            defaultValue={companyState.city}
                            onChange={(e) => setCompanyState({ ...companyState, city: e.target.value })}
                        />
                    </div>
                    <div className="flex content-center items-center">
                        <strong className="">Quốc gia: </strong>
                        <Input
                            disabled={!isEditing}
                            className='outline-0 focus:none border-0'
                            defaultValue={companyState.country}
                            onChange={(e) => setCompanyState({ ...companyState, country: e.target.value })}
                        />
                    </div>
                    <div className='grid grid-cols-2 grid-rows-2'>
                        <div className="flex content-center items-center">
                            <strong className="">Điện thoại: </strong>
                            <Input
                                disabled={!isEditing}
                                className='outline-0 focus:none border-0'
                                defaultValue={companyState.phone}
                                onChange={(e) => setCompanyState({ ...companyState, phone: e.target.value })}
                            />
                        </div>
                        <div className="flex content-center items-center">
                            <strong className="">Email: </strong>
                            <Input
                                disabled={!isEditing}
                                className='outline-0 focus:none border-0'
                                defaultValue={companyState.email}
                                onChange={(e) => setCompanyState({ ...companyState, email: e.target.value })}
                            />
                        </div>
                        <div className="flex content-center items-center">
                            <strong className="">Fax (nếu có):</strong>
                            <Input
                                disabled={!isEditing}
                                className='outline-0 focus:none border-0'
                                defaultValue={companyState.fax}
                                onChange={(e) => setCompanyState({ ...companyState, fax: e.target.value })}
                            />
                        </div>
                        <div className="flex content-center items-center">
                            <strong className="">Website (nếu có):</strong>
                            <Input
                                disabled={!isEditing}
                                className='outline-0 focus:none border-0'
                                defaultValue={companyState.website}
                                onChange={(e) => setCompanyState({ ...companyState, website: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

            </section>

            {/* Ngành nghề */}
            <section>
                <div className="flex justify-between pb-4">
                    <h2 className="text-xl font-semibold mb-4">👥 Mã ngành nghề</h2>
                </div>
                <Table className="w-full border border-gray-200 rounded-md overflow-hidden shadow-sm text-sm">
                    <TableHeader className="bg-gray-100 text-gray-700">
                        <TableRow className="border-b border-gray-200">
                            <TableCell isHeader className="font-semibold px-4 py-2 text-center">STT</TableCell>
                            <TableCell isHeader className="font-semibold px-4 py-2">Tên Ngành</TableCell>
                            <TableCell isHeader className="font-semibold px-4 py-2">Mã ngành</TableCell>
                            <TableCell isHeader className="font-semibold px-4 py-2">Lưu ý</TableCell>
                            <TableCell isHeader className="font-semibold px-4 py-2 text-center">
                                Ngành nghề kinh doanh chính<br />
                                <span className="text-xs text-gray-500">(đánh dấu X để chọn)</span>
                            </TableCell>
                            <TableCell isHeader className="font-semibold px-4 py-2">Action</TableCell>

                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {industriesState.map((e, i) => (
                            <TableRow key={i} className="hover:bg-gray-50 border-b border-gray-200">
                                <TableCell className="px-4 py-2 text-center">{i + 1}</TableCell>

                                <TableCell className="px-2 py-2 text-center">
                                    <Input
                                        disabled={!isEditing}
                                        defaultValue={e.description}
                                        onChange={(ev) =>
                                            setIndustriesState((prev) => {
                                                const updated = [...prev]
                                                updated[i].description = ev.target.value
                                                return updated
                                            })
                                        }
                                    />
                                </TableCell>

                                <TableCell className="px-2 py-2 text-center">
                                    <Input
                                        disabled={!isEditing}
                                        defaultValue={e.code}
                                        onChange={(ev) => {
                                            const updated = [...industriesState]
                                            updated[i].code = ev.target.value
                                            setIndustriesState(updated)
                                        }}
                                    />
                                </TableCell>

                                <TableCell className="px-2 py-2 text-center">
                                    <Input
                                        disabled={!isEditing}
                                        defaultValue={e.note}
                                        onChange={(ev) => {
                                            const updated = [...industriesState]
                                            updated[i].note = ev.target.value
                                            setIndustriesState(updated)
                                        }}
                                    />
                                </TableCell>

                                <TableCell className="px-2 py-2 text-center">
                                    <input
                                        disabled={!isEditing}
                                        type="radio"
                                        name="is_main"
                                        className="h-4 w-4 accent-blue-600"
                                        checked={selectedMainIndex === i}
                                        onChange={() => setSelectedMainIndex(i)}
                                    />
                                </TableCell>
                                <TableCell className="px-2 py-2 text-center">
                                    <Button
                                        disabled={!isEditing}
                                        onClick={() => handleRemoveIndustry(i)}
                                        className="text-red-500 hover:underline text-sm"
                                    >
                                        Xoá
                                    </Button>
                                </TableCell>
                            </TableRow>

                        ))}


                    </TableBody>
                </Table>
                <Button disabled={!isEditing} onClick={handleAddIndustry} className="mb-4">
                    ➕ Thêm ngành nghề
                </Button>


            </section>

            {/* Vốn điều lệ */}
            <section>
                <div className="flex justify-between pb-4">
                    <h2 className="text-xl font-semibold mb-4">👥 Vốn điều lệ</h2>
                </div>
                <div className='border rounded p-4 mb-4 bg-white shadow-sm space-y-2'>
                    <div>
                        <div className="flex content-center items-center">
                            <strong className="">Vốn điều lệ (bằng số; VNĐ):</strong>
                            <Input
                                disabled={!isEditing}
                                className='outline-0 focus:none border-0'
                                defaultValue={companyState.amount}
                                onChange={(e) => setCompanyState({ ...companyState, amount: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex content-center items-center">
                            <strong className="">Vốn điều lệ (bằng chữ; VNĐ):</strong>
                            <Input
                                disabled={!isEditing}
                                className='outline-0 focus:none border-0'
                                defaultValue={companyState.text}
                                onChange={(e) => setCompanyState({ ...companyState, text: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex content-center items-center">
                            <strong className="">Giá trị tương đương theo đơn vị tiền nước ngoài (nếu có, bằng số, loại ngoại tệ): </strong>
                            <Input
                                disabled={!isEditing}
                                className='outline-0 focus:none border-0'
                                defaultValue={companyState.currency}
                                onChange={(e) => setCompanyState({ ...companyState, currency: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

            </section>

            {/* Thành viên góp vốn */}
            <section>
                <div className="flex justify-between pb-4">
                    <h2 className="text-xl font-semibold mb-4">👥 Thành viên góp vốn</h2>
                </div>

                {membersState.map((member: any, idx) => (
                    <div key={idx} className="border rounded p-4 mb-4 bg-white shadow-sm space-y-2">

                        <div className='grid grid-cols-2 grid-rows-3'>
                            <div className='flex items-center'>
                                <strong >Họ tên</strong>
                                <Input
                                    disabled={!isEditing}
                                    className='outline-0 focus:none border-0'

                                    defaultValue={member.name}
                                    onChange={(e) => {
                                        const updated = [...membersState]
                                        updated[idx].name = e.target.value
                                        setMembersState(updated)
                                    }}
                                />
                            </div>
                            <div className='flex items-center'> <strong>Giới tính</strong>
                                <Input
                                    disabled={!isEditing}
                                    className='outline-0 focus:none border-0'

                                    defaultValue={member.sex}
                                    onChange={(e) => {
                                        const updated = [...membersState]
                                        updated[idx].sex = e.target.value
                                        setMembersState(updated)
                                    }}
                                /></div>
                            <div className='flex items-center'> <strong>Ngày sinh</strong>
                                <Input
                                    disabled={!isEditing}
                                    className='outline-0 focus:none border-0'
                                    defaultValue={member.birthdate}
                                    onChange={(e) => {
                                        const updated = [...membersState]
                                        updated[idx].birthdate = e.target.value
                                        setMembersState(updated)
                                    }}
                                /></div>
                            <div className='flex items-center'><strong>Dân tộc</strong>
                                <Input
                                    disabled={!isEditing}
                                    className='outline-0 focus:none border-0'
                                    defaultValue={member.ethnic}
                                    onChange={(e) => {
                                        const updated = [...membersState]
                                        updated[idx].ethnic = e.target.value
                                        setMembersState(updated)
                                    }}
                                /></div>
                            <div className='flex items-center'><strong>Quốc tịch</strong>
                                <Input
                                    disabled={!isEditing}
                                    className='outline-0 focus:none border-0'
                                    defaultValue={member.nationality}
                                    onChange={(e) => {
                                        const updated = [...membersState]
                                        updated[idx].nationality = e.target.value
                                        setMembersState(updated)
                                    }}
                                /></div></div>
                        <div className='grid grid-cols-2 grid-rows-2'>
                            <div>
                                <strong>CMND/CCCD</strong>
                                <Input
                                    disabled={!isEditing}
                                    className='outline-0 focus:none border-0'
                                    defaultValue={member.id_number}
                                    onChange={(e) => {
                                        const updated = [...membersState]
                                        updated[idx].id_number = e.target.value
                                        setMembersState(updated)
                                    }}
                                /></div>
                            <div>
                                <strong> Nơi cấp</strong>
                                <Input
                                    disabled={!isEditing}
                                    className='outline-0 focus:none border-0'
                                    defaultValue={member.issue_place}
                                    onChange={(e) => {
                                        const updated = [...membersState]
                                        updated[idx].issue_place = e.target.value
                                        setMembersState(updated)
                                    }}
                                /></div>
                            <div>
                                <strong>Ngày cấp CCCD</strong>
                                <Input
                                    disabled={!isEditing}
                                    className='outline-0 focus:none border-0'
                                    defaultValue={member.issue_date}
                                    onChange={(e) => {
                                        const updated = [...membersState]
                                        updated[idx].issue_date = e.target.value
                                        setMembersState(updated)
                                    }}
                                />
                            </div>
                            <div>
                                <strong>Ngày hết hạn</strong>
                                <Input
                                    disabled={!isEditing}
                                    className='outline-0 focus:none border-0'
                                    defaultValue={member.expiry_date}
                                    onChange={(e) => {
                                        const updated = [...membersState]
                                        updated[idx].expiry_date = e.target.value
                                        setMembersState(updated)
                                    }}
                                />
                            </div>
                        </div>

                        <strong>Vốn góp</strong>
                        <Input
                            disabled={!isEditing}
                            className='outline-0 focus:none border-0'
                            defaultValue={member.capital?.amount}
                            onChange={(e) => {
                                const updated = [...membersState]
                                updated[idx].capital.amount = e.target.value
                                setMembersState(updated)
                            }}
                        />
                        <hr className='my-4' />
                        <div>
                            <h3 className='my-2'><strong>Địa chỉ thường trú:</strong></h3>

                            <div>
                                <strong>
                                    Số nhà, ngách, hẻm, ngõ, đường phố/tổ/xóm/ấp/thôn:
                                </strong>
                                <Input
                                    disabled={!isEditing}
                                    className='outline-0 focus:none border-0'
                                    defaultValue={member.address?.permanent?.street}
                                    onChange={(e) => {
                                        const updated = [...membersState]
                                        updated[idx].address.permanent.street = e.target.value
                                        setMembersState(updated)
                                    }}
                                />
                            </div>
                            <div>
                                <strong>
                                    Xã/Phường/Thị trấn:

                                </strong>
                                <Input
                                    disabled={!isEditing}
                                    className='outline-0 focus:none border-0'
                                    defaultValue={member.address?.permanent?.ward}
                                    onChange={(e) => {
                                        const updated = [...membersState]
                                        updated[idx].address.permanent.ward = e.target.value
                                        setMembersState(updated)
                                    }}
                                />
                            </div>
                            <div>
                                <strong>
                                    Quận/Huyện/Thị xã/Thành phố thuộc tỉnh:
                                </strong>
                                <Input
                                    disabled={!isEditing}
                                    className='outline-0 focus:none border-0'
                                    defaultValue={member.address?.permanent?.district}
                                    onChange={(e) => {
                                        const updated = [...membersState]
                                        updated[idx].address.permanent.district = e.target.value
                                        setMembersState(updated)
                                    }}
                                />
                            </div>
                            <div>
                                <strong>
                                    Tỉnh/Thành phố:
                                </strong>
                                <Input
                                    disabled={!isEditing}
                                    className='outline-0 focus:none border-0'
                                    defaultValue={member.address?.permanent?.city}
                                    onChange={(e) => {
                                        const updated = [...membersState]
                                        updated[idx].address.permanent.city = e.target.value
                                        setMembersState(updated)
                                    }}
                                />
                            </div>
                            <div>
                                <strong>
                                    Quốc gia:
                                </strong>
                                <Input
                                    disabled={!isEditing}
                                    className='outline-0 focus:none border-0'
                                    defaultValue={member.address?.permanent?.country}
                                    onChange={(e) => {
                                        const updated = [...membersState]
                                        updated[idx].address.permanent.country = e.target.value
                                        setMembersState(updated)
                                    }}
                                />
                            </div>
                        </div>
                        <hr className='my-4' />
                        <div>
                            <h3 className='my-2'><strong>Địa chỉ liên lạc:</strong></h3>

                            <div>
                                <strong>
                                    Số nhà, ngách, hẻm, ngõ, đường phố/tổ/xóm/ấp/thôn:
                                </strong>
                                <Input
                                    disabled={!isEditing}
                                    className='outline-0 focus:none border-0'
                                    defaultValue={member.address?.contact?.street}
                                    onChange={(e) => {
                                        const updated = [...membersState]
                                        updated[idx].address.contact.street = e.target.value
                                        setMembersState(updated)
                                    }}
                                />
                            </div>
                            <div>
                                <strong>
                                    Xã/Phường/Thị trấn: Phường Ngọc Lâm

                                </strong>
                                <Input
                                    disabled={!isEditing}
                                    className='outline-0 focus:none border-0'
                                    defaultValue={member.address?.contact?.ward}
                                    onChange={(e) => {
                                        const updated = [...membersState]
                                        updated[idx].address.contact.ward = e.target.value
                                        setMembersState(updated)
                                    }}
                                />
                            </div>
                            <div>
                                <strong>
                                    Quận/Huyện/Thị xã/Thành phố thuộc tỉnh
                                </strong>
                                <Input
                                    disabled={!isEditing}
                                    className='outline-0 focus:none border-0'
                                    defaultValue={member.address?.contact?.district}
                                    onChange={(e) => {
                                        const updated = [...membersState]
                                        updated[idx].address.contact.district = e.target.value
                                        setMembersState(updated)
                                    }}
                                />
                            </div>
                            <div>
                                <strong>
                                    Tỉnh/Thành phố:
                                </strong>
                                <Input
                                    disabled={!isEditing}
                                    className='outline-0 focus:none border-0'
                                    defaultValue={member.address?.contact?.city}
                                    onChange={(e) => {
                                        const updated = [...membersState]
                                        updated[idx].address.contact.city = e.target.value
                                        setMembersState(updated)
                                    }}
                                />
                            </div>
                            <div>
                                <strong>
                                    Quốc gia:
                                </strong>
                                <Input
                                    disabled={!isEditing}
                                    className='outline-0 focus:none border-0'
                                    defaultValue={member.address?.contact?.country}
                                    onChange={(e) => {
                                        const updated = [...membersState]
                                        updated[idx].address.contact.country = e.target.value
                                        setMembersState(updated)
                                    }}
                                />
                            </div>
                        </div>

                    </div>
                ))}
            </section>
            {/* Người đại diện pháp luật */}
            <section>
                <div className="flex justify-between pb-4">
                    <h2 className="text-xl font-semibold mb-4">👥 Người đại diện pháp luật</h2>
                </div>
                {representativeState.map((member: any, idx) => (
                    <div key={idx} className="border rounded p-4 mb-4 bg-white shadow-sm space-y-2">
                     <div className='grid grid-cols-2 '>
                        <div>
                            <strong >Họ tên</strong>
                            <Input
                                disabled={!isEditing}
                                className='outline-0 focus:none border-0'

                                defaultValue={member.name}
                                onChange={(e) => {
                                    const updated = [...membersState]
                                    updated[idx].name = e.target.value
                                    setMembersState(updated)
                                }}
                            />
                        </div>
                        <div>
                            <strong >Giới tính</strong>
                            <Input
                                disabled={!isEditing}
                                className='outline-0 focus:none border-0'

                                defaultValue={member.sex}
                                onChange={(e) => {
                                    const updated = [...membersState]
                                    updated[idx].sex = e.target.value
                                    setMembersState(updated)
                                }}
                            />
                        </div>
                        <div>
                            <strong>Ngày sinh</strong>
                            <Input
                                disabled={!isEditing}
                                className='outline-0 focus:none border-0'
                                defaultValue={member.birthdate}
                                onChange={(e) => {
                                    const updated = [...membersState]
                                    updated[idx].birthdate = e.target.value
                                    setMembersState(updated)
                                }}
                            />
                        </div>
                        <div>
                            <strong>Dân tộc</strong>
                            <Input
                                disabled={!isEditing}
                                className='outline-0 focus:none border-0'
                                defaultValue={member.ethnic}
                                onChange={(e) => {
                                    const updated = [...membersState]
                                    updated[idx].ethnic = e.target.value
                                    setMembersState(updated)
                                }}
                            />
                        </div>
                        <div>
                            <strong>Quốc tịch</strong>
                            <Input
                                disabled={!isEditing}
                                className='outline-0 focus:none border-0'
                                defaultValue={member.nationality}
                                onChange={(e) => {
                                    const updated = [...membersState]
                                    updated[idx].nationality = e.target.value
                                    setMembersState(updated)
                                }}
                            />
                        </div>
                        <div>
                            <strong>Chức danh</strong>
                            <Input
                                disabled={!isEditing}
                                className='outline-0 focus:none border-0'
                                defaultValue={member.position}
                                onChange={(e) => {
                                    const updated = [...membersState]
                                    updated[idx].position = e.target.value
                                    setMembersState(updated)
                                }}
                            />
                        </div>
</div>
                        <hr className='my-4' />
                        <div>
                            <h3 className='my-2'><strong>Địa chỉ thường trú:</strong></h3>

                            <div>
                                <strong>
                                    Số nhà, ngách, hẻm, ngõ, đường phố/tổ/xóm/ấp/thôn:
                                </strong>
                                <Input
                                    disabled={!isEditing}
                                    className='outline-0 focus:none border-0'
                                    defaultValue={member.address?.permanent?.street}
                                    onChange={(e) => {
                                        const updated = [...membersState]
                                        updated[idx].address.permanent.street = e.target.value
                                        setMembersState(updated)
                                    }}
                                />
                            </div>
                            <div>
                                <strong>
                                    Xã/Phường/Thị trấn: Phường Ngọc Lâm

                                </strong>
                                <Input
                                    disabled={!isEditing}
                                    className='outline-0 focus:none border-0'
                                    defaultValue={member.address?.permanent?.ward}
                                    onChange={(e) => {
                                        const updated = [...membersState]
                                        updated[idx].address.permanent.ward = e.target.value
                                        setMembersState(updated)
                                    }}
                                />
                            </div>
                            <div>
                                <strong>
                                    Quận/Huyện/Thị xã/Thành phố thuộc tỉnh
                                </strong>
                                <Input
                                    disabled={!isEditing}
                                    className='outline-0 focus:none border-0'
                                    defaultValue={member.address?.permanent?.district}
                                    onChange={(e) => {
                                        const updated = [...membersState]
                                        updated[idx].address.permanent.district = e.target.value
                                        setMembersState(updated)
                                    }}
                                />
                            </div>
                            <div>
                                <strong>
                                    Tỉnh/Thành phố:
                                </strong>
                                <Input
                                    disabled={!isEditing}
                                    className='outline-0 focus:none border-0'
                                    defaultValue={member.address?.permanent?.city}
                                    onChange={(e) => {
                                        const updated = [...membersState]
                                        updated[idx].address.permanent.city = e.target.value
                                        setMembersState(updated)
                                    }}
                                />
                            </div>
                            <div>
                                <strong>
                                    Quốc gia:
                                </strong>
                                <Input
                                    disabled={!isEditing}
                                    className='outline-0 focus:none border-0'
                                    defaultValue={member.address?.permanent?.country}
                                    onChange={(e) => {
                                        const updated = [...membersState]
                                        updated[idx].address.permanent.country = e.target.value
                                        setMembersState(updated)
                                    }}
                                />
                            </div>
                        </div>
                        <hr className='my-4' />

                        <div>
                            <h3 className='my-2'><strong>Địa chỉ liên lạc:</strong></h3>

                            <div>
                                <strong>
                                    Số nhà, ngách, hẻm, ngõ, đường phố/tổ/xóm/ấp/thôn:
                                </strong>
                                <Input
                                    disabled={!isEditing}
                                    className='outline-0 focus:none border-0'
                                    defaultValue={member.address?.contact?.street}
                                    onChange={(e) => {
                                        const updated = [...membersState]
                                        updated[idx].address.contact.street = e.target.value
                                        setMembersState(updated)
                                    }}
                                />
                            </div>
                            <div>
                                <strong>
                                    Xã/Phường/Thị trấn: Phường Ngọc Lâm

                                </strong>
                                <Input
                                    disabled={!isEditing}
                                    className='outline-0 focus:none border-0'
                                    defaultValue={member.address?.contact?.ward}
                                    onChange={(e) => {
                                        const updated = [...membersState]
                                        updated[idx].address.contact.ward = e.target.value
                                        setMembersState(updated)
                                    }}
                                />
                            </div>
                            <div>
                                <strong>
                                    Quận/Huyện/Thị xã/Thành phố thuộc tỉnh
                                </strong>
                                <Input
                                    disabled={!isEditing}
                                    className='outline-0 focus:none border-0'
                                    defaultValue={member.address?.contact?.district}
                                    onChange={(e) => {
                                        const updated = [...membersState]
                                        updated[idx].address.contact.district = e.target.value
                                        setMembersState(updated)
                                    }}
                                />
                            </div>
                            <div>
                                <strong>
                                    Tỉnh/Thành phố:
                                </strong>
                                <Input
                                    disabled={!isEditing}
                                    className='outline-0 focus:none border-0'
                                    defaultValue={member.address?.contact?.city}
                                    onChange={(e) => {
                                        const updated = [...membersState]
                                        updated[idx].address.contact.city = e.target.value
                                        setMembersState(updated)
                                    }}
                                />
                            </div>
                            <div>
                                <strong>
                                    Quốc gia:
                                </strong>
                                <Input
                                    disabled={!isEditing}
                                    className='outline-0 focus:none border-0'
                                    defaultValue={member.address?.contact?.country}
                                    onChange={(e) => {
                                        const updated = [...membersState]
                                        updated[idx].address.contact.country = e.target.value
                                        setMembersState(updated)
                                    }}
                                />
                            </div>
                        </div>

                    </div>
                ))}

            </section>

            {/* Thuế */}
            <section>
                <div className=''>

                    <div className="flex justify-between pb-4">
                        <h2 className="text-xl font-semibold mb-4">💼 Thông tin thuế</h2>
                    </div>
                    <div className='border rounded p-4 mb-4 bg-white shadow-sm space-y-2'>
                        <strong>Địa chỉ thuế</strong>
                        <Input
                            disabled={!isEditing}
                            className='outline-0 focus:none border-0'
                            defaultValue={taxState.address}
                            onChange={(e) => setTaxState({ ...taxState, address: e.target.value })}
                        />
                        <strong>Số nhân sự</strong>
                        <Input
                            disabled={!isEditing}
                            className='outline-0 focus:none border-0'
                            defaultValue={taxState.numEmployees}
                            onChange={(e) => setTaxState({ ...taxState, numEmployees: +e.target.value })}
                        />
                        <strong>Kế toán</strong>
                        <Input
                            disabled={!isEditing}
                            className='outline-0 focus:none border-0'
                            defaultValue={taxState.accountant}
                            onChange={(e) => setTaxState({ ...taxState, accountant: e.target.value })}
                        />
                    </div>
                </div>
            </section>

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
