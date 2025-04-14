'use client'

import { useState } from 'react'
import CompanyRegisterForm from './businessformationform/CompanyRegisterForm'
import ContactPage from './businessformationform/ContactPage'
import Addressform from './businessformationform/Addressform'
import LegalRepresentativePage from './businessformationform/LegalRepresentative'
import ShareholdersPage from './businessformationform/Shareholders'
import AccountantPage from './businessformationform/Accountant'
import BusinessCodePage from './businessformationform/BusinessCode'

export default function AddNewBusinessPage() {
  const [showForm, setShowForm] = useState(false)
  const [step, setStep] = useState(1)

  return (
    <div className="p-6">
            {step === 1 && <CompanyRegisterForm currentStep={step} setStep={setStep} onClose={() => setShowForm(false)} />}
            {step === 2 && <ContactPage currentStep={step} setStep={setStep} onClose={() => setShowForm(false)} />}
            {step === 3 && <Addressform currentStep={step} setStep={setStep} onClose={() => setShowForm(false)} />}
            {step === 4 && <LegalRepresentativePage currentStep={step} setStep={setStep} onClose={() => setShowForm(false)} />}
            {step === 5 && <ShareholdersPage currentStep={step} setStep={setStep} onClose={() => setShowForm(false)} />}
            {step === 6 && <AccountantPage currentStep={step} setStep={setStep} onClose={() => setShowForm(false)} />}
            {step === 7 && <BusinessCodePage currentStep={step} setStep={setStep} onClose={() => setShowForm(false)} />}
    </div>
  )
}