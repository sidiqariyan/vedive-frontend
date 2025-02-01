import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavbarMenu } from '../../NavbarData/data'

function ResponsiveMenu({ open }) {
  return (
    <AnimatePresence className="wait">
      {
        open && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0, y: -50 }} 
            className='absolute top-16 left-0 w-full h-screen bg-white-600 z-10'
          >
            <div className='text-l font-semibold uppercase bg-black text-white py-10 m-2 rounded-3xl'>
              <ul className="flex flex-col justify-center items-center gap-10">
                {NavbarMenu.map(item => {
                  return ( // Add return statement here
                    <li key={item.id} id={item.id}>
                      <a href={item.url}>{item.title}</a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )
      }
    </AnimatePresence>
  )
}

export default ResponsiveMenu
