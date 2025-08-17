'use client';

import { motion } from 'motion/react';
import { Chat } from './chat/Chat';
import { Header } from './header/Header';
import { FeedbackPopup } from './FeedbackPopup';
import { Initializer } from './initializer/Initializer';
import { useEffect } from 'react';
import { getChannel, getDB } from '../idb/getDB';

export const Main = () => {
  // useEffect(() => {
  //   getDB().then(res => {
  //     console.log(res);
  //   });
  // });
  return (
    <>
      <Initializer />
      <motion.main
        className='w-full h-full gap-[12px] p-8 grow flex flex-col items-center sm:p-4'
        layout={'position'}
      >
        <Header />
        <div className='w-full h-full md:max-w-2xl lg:max-w-4xl flex justify-center items-center flex-col'>
          <Chat />
        </div>
      </motion.main>
      <FeedbackPopup />
    </>
  );
};
