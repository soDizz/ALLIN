'use client';

import { motion } from 'motion/react';
import { Chat } from './chat/Chat';
import { Header } from './chat/Header';
import { FeedbackPopup } from './FeedbackPopup';
import { Initializer } from './initializer/Initializer';

export const Main = () => {
  // useEffect(() => {
  //   const exa = new ExaClient({
  //     apiKey: '6f27502c-27ee-46c0-8af7-9d02b49c8d40',
  //   });

  //   exa
  //     .search({
  //       query: 'what time is it in Seoul?',
  //     })
  //     .then(res => {
  //       console.log(res);
  //     });
  // }, []);

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
