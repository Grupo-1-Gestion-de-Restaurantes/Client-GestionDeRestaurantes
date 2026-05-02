import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

export const UnauthorizedPage = () => {
    const navigate = useNavigate()
    const { isAuthenticated, logout } = useAuthStore()

    const handleBack = () => {
        if (isAuthenticated) {
            navigate("/dashboard")
        } else {
            navigate("/")
        }
    }

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    return (
        <div className='min-h-screen w-full bg-background-base bg-checkerboard flex items-center justify-center p-4 relative overflow-hidden'>
            <div className='w-full max-w-md'>
                <div className='liquid-glass p-8 sm:p-10 rounded-[2rem] flex flex-col gap-6 relative z-10 items-center justify-center text-center'>
                    
                    <div className="bg-red-500/20 p-4 rounded-full mb-2">
                        <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>

                    <div className='flex flex-col items-center gap-2'>
                        <h2 className='text-4xl font-bold text-white'>403</h2>
                        <h3 className='text-2xl font-bold text-secondary'>Acceso Denegado</h3>
                        
                        <p className='text-sm text-gray-300 mt-2 px-4'>
                            No tienes los permisos necesarios para acceder a esta sección. Intenta iniciar sesión con otra cuenta o regresa a tu zona segura.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 w-full mt-4">
                        <button 
                            onClick={handleBack}
                            className='w-full relative flex items-center justify-center bg-primary text-white font-bold p-3 rounded-xl hover:bg-[#991f23] transition-all active:scale-[0.98] overflow-hidden'
                        >
                            Regresar a lugar seguro
                        </button>
                        
                        <button 
                            onClick={handleLogout}
                            className='w-full relative flex items-center justify-center border border-white/20 text-white font-bold p-3 rounded-xl hover:bg-white/5 transition-all outline-none'
                        >
                            Cerrar sesión
                        </button>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
