import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/useAuthStore'
import { showSuccess, showError } from '../../../shared/utils/toast'
import ExpressDark from "../../../assets/img/express-ligth-2.png"
import { Icon } from '../../../shared/components/ui/Icons'

export const ResetPasswordPage = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const { resetPassword, loading } = useAuthStore()
  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    const response = await resetPassword(token, data.password)
    if (response.success) {
      showSuccess("Contraseña restablecida correctamente.")
      navigate('/')
    } else {
      showError(response.error)
    }
  }

  const password = watch("password");

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
      
        <div className='bg-background-base/60 backdrop-blur-xl border border-white/10 rounded-3xl sm:rounded-4xl shadow-[0_0_50px_rgba(0,0,0,0.4)] p-8 sm:p-10 flex flex-col gap-6 relative z-10'>
          
          {/* Gorro de cocinero */}
          <div className="absolute -right-16 -top-12 z-50 pointer-events-auto hidden sm:block rotate-30 cursor-pointer group">
            <Icon name="hatchief" className='h-32 w-32 animate-vibrate' />
          </div>

          { /* LOGO */}
          <div className="mb-2 flex justify-center">
            <img src={ExpressDark} alt="Express Logo" className='w-20 lg:w-24 drop-shadow-lg' />
          </div>

          <div className='flex flex-col items-center gap-2 mb-2'>
             <h2 className='text-3xl font-bold text-white text-center'>Nueva Contraseña</h2>
             <p className='text-sm text-gray-300 text-center px-4'>Ingresa tu nueva clave de acceso y asegúrate de no olvidarla.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            
            <div className='flex flex-col gap-1'>
              <label className='text-xs text-secondary ml-1 font-medium'>Nueva Contraseña</label>
              <input 
                type="password" 
                placeholder="********"
                disabled={loading}
                {...register("password", { 
                  required: "La contraseña es obligatoria",
                  minLength: { value: 6, message: "Mínimo 6 caracteres" }
                })}
                className={`bg-transparent border ${errors.password ? 'border-red-500' : 'border-white/20'} rounded-xl p-3 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-gray-500 disabled:opacity-50 text-white`}
              />
              {errors.password && <span className="text-red-500 text-xs ml-1">{errors.password.message}</span>}
            </div>

            <div className='flex flex-col gap-1'>
              <label className='text-xs text-secondary ml-1 font-medium'>Confirmar Contraseña</label>
              <input 
                type="password" 
                placeholder="********"
                disabled={loading}
                {...register("confirmPassword", { 
                  required: "Por favor confirma la contraseña",
                  validate: value => value === password || "Las contraseñas no coinciden"
                })}
                className={`bg-transparent border ${errors.confirmPassword ? 'border-red-500' : 'border-white/20'} rounded-xl p-3 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-gray-500 disabled:opacity-50 text-white`}
              />
              {errors.confirmPassword && <span className="text-red-500 text-xs ml-1">{errors.confirmPassword.message}</span>}
            </div>

            <button 
              type="submit"
              disabled={loading}
              className='relative flex items-center justify-center bg-primary text-white font-bold p-3 rounded-xl mt-4 hover:bg-[#991f23] transition-all active:scale-[0.98] overflow-hidden disabled:opacity-80'
            >
              {loading ? (
                <svg className="w-5 h-5 animate-spin-slow text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v2m0 12v2m8-8h-2M6 12H4m13.657-5.657l-1.414 1.414M7.757 17.657l-1.414 1.414m12.728 0l-1.414-1.414M7.757 6.343L6.343 4.929" />
                </svg>
              ) : (
                "Guardar Contraseña"
              )}
            </button>

            <div className='flex flex-col items-center gap-4 mt-2'>
              <button 
                type="button" 
                onClick={() => navigate('/')}
                className='text-sm border border-white/20 rounded-xl p-3 w-full hover:bg-white/5 hover:border-primary hover:text-white transition-colors text-white font-medium'
              >
                Volver al <span className='font-bold ml-1 text-primary'>Login</span>
              </button>
            </div>
            
          </form>

        </div>
      </div>
    </div>
  )
}