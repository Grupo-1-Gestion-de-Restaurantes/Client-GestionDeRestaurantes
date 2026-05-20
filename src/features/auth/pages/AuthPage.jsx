import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import AuthImage from "../../../assets/img/auth-image.jpeg"
import ExpressDark from '../../../assets/img/Express-ligth-2.png'
import { LoginForm } from '../components/LoginForm'
import { RegisterForm } from '../components/RegisterForm'
import { ForgotPasswordForm } from '../components/ForgotPasswordForm'
import { Icon } from '../../../shared/components/ui/Icons'

export const AuthPage = ({ children }) => {

  const location = useLocation()
  const [currentView, setCurrentView] = useState('login')

  useEffect(() => {
    if (location.state?.view) {
      setCurrentView(location.state.view)
    }
  }, [location.state])

  // Variantes de la animacion para transición de forms
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 15 : -15,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 15 : -15,
      opacity: 0,
      scale: 0.98,
    })
  };

  const directionAnimation = currentView === 'register' ? 1 : -1;

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
    <div className='min-h-screen w-full bg-background-base bg-checkerboard text-white flex flex-row relative overflow-hidden'>

      {/* Imagen de fondo para cell */}
      <div className='absolute inset-0 z-0 lg:hidden'>
        <img 
          src={AuthImage} 
          alt="Auth Mobile Background" 
          className='w-full h-full object-cover opacity-30 mask-[linear-gradient(to_bottom,black_40%,transparent_100%)] mix-blend-overlay'
        />
      </div>

      {/* LADO DEL FORMULARIO */}
      <div className='w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 py-4 relative z-10 min-h-screen lg:h-screen lg:overflow-y-auto overflow-x-hidden'>
        
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

        {/* Contenedor de los forms */}
        <div className='w-full max-w-112.5 sm:max-w-120 mx-auto flex flex-col justify-center p-6 sm:p-8 bg-background-base/60 backdrop-blur-xl border border-white/10 rounded-3xl sm:rounded-4xl shadow-[0_0_50px_rgba(0,0,0,0.4)] relative z-10 lg:my-auto my-6'>
          
          {/* Gorro de cocinero */}
          <div className="absolute -right-20 -top-14 z-50 pointer-events-auto hidden sm:block rotate-30 cursor-pointer group">
            <Icon name="hatchief" className='h-40 w-40 animate-vibrate' />
          </div>

          { /* LOGO */}
          <div className="mb-4 lg:mb-14 flex justify-center lg:justify-start">
            <img src={ExpressDark} alt="Express Logo" className='w-20 lg:w-24 drop-shadow-lg' />
          </div>

          {/*  Formularios  */}
          <div className="relative w-full grow grid items-center">
            <AnimatePresence mode="wait" custom={directionAnimation}>
              <motion.div
                key={currentView}
                custom={directionAnimation}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "tween", duration: 0.3, ease: "easeOut" },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3, ease: "easeInOut" }
                }}
                className="col-start-1 row-start-1 w-full"
              >
                {currentView === 'login' && (
                  <div className="w-full h-full flex flex-col justify-center">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center lg:text-left w-full leading-tight mb-5 drop-shadow-md">
                      Nosotros <span className='text-primary'>nos encargamos</span> del <span className='text-primary'>caos</span> para que  <span className='text-primary'>tú no</span> lo hagas.
                    </h1>
                    <LoginForm onSwitch={setCurrentView} />
                  </div>
                )}
                {currentView === 'register' && (
                  <div className="w-full h-full flex flex-col justify-center">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center lg:text-left w-full leading-tight mb-5 drop-shadow-md">
                      Únete a la <span className='text-secondary'>revolución</span> de tu <span className='text-secondary'>restaurante</span>.
                    </h1>
                    <RegisterForm onSwitch={setCurrentView} />
                  </div>
                )}
                {currentView === 'forgot' && (
                  <div className="w-full h-full flex flex-col justify-center">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center lg:text-left w-full leading-tight mb-5 drop-shadow-md">
                      ¿Ataque de <span className='text-primary'>amnesia</span>? <br />Te ayudamos a <span className='text-secondary'>entrar</span>.
                    </h1>
                    <ForgotPasswordForm onSwitch={setCurrentView} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className='hidden lg:flex w-1/2 p-6 h-screen sticky top-0'>
        <div className='relative w-full h-full overflow-hidden rounded-t-full rounded-b-4xl lg:rounded-t-2xl border border-white/5 mask-l-from-50% mask-l-to-90%'>
          <img 
            src={AuthImage} 
            alt="Auth Background" 
            className='absolute inset-0 w-full h-full object-cover' 
          />
        
          <div className="absolute inset-0 bg-linear-to-t from-background-base/50 to-transparent mix-blend-overlay"></div>
        </div>
      </div>

    </div>
  )
}