import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { verifyEmail } from '../../../shared/api/auth'
import { showSuccess, showError } from '../../../shared/utils/toast'
import ExpressDark from '../../../assets/img/Express-ligth-2.png'
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

    // Animación de los iconos
    const floatingVariants = {
        animate: (i) => ({
        y: [0, Math.sin(i) * 60, Math.cos(i+1) * -70, Math.sin(i * 2) * 50, 0],
        x: [0, Math.cos(i) * 60, Math.sin(i+1) * 70, Math.cos(i * 2) * -50, 0],
        rotate: [0, 20, -15, 25, -10, 0],
        transition: {
            duration: 15 + (i % 4) * 4,
            ease: "easeInOut",
            repeat: Infinity,
            delay: i * 0.3
        }
        }),
        hover: {
        scale: 1.5,
        filter: "saturate(2) brightness(1.3)",
        transition: { duration: 0.3 }
        }
    };

    // Iconos
    const bgIcons = [
        { name: "bread", style: { top: "10%", left: "5%" }, color: "text-amber-700" },
        { name: "cucumber", style: { bottom: "10%", left: "8%" }, color: "text-green-600" },
        { name: "chicken", style: { bottom: "5%", left: "40%" }, color: "text-amber-600" },
        { name: "potato", style: { top: "15%", left: "45%" }, color: "text-orange-400" },
        { name: "fish", style: { bottom: "55%", right: "10%" }, color: "text-blue-500" },
        { name: "knife", style: { top: "10%", right: "8%" }, color: "text-gray-500" },
        { name: "chili", style: { bottom: "45%", left: "15%" }, color: "text-red-600" },
        { name: "cheese", style: { bottom: "15%", right: "5%" }, color: "text-yellow-500" },
    ];

    return (
        <div className='min-h-screen w-full bg-background-base bg-checkerboard flex items-center justify-center p-4 relative overflow-hidden text-white'>
            
            {/* ICONOS SVG DE FONDO  */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {bgIcons.map((icon, i) => (
                    <motion.div
                        key={icon.name}
                        custom={i}
                        variants={floatingVariants}
                        animate="animate"
                        whileHover="hover"
                        className={`absolute cursor-pointer pointer-events-auto opacity-40 sm:opacity-80 lg:opacity-100 ${icon.color} hover:brightness-125 drop-shadow-md`}
                        style={icon.style}
                    >
                        <Icon name={icon.name} className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 transition-all duration-300" />
                    </motion.div>
                ))}
            </div>

            <div className='w-full max-w-md'>
                <div className='bg-background-base/60 backdrop-blur-xl border border-white/10 rounded-3xl sm:rounded-4xl shadow-[0_0_50px_rgba(0,0,0,0.4)] p-8 sm:p-10 flex flex-col gap-6 relative z-10 items-center justify-center text-center'>
                    
                    {/* Gorro de cocinero */}
                    <div className="absolute -right-16 -top-12 z-50 pointer-events-auto hidden sm:block rotate-30 cursor-pointer group">
                        <Icon name="hatchief" className='h-32 w-32 animate-vibrate' />
                    </div>

                    { /* LOGO */}
                    <div className="mb-2 flex justify-center">
                        <img src={ExpressDark} alt="Express Logo" className='w-20 lg:w-24 drop-shadow-lg' />
                    </div>

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
