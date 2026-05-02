import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../store/useAuthStore'
import { showSuccess, showError } from '../../../shared/utils/toast'

export const ResetPasswordPage = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const { confirmPasswordReset, loading } = useAuthStore()
  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    const response = await confirmPasswordReset(token, data.password)
    if (response.success) {
      showSuccess("Contraseña restablecida correctamente.")
      navigate('/')
    } else {
      showError(response.error)
    }
  }

  const password = watch("password");

  return (
    <div className='min-h-screen w-full bg-background-base bg-checkerboard flex items-center justify-center p-4 relative overflow-hidden'>
      
      <div className='w-full max-w-md'>
      
        <div className='liquid-glass p-8 sm:p-10 rounded-[2rem] flex flex-col gap-6 relative z-10'>
          
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