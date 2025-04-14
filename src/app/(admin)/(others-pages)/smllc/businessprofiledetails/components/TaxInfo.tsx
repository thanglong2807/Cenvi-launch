import Input from '@/components/form/input/InputField'

interface TaxInfoProps {
  taxState: {
    address: string
    numEmployees: number
    accountant: string
  }
  setTaxState: (state: any) => void
  isEditing: boolean
}

export default function TaxInfo({
  taxState,
  setTaxState,
  isEditing
}: TaxInfoProps) {
  return (
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
  )
} 