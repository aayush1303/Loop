"use client";
import React, { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Delimiter from '@editorjs/delimiter';
import Alert from 'editorjs-alert';
import List from "@editorjs/list";
import NestedList from '@editorjs/nested-list';
import Checklist from '@editorjs/checklist';
import Embed from '@editorjs/embed';
import SimpleImage from 'simple-image-editorjs';
import Table from '@editorjs/table';
import CodeTool from '@editorjs/code';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { useUser } from '@clerk/nextjs';
import GenerateAITemplate from './GenerateAITemplate';

function DocumentEditor({ params }) {
  const editorRef = useRef(); // Use useRef for editor instance
  const { user } = useUser();
  let isFetched = false; // Track if document has been fetched

  useEffect(() => {
    if (user) {
      initEditor();
    }
  }, [user]);

  const saveDocument = () => {
    // Use editorRef instead of ref
    editorRef.current.save().then(async (outputData) => {
      const docRef = doc(db, 'documentOutput', params?.documentid);
      try {
        await updateDoc(docRef, {
          output: JSON.stringify(outputData),
          editedBy: user?.primaryEmailAddress?.emailAddress
        });
      } catch (error) {
        console.error("Error saving document:", error);
      }
    });
  };

  const getDocument = async () => {
    const unsubscribe = onSnapshot(doc(db, 'documentOutput', params?.documentid), (doc) => {
      if (!isFetched || doc.data()?.editedBy !== user?.primaryEmailAddress?.emailAddress) {
        const output = doc.data()?.output;
        if (output) {
          try {
            editorRef.current.render(JSON.parse(output));
          } catch (error) {
            console.error("Error rendering document output:", error);
          }
        }
        isFetched = true;
      }
    });
  };

  const initEditor = () => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        onChange: () => {
          saveDocument();
        },
        onReady: () => {
          getDocument();
        },
        holder: 'editorjs',
        tools: {
          header: Header,
          delimiter: Delimiter,
          list: List,
          nestedList: NestedList,
          checklist: Checklist,
          embed: Embed,
          image: SimpleImage,
          table: Table,
          code: CodeTool,
          alert: {
            class: Alert,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+M',
            config: {
              alertTypes: ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'],
              defaultType: 'primary',
              messagePlaceholder: 'Enter a message',
            },
          },
        },
      });
      editorRef.current = editor; // Assign editor to ref
    }
  };

  return (
    <div>
      <div id='editorjs' className='w-[100%]'></div>
      <div className='fixed bottom-10 md:ml-80 left-0 z-10'>
        <GenerateAITemplate setGenerateAIOutput={(output) => editorRef.current?.render(output)} />
      </div>
    </div>
  );
}

export default DocumentEditor;
