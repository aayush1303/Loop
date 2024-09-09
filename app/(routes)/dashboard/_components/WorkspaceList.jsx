"use client";
import React,{useEffect,useState} from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button';
import { AlignLeft, LayoutGrid } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import WorkspaceItemList from './WorkspaceItemList';
import { getDocs, query } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { collection, where } from 'firebase/firestore';
function WorkspaceList() {

    const { user } = useUser()
    const {orgId} = useAuth();
    const [workspaceList, setWorkspaceList] = useState([])

    useEffect(() => {
        user&&getWorkspaceList()
    },[orgId,user])

    const getWorkspaceList = async () => {
        setWorkspaceList([])
        const q=query(collection(db,'Workspace'),where('orgId','==',orgId?orgId:user?.primaryEmailAddress?.emailAddress))
        const querySnapshot=await getDocs(q);

        querySnapshot.forEach((doc) => {
            console.log(doc.data())
            setWorkspaceList((prev)=>[...prev,doc.data()])
        })
    }
    return (
        <div className='my-10 p-10 md:px-24  lg:px-36 xl:px-52'>
            <div className='justify-between flex'>
                <h2 className='font-bold text-2xl'>Hello, <span className='font-bold text-2xl text-purple-400'>{user?.fullName}</span></h2>
                <Link href={'/createworkspace'}>
                    <Button>+</Button>
                </Link>
            </div>
            <div className='mt-10 flex justify-between'>
                <div>
                    <h2 className='font-bold text-primary'>Workspaces</h2>
                </div>
                <div className='flex gap-2'>
                    <LayoutGrid />
                    <AlignLeft />
                </div>
            </div>
            {workspaceList?.length == 0 ?
                <div className='flex flex-col justify-center items-center my-10'>
                    <Image src={'/workspace.png'} width={200} height={200} />
                    <h2>Create a new workspace</h2>
                    <Link href={'/createworkspace'}>
                        <Button variant="outline" className="my-3">+<span className='ml-1.5'>New Workspace</span></Button>
                    </Link>
                </div>
                :
                <div >
                    <WorkspaceItemList workspaceList={workspaceList}/>
                </div>
            }
        </div>
    )
}


export default WorkspaceList