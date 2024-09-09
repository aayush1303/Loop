"use client";
import React, { useEffect } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { InboxNotificationList,InboxNotification } from '@liveblocks/react-ui'
import { useInboxNotifications, useUnreadInboxNotificationsCount, useUpdateRoomNotificationSettings } from '@liveblocks/react/suspense'
import { doc,onSnapshot, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';

function NotificationBox({children,params}) {
    
    const {inboxNotifications} = useInboxNotifications()
     const updateRoomNotificationSettings=useUpdateRoomNotificationSettings() 
     const {count,error,isLoading}=useUnreadInboxNotificationsCount()

     useEffect(()=>{
        updateRoomNotificationSettings({threads:'all'})
        getDocumentInfo();
     },[])
     const getDocumentInfo = async () => {
        try {
            const docRef = doc(db, 'workspaceDocuments', params?.documentid);
            const docSnap = await getDoc(docRef);
  
            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log('data', data);
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
    return (
        <Popover>
            <PopoverTrigger><div className='flex'>{children} <span className='p-1 rounded-full bg-primary text-[7px] text-white flex items-center justify-center w-4 h-4 mt-[-8px] absolute ml-2.5'>{count}</span></div></PopoverTrigger>
            <PopoverContent className={'w-[500px]'}>
            <InboxNotificationList>
                {inboxNotifications.map((inboxNotification)=>(
                    <InboxNotification
                    key={inboxNotification.id}
                    inboxNotification={inboxNotification}/>
                ))
                }
            </InboxNotificationList>
            </PopoverContent>
        </Popover>
    )
}

export default NotificationBox