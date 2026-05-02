import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { verifyEmail } from '../../../shared/api/auth'
import { showSuccess, showError } from '../../../shared/utils/toast'
import { Icon } from '../../../shared/components/ui/Icons'

export const VerifyEmailPage = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (!token) {
            setLoading(false)
            return
        }

        const verify = async () => {
            try {
                await verifyEmail(token)
                setSuccess(true)
                showSuccess("Correo verificado correctamente")
            } catch (error) {
                showError("El enlace de verificación es inválido o ha expirado")
            } finally {
                setLoading(false)
            }
        }

        verify()
    }, [token])

    return (
        <div className='min-h-screen w-full bg-background-base bg-checkerboard flex items-center justify-center p-4 relative overflow-hidden'>
            <div className='w-full max-w-md'>
                <div className='liquid-glass p-8 sm:p-10 rounded-[2rem] flex flex-col gap-6 relative z-10 items-center justify-center text-center'>
                    
                    <div className="bg-primary/20 p-4 rounded-full mb-2">
                         {loading ? (
                             <svg className="w-12 h-12 animate-spin text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v2m0 12v2m8-8h-2M6 12H4m13.657-5.657l-1.414 1.414M7.757 17.657l-1.414 1.414m12.728 0l-1.414-1.414M7.757 6.343L6.343 4.929" />
                             </svg>
                         ) : success ? (
                             <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                             </svg>
                         ) : (
                             <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                             </svg>
                         )}
                    </div>

                    <div className='flex flex-col items-center gap-2'>
                        <h2 className='text-3xl font-bold text-white'>
                            {loading ? 'Verificando...' : success ? '¡Verificado!' : 'Error de Verificación'}
                        </h2>
                        
                        <p className='text-sm text-gray-300 mt-2'>
                            {loading 
                                ? 'Espera un momento mientras comprobamos tu enlace...' 
                                : success 
                                    ? 'Tu dirección de correo ha sido verificada con éxito. Ya puedes iniciar sesión.' 
                                    : 'No pudimos verificar tu correo. Puede que el enlace esté incompleto o haya expirado.'}
                        </p>
                    </div>

                    {!loading && (
                        <button 
                            onClick={() => navigate('/')}
                            className='w-full relative flex items-center justify-center bg-primary text-white font-bold p-3 rounded-xl mt-4 hover:bg-[#991f23] transition-all active:scale-[0.98] overflow-hidden'
                        >
                            Ir a Iniciar Sesión
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
