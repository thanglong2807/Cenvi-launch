'use client'

import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Button from '@/components/ui/button/Button'
import React, { useState } from 'react'

interface CompanyRegisterFormProps {
    setStep: (step: number) => void;
    currentStep: number; // Optional
  }
const CompanyRegisterForm:React.FC<CompanyRegisterFormProps> = ({  setStep, currentStep }) => {
    const [showResults, setShowResults] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState('vi')
    const [searchResultsCompanyRegister, setsearchResultsCompanyRegister] = useState<{is_duplicate: boolean} | null>(null)

    const handleNextClick = () => {
        setStep(2); // Chuyển sang step 2
    };

    const checkDuplicateBusinessName = async () => {
        try {
            const companyName = document.getElementById('namebussinessvietnam') as HTMLInputElement;
        
            
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ONRENDER}company/check-duplicate?limit=10`, {
                
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ten: companyName.value,
                    loai: selectedLanguage
                })
            });

            if (response.ok) {
                const data = await response.json();
                setsearchResultsCompanyRegister(data);
                setShowResults(true);
            } else {
                console.error('Error checking company name');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    
    return (
       <>
     
                <div className='flex justify-between'>
                    <h3 className=' text-xl '>Nhập tên công ty ( Bước {currentStep} )</h3>
                   
                </div>


                <div className="flex gap-1.5 ">
                    <div className="flex flex-col flex-1/2 gap-2">
                    <div>

                            <Label htmlFor='companytype' >Nhập loại công ty</Label>
                            <select className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700' id='companytype' >
                                    <option value="công ty cổ phần">công ty cổ phần</option>
                                    <option value="Công ty TNHH 1 tv">Công ty TNHH 1 tv</option>
                                    <option value="Công ty TNHH 2 tv">Công ty TNHH 2 tv</option>
                            </select>
                        </div>
                        <div>

                            <Label htmlFor='namebussinessvietnam' >Nhập tên công ty Tiếng Việt</Label>
                            <Input className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700' id='namebussinessvietnam' placeholder='Nhập tên công ty' type='text' />
                        </div>
                        <div>

                            <Label htmlFor='namebussinessen' >Tên Công ty Tiếng Anh (nếu có)</Label>
                            <Input className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700' id='namebussinessen' placeholder='Nhập tên công ty Tiếng Anh' type='text' />
                        </div>
                        <div>

                            <Label htmlFor='namebussinessacronym' >Tên Công ty viết tắt (nếu có)</Label>
                            <Input className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700' id='namebussinessacronym' placeholder='Nhập tên công ty Viết tắt' type='text' />
                        </div>



                        <Label htmlFor="kiem-tra-trung">Kiểm tra trùng</Label>
                        <div className='flex justify-between gap-5'>
                        <select 
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700'
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                        > 
                            <option value="vi">Tên tiếng việt</option>
                            <option value="en">Tên tiếng anh</option>
                            <option value="abb">Tên viết tắt</option>
                        </select>
                            <Button onClick={checkDuplicateBusinessName} className='w-[140px]' >
                                Kiểm tra
                            </Button >
                        </div>

                        {showResults && searchResultsCompanyRegister && (
                            <div className="ket-qua">
                                {!searchResultsCompanyRegister.is_duplicate ? <p>Có công ty trùng tên</p> : <p>Không có công ty trùng tên</p>}  
                            </div>
                        )}

                       
                    </div>
                    <div className="flex-1/2">
                        <h4>Các lưu ý khi đặt tên</h4>
                        <hr />
                        <br />
                        <h4>Notes:</h4>
                        <p>
                            Nếu khách hàng sử dụng gói bảo hành thì sẽ được tặng miễn phí gói tra cứu tên thương
                            hiệu trên Cục SHTT để phục vụ cho việc đăng ký bảo hộ độc quyền thương hiệu sau này.
                        </p>
                    </div>
                    
                </div>
                <div className='flex gap-5'>

                <Button className='mt-4 w-full' >  Cancel</Button>
                <Button onClick={handleNextClick} className='mt-4 w-full' >  Next</Button>
                </div>
                </>
    )
}

export default CompanyRegisterForm
