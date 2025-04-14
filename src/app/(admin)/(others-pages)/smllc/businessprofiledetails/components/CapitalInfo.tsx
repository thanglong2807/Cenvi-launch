import Input from '@/components/form/input/InputField'

interface CapitalInfoProps {
  companyState: {
    amount: string
    text: string
    currency: string
  }
  setCompanyState: (state: any) => void
  isEditing: boolean
}

export default function CapitalInfo({
  companyState,
  setCompanyState,
  isEditing
}: CapitalInfoProps) {
  return (
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
  )
} 