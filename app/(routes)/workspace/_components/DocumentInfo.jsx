"use client";
import CoverPicker from '@/app/_components/CoverPicker'
import React, { useEffect,useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button';
import { SmilePlus } from 'lucide-react';
import EmojiPickerComponent from '@/app/_components/EmojiPickerComponent';
import { doc,onSnapshot, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { toast } from 'sonner';


function DocumentInfo({ params }) {
  const [coverImage, setCoverImage] = useState('/cover.png');
  const [emoji, setEmoji] = useState('');
  const [documentInfo, setDocumentInfo] = useState({});

  useEffect(() => {
      if (params?.documentid) {
          getDocumentInfo();
      }
  }, [params?.documentid]);

  console.log('Document ID:', params?.documentid);

  const getDocumentInfo = async () => {
      try {
          const docRef = doc(db, 'workspaceDocuments', params?.documentid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
              const data = docSnap.data();
              console.log('data', data);
              setDocumentInfo(data);
              setEmoji(data?.emoji || ''); // Set emoji or empty string if undefined
              if (data?.coverImage) {
                  setCoverImage(data.coverImage); // Only update if coverImage exists
              }
          } else {
              console.log('No such document!');
          }
      } catch (error) {
          console.error('Error fetching document info:', error);
      }
  };

  const updateDocumentInfo = async (key, value) => {
      if (!key || value === undefined) {
          console.error('Invalid key or value:', key, value);
          return;
      }

      try {
          const docRef = doc(db, 'workspaceDocuments', params?.documentid);
          await updateDoc(docRef, {
              [key]: value,
          });
          toast('Document Info Updated');
      } catch (error) {
          console.error('Error updating document:', error);
      }
  };



  return (
    <div>
        {/* cover */}
        <CoverPicker setNewCover={(cover)=>{setCoverImage(cover),updateDocumentInfo('coverImage',cover)}}>
        <div className='relative group cursor-pointer'>
            <h2 className='hidden absolute p-4 w-full h-full items-center group-hover:flex justify-center'>Change Cover</h2>
            <div className='group-hover:opacity-40'>
              <Image src={coverImage} width={400} height={200} className='w-full h-[180px] object-cover rounded-t-lg' />
            </div>
          </div>
        </CoverPicker>
        {/* emoji picker */}
        <div className='absolute ml-10 mt-[-40px] cursor-pointer'>
        <EmojiPickerComponent setEmojiIcon={(emoji)=>{setEmoji(emoji),updateDocumentInfo('emoji',emoji)}}>
        <div className='bg-[#ffffff] p-4 rounded-md'>
                {emoji ? <span className='text-5xl'>{emoji}</span> : <SmilePlus className='h-10 w-10 text-gray-400' />}
        </div>           
        </EmojiPickerComponent>
        </div>
        {/* file name */}
        <div className='mt-10 p-10'>
            <input type="text" 
            placeholder='Untitled Document'
            defaultValue={documentInfo?.documentName}
            className='font-bold text-2xl outline-none'
            onBlur={(e)=>updateDocumentInfo('documentName',e.target.value)}
             />
        </div>
    </div>
  )
}

export default DocumentInfo