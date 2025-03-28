'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Button from '@/components/ui/button/Button'
import Input from '@/components/form/input/InputField'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import CompanyRegisterForm from '../../(ui-elements)/businessformationform/CompanyRegisterForm'
import ContactPage from '../../(ui-elements)/businessformationform/ContactPage'
import Addressform from '../../(ui-elements)/businessformationform/Addressform'
import Shareholders from '../../(ui-elements)/businessformationform/Shareholders'
import LegalRepresentativePage from '../../(ui-elements)/businessformationform/LegalRepresentative'
import AccountantPage from '../../(ui-elements)/businessformationform/Accountant'
import BusinessCodePage from '../../(ui-elements)/businessformationform/BusinessCode'
import Cookies from 'js-cookie'

type Company = {
  id: string
  name: string
  address: string
  owner: string         // Người mua hàng
  profile: string
  status: string
  userwf: string        // Người phụ trách
  created_at: string    // dd/mm/yyyy
}

export interface CompanyProfile {
  status: string
  id: number
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
  company: CompanyInfo
  owner: Person
  representatives: Person[]
  industries: Industry[]
  tax: TaxInfo
  ox_bhxh_1m: boolean
  ox_bhxh_3m: boolean
  ox_bhxh_6m: boolean
}

export interface CompanyInfo {
  name: {
    full: string
    foreign: string
    short: string
  }
  address: Address
  contact: Contact
  license: License
  capital: Capital
}

export interface Address {
  detail: string
  ward: string
  district: string
  city: string
  country: string
}

export interface Contact {
  phone: string
  fax: string
  email: string
  website: string
}

export interface License {
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

export interface Capital {
  amount: number
  text: string
  currency: string
  yn_equivalent_value: boolean
}

export interface Person {
  name: string
  sex: string
  position?: string
  birthdate: string
  ethnic: string
  nationality: string
  status:string
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
    permanent: Location
    contact: Location
  }
  contact: {
    phone: string
    email: string
  }
}

export interface Location {
  street: string
  ward: string
  district: string
  city: string
  country: string
}

export interface Industry {
  is_main: boolean
  code: string
  description: string
  note: string
}

export interface TaxInfo {
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

type ApiResponse = {
  id: string
  emp_name: string
  status: string
  userwf: string
  created_at: string
  cus_name: string
  metadata: {
    general:{
      date: {
          day: number,
          month: number,
          year: number
        }
    }
    company: {
      name: { full: string }
      address: {
        detail: string
      }
    }
  }
}

export default function Smllc() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'Tất cả' | 'Đang xử lý' | 'Đã duyệt' | 'Đã hủy'>('Tất cả')

  const [showForm, setShowForm] = useState(false)
  const [step, setStep] = useState(1)

  // Fetch data
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          console.warn('⚠️ Không có token. Không thể lấy dữ liệu.');
          return;
        }
  
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const mapped = res.data.map((data:CompanyProfile) => {
          const date = data?.metadata?.general?.date;
          const formattedDate = date
            ? `${String(date.day).padStart(2, '0')}/${String(date.month).padStart(2, '0')}/${date.year}`
            : '';
          console.log(data);
          
          return {
            id: data.id || '',
            name: data?.metadata?.company?.name?.full || '',
            address: data?.metadata?.company?.address?.detail || '',
            owner: data?.cus_name || '',
            userwf: data?.emp_name || '',
            status: data?.status || '',
            profile: '',
            created_at: formattedDate,
          };
        });
  
        setCompanies(mapped);
        setFilteredCompanies(mapped);
      } catch (err: any) {
        console.error('❌ Error fetching companies:', err.message || err);
      }
    };
  
    fetchCompanies();
  }, []);
  
  

  // Filter logic
  useEffect(() => {
    const filtered = companies.filter((company) => {
      const keywordMatch =
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.userwf.toLowerCase().includes(searchTerm.toLowerCase())

      const statusMatch =
        statusFilter === 'Tất cả' || company.status === statusFilter

      return keywordMatch && statusMatch
    })

    setFilteredCompanies(filtered)
  }, [searchTerm, statusFilter, companies])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const handleAddCompanyClick = () => {
    setStep(1)
    setShowForm(true)
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Danh sách công ty</h2>

      {/* Header Action */}
      <div className="flex justify-between items-center">
        <Button onClick={handleAddCompanyClick} className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all">
          Thêm công ty
        </Button>

        <div className="flex gap-2 mb-4 w-[600px]">
          <Input
            placeholder="🔍 Tìm kiếm công ty..."
            defaultValue={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border rounded px-3 py-2 text-sm text-gray-700"
          >
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="Đang xử lý">Đang xử lý</option>
            <option value="Đã duyệt">Đã duyệt</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Multi-step Form */}
      {showForm && (
        <div className="fixed inset-0 bg-[#10182870] flex items-center justify-center z-[99999]">
          <div className="bg-white p-6 fl rounded shadow-md w-full max-w-3xl relative overflow-y-auto max-h-[80vh] min-h-[50vh]">
            {step === 1 && <CompanyRegisterForm currentStep={step} setStep={setStep} onClose={() => setShowForm(false)} />}
            {step === 2 && <ContactPage currentStep={step} setStep={setStep} onClose={() => setShowForm(false)} />}
            {step === 3 && <Addressform currentStep={step} setStep={setStep} onClose={() => setShowForm(false)} />}
            {step === 4 && <LegalRepresentativePage currentStep={step} setStep={setStep} onClose={() => setShowForm(false)} />}
            {step === 5 && <Shareholders currentStep={step} setStep={setStep} onClose={() => setShowForm(false)} />}
            {step === 6 && <AccountantPage currentStep={step} setStep={setStep} onClose={() => setShowForm(false)} />}
            {step === 7 && <BusinessCodePage currentStep={step} setStep={setStep} onClose={() => setShowForm(false)} />}
          </div>
        </div>
      )}

      {/* Table */}
      <Table className="min-w-full border border-gray-300 rounded shadow-sm bg-white">
        <TableHeader className="bg-gray-100 text-sm text-left">
          <TableRow>
            <TableCell className="px-4 py-2 font-semibold text-center">STT</TableCell>
            <TableCell className="px-4 py-2 font-semibold">Tên công ty</TableCell>
            <TableCell className="px-4 py-2 font-semibold">Người phụ trách</TableCell>
            <TableCell className="px-4 py-2 font-semibold">Người mua hàng</TableCell>
            <TableCell className="px-4 py-2 font-semibold">Hồ sơ</TableCell>
            <TableCell className="px-4 py-2 font-semibold">Trạng thái</TableCell>
            <TableCell className="px-4 py-2 font-semibold">Ngày tạo</TableCell>
            <TableCell className="px-4 py-2 font-semibold">Actions</TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredCompanies.map((company, index) => (
            <TableRow key={company.id}>
              <TableCell className="px-4 py-2 text-center">{index + 1}</TableCell>
              <TableCell className="px-4 py-2">{company.name}</TableCell>
              <TableCell className="px-4 py-2">{company.userwf}</TableCell>
              <TableCell className="px-4 py-2">{company.owner}</TableCell>
              <TableCell className="px-4 py-2">
                <Link
                  href={`/businessprofiledetails?id=${company.id}`}
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  Xem hồ sơ
                </Link>
              </TableCell>
              <TableCell className="px-4 py-2">{company.status}</TableCell>
              <TableCell className="px-4 py-2">{company.created_at}</TableCell>
              <TableCell className="px-4 py-2">
                <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2">Sửa</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Xoá</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
