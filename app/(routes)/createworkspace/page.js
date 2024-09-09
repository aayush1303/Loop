"use client";
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button';
import { Loader2Icon, SmilePlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import CoverPicker from '@/app/_components/CoverPicker';
import EmojiPickerComponent from '@/app/_components/EmojiPickerComponent';
import { setDoc, doc } from 'firebase/firestore';

import { useRouter } from 'next/navigation';
import { db } from '@/config/firebaseConfig';
import { useAuth, useUser } from '@clerk/nextjs';
import uuid4 from 'uuid4';


function CreateWorkspace() {
  const [coverImage, setCoverImage] = React.useState('/cover.png')
  const [workspaceName, setWorkspaceName] = React.useState('')
  const [emoji, setEmoji] = React.useState('')
  const { user } = useUser()
  const { orgId } = useAuth()

  const [loading, setLoading] = React.useState(false)

  const router=useRouter()
  
  
  // Create a new workspace
  const OnCreateWorkspace = async () => {
    setLoading(true);
    const workspaceId = Date.now().toString();
    const docId=uuid4();
    try {
      await setDoc(doc(db, 'Workspace', workspaceId), {
        workspaceName: workspaceName,
        emoji: emoji,
        coverImage: coverImage,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        id: workspaceId,
        orgId: orgId ? orgId : user?.primaryEmailAddress?.emailAddress
      });
       
      await setDoc(doc(db, 'workspaceDocuments', docId.toString()),{
        workspaceId: workspaceId,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        coverImage:null,
        emoji:null,
        id: docId,
        documentName:'Untitled Document',
        documentOutput:[],
      })

      await setDoc(doc(db,'documentOutput',docId.toString()),{
        docId:docId,
        output:[],
      })

    } catch (error) {
      console.error("Error creating workspace:", error);
    } finally {
      setLoading(false);
      router.replace('/workspace/' + workspaceId+'/'+docId)
    }
  };


  
  return (
    <div className='p-10 md:px-36 lg:px-64 xl:px-96 py-28'>
      <div className='shadow-2xl rounded-xl'>
        <CoverPicker setNewCover={(v) => setCoverImage(v)}>
          <div className='relative group cursor-pointer'>
            <h2 className='hidden absolute p-4 w-full h-full items-center group-hover:flex justify-center'>Change Cover</h2>
            <div className='group-hover:opacity-40'>
              <Image src={coverImage} width={400} height={400} className='w-full h-[180px] object-cover rounded-t-lg' />
            </div>
          </div>
        </CoverPicker>
        <div className='p-12'>
          <h2 className='font-medium text-xl'>Create a new workspace</h2>
          <h2 className='mt-2 text-sm'>This is a shared space where you can collaborate with your team. You can always rename it later</h2>
          <div className='mt-8 flex gap-2 items-center'>
            <EmojiPickerComponent setEmojiIcon={(v) => setEmoji(v)}>
              <Button variant='outline'>
                {emoji ? emoji : <SmilePlus />}
              </Button>
            </EmojiPickerComponent>
            <Input placeholder="Workspace Name"
              onChange={(e) => setWorkspaceName(e.target.value)} />
          </div>
          <div className='mt-5 justify-end flex gap-6'>
            <Button disabled={!workspaceName?.length || loading}
              onClick={OnCreateWorkspace}>Create{loading && <Loader2Icon className='animate-spin ml-2' />}</Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateWorkspace