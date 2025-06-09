// components/business-profile/CompanyInfo.tsx
import Input from '@/components/form/input'
import { CompanyState, CapitalState, GeneralInfo } from '../types'

interface CompanyInfoProps {
  companyState: CompanyState
  setCompanyState: (state: CompanyState) => void
  capitalState: CapitalState
  setCapitalState: (state: CapitalState) => void
  isEditing: boolean
  typeBussiness: string
  general: GeneralInfo
}

export default function CompanyInfo({
  companyState,
  setCompanyState,
  capitalState,
  setCapitalState,
  isEditing,
  typeBussiness,
  general
}: CompanyInfoProps) {
  return (
    <section className="mt-5">
      <div className='flex align-middle justify-between'>
        <h2 className="mb-4  text-amber-500 text-xl font-semibold">Thông tin Công ty {typeBussiness}</h2>
      </div>

      <div className='border rounded p-4 mb-4 bg-white shadow-sm space-y-2'>
        <div className="flex content-center items-center">
          <Input
          classNameLabel='text-zinc-800 text-sm font-normal flex-1'
            label="Tên công ty tiếng Việt :"
            flex="flex items-center gap-5"
           className="border border-gray-300"
            // disabled={!isEditing}
            defaultValue={companyState.fullName}
            onChange={(e) => setCompanyState({ ...companyState, fullName: e.target.value })}
          />
        </div>

        <div className="flex content-center items-center">
          <Input
            label="Tên công ty Anh :"
          classNameLabel='text-zinc-800 text-sm font-normal flex-1'

            disabled={!isEditing}
            className=' focus:none '
            defaultValue={companyState.foreign}
            onChange={(e) => setCompanyState({ ...companyState, foreign: e.target.value })}
          />
        </div>

        <div className="flex content-center items-center">
          <Input
            label="Tên công ty viết tắt:"
          classNameLabel='text-zinc-800 text-sm font-normal flex-1'

            disabled={!isEditing}
            className=' focus:none '
            defaultValue={companyState.shortName}
            onChange={(e) => setCompanyState({ ...companyState, shortName: e.target.value })}
          />
        </div>
      </div>
    </section>
  )
}
