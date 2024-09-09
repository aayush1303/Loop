"use client";
import Logo from '@/app/_components/Logo'
import { Bell, Loader2Icon } from 'lucide-react'
import React, { useEffect,useState } from 'react'
import { Button } from '@/components/ui/button'
import { collection, onSnapshot, query,where } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import DocumentList from './DocumentList';
import uuid4 from 'uuid4';
import { setDoc,doc } from 'firebase/firestore';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Progress } from "@/components/ui/progress"
import { toast } from 'sonner';
import NotificationBox from './NotificationBox';
import { LiveblocksProvider } from '@liveblocks/react/suspense';


function SideNav({params}) {

  const {user} = useUser();
  const router = useRouter();
  const[documentList,setDocumentList]=useState([])
  const[loading,setLoading]=useState(false)

  const MAX_FILE=5;

  useEffect(() => {
    if (params) {
      const q = query(collection(db, 'workspaceDocuments'), where('workspaceId', '==', params?.workspaceid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const newDocuments = [];
        querySnapshot.forEach((doc) => {
          newDocuments.push(doc.data());
        });
        setDocumentList(newDocuments);
      });
  
      // Clean up listener on unmount or params change
      return () => unsubscribe();
    }
  }, [params]);

console.log('hello',documentList);   


  const createWorkspaceDocument = async (docId, workspaceId) => {
    try {
      await setDoc(doc(db, 'workspaceDocuments', docId.toString()), {
        workspaceId: workspaceId,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        coverImage: null,
        emoji: null,
        id: docId,
        documentName: 'Untitled Document',
        documentOutput: [],
      });
      console.log("Document created in workspaceDocuments");
    } catch (error) {
      console.error("Error creating document in workspaceDocuments:", error);
      throw error;  // Re-throw the error to be caught by the main function
    }
  };

  const createDocumentOutput = async (docId) => {
    try {
      await setDoc(doc(db, 'documentOutput', docId.toString()), {
        docId: docId,
        output: [],
      });
      console.log("Document created in documentOutput");
    } catch (error) {
      console.error("Error creating document in documentOutput:", error);
      throw error;  // Re-throw the error to be caught by the main function
    }
  };
   
  const CreateNewDocument = async () => {

    if(documentList.length>=MAX_FILE){
      toast('Upgrade your plan for unlimited access', 'error',
        {
          description: "You have reached the maximum number of files allowed in your current plan.",
          action: {
            label: "Upgrade",
            onClick: () => console.log("Undo"),
          },
        }
      )
      return;
    }

    const docId = uuid4();
    const workspaceId = params?.workspaceid;
    setLoading(true);
    try {
      // First, create the document in 'workspaceDocuments'
      await createWorkspaceDocument(docId, workspaceId);
  
      // Then, create the document in 'documentOutput'
      await createDocumentOutput(docId);
  
    } catch (error) {
      console.error("Error during document creation:", error);
    } finally {
      setLoading(false);
      router.replace('/workspace/' + workspaceId + '/' + docId);
    }
  };
  

  return (
    <div className='h-screen md:w-72 hidden md:block fixed bg-blue-50 p-3 px-5 shadow-md'>
        <div className='flex justify-between items-center'>
            <Logo/>
            
            <NotificationBox params={params}>
            <Bell className='h-5 w-5 text-gray-500'/>
            </NotificationBox>
        </div>
        <hr className='my-5'></hr>
        <div>
            <div className='flex justify-between items-center'>
            <h2 className='font-medium'>Workspace Name</h2>
            <Button size="sm" onClick={CreateNewDocument}>
                {loading?<Loader2Icon className='h-4 w-4 animate-spin'/>:'+'}</Button>
            </div>
        </div>


        <DocumentList documentList={documentList}
        params={params}/>



       <div className='absolute bottom-10 w-[85%]'>
          <Progress value={(documentList?.length/MAX_FILE)*100}/>
          <h2 className='text-sm font-light my-2'><strong>{documentList?.length}</strong> Out of <strong>5</strong> files used</h2>
          <h2 className='text-sm font-light'>Upgrade your plan for unlimited access</h2>
       </div>
    </div>
  )
}

export default SideNav