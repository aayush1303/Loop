"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { collection, query, where } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { getDocs } from "firebase/firestore";

export function Room({ children,params }) {
  return (
    <LiveblocksProvider 
    authEndpoint={"/api/liveblocks-auth?roomId="+params?.documentid}
    resolveUsers={async({userIds})=>{
      console.log('User IDs:', userIds);
        const q=query(collection(db,'LoopUsers'),where('email','in',userIds));
        const querySnapshot=await getDocs(q);
        const userList=[];
        querySnapshot.forEach((doc)=>{
        console.log(doc.data())
         userList.push(doc.data())
        })

        return userList;
    }}
    resolveMentionSuggestions={async ({ text, roomId }) => {
      console.log('Search Text:', text);
      console.log('Room ID:', roomId);
      
      const q = query(collection(db, 'LoopUsers'), where('email', '!=', null));
      const querySnapshot = await getDocs(q);
      let userList = [];
  
      querySnapshot.forEach((doc) => {
        userList.push(doc.data());
      });
  
      if (text) {
        userList = userList.filter((user) => user.name.includes(text));
      }
  
      return userList.map((user) => user.email);  // Return user email or unique identifier
    }}
  >
      <RoomProvider id={params?.documentid}>
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}