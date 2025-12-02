import styles from "./Chat.module.css";
import { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import "highlight.js/styles/github-dark.css"

function Chat() {
  const { reply, newChat, prevChat, setPrevChat, setNewChat } = useContext(MyContext);
  const [ latestReply, setLatestReply ] = useState(null);
  
  useEffect(() => {
    // latest reply have typing effect 
    if(reply === null){
      setLatestReply(null);
      return;
    }
    if (!prevChat?.length) return;
    const content = reply.split(" ");
    let idx = 0;
    const interval = setInterval(() => {
        setLatestReply(content.slice(0,idx+1).join(" "))
        idx++;
        if(idx >= content.length) clearInterval(interval)
    },40)    
    return () => clearInterval(interval);
  },[prevChat,reply])
  return (
    <>
      {newChat && <h1>Where should we begin?</h1>}
      <div className={styles.chats}>
        {prevChat?.slice(0,-1).map((chat, idx) => (
          <div
            key={idx}
            className={chat.role === "user" ? styles.userDiv : styles.gptDiv}
          >
            {chat.role === "user" ? (
              <p className={styles.userMessage}>{chat.content}</p>
            ) : (
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
            )}
          </div>
        ))}
        {
          prevChat.length > 0 && (
            <>
            {
              latestReply === null ? (
                <div className={styles.gptDiv} key={"nontyping"}>
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChat[prevChat.length-1].content}</ReactMarkdown>
                </div>
              ) : (
                <div className={styles.gptDiv} key={"typing"}>
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
            </div>
              )
            }
            </>
          )
        }
      </div>
    </>
  );
}

export default Chat;
