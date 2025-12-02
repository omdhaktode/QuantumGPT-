import styles from "./ChatWindow.module.css";
import Chat from "./Chat";
import { MyContext } from "./MyContext";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from 'react-spinners';

function ChatWindow() {
  const {prompt,setPrompt,reply,setReply,currThreadID,setCurrThreadID,prevChat,setNewChat,setPrevChat} = useContext(MyContext);
  const [loading, setLoading ] = useState(false);
  const [ isOpen, setIsOpen ] = useState(false); // dropdown  
  const handleChange = (event) => {
    setPrompt(event.target.value)
  }

  const handleSend = async () => {
    setLoading(true);
    setNewChat(false);
      const options = {
        method : "POST",
        headers : {
          "Content-type" : "application/json"
        },
        body : JSON.stringify({
          message : prompt,
          threadID : currThreadID
        })
      };
       
      try {
        const response = await fetch("http://localhost:8080/api/chat", options);
        const res = await response.json();
        console.log(res.reply)
        setReply(res.reply)
      } catch (error) {
        console.log(error)
      }
      setLoading(false);
  }

  // Append new chat to previous chat 
   useEffect(() => {
      if(prompt && reply) {
        setPrevChat(prevChat => (
          [...prevChat, {
            role : "user",
            content : prompt
          },{
            role : "assistant",
            content : reply
          }]
        )) 
      }
      setPrompt("");
   },[reply]);

  const handleProfile = () => {
    setIsOpen(!isOpen)
  } 
  
  return (
    <div className={styles.chatWindow}>
      <div className={styles.navbar}>
        <span>
        QuantumGPT<i className="fa-solid fa-angle-down"></i>
        </span>
        <div className={styles.userIcon}>
          <span className={styles.user}>
            <i onClick={handleProfile} className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>
      {
          isOpen &&
          <div className={styles.dropdown}>
            <div className={styles.dropdownItem}>
            <i class="fa-solid fa-cloud-arrow-up"></i> Upgrade plan
            </div>
            <div className={styles.dropdownItem}>
            <i class="fa-solid fa-gear"></i> Settings
            </div>
            <div className={styles.dropdownItem}>
            <i class="fa-solid fa-right-from-bracket"></i> Log out
            </div> 
          </div>  
        }
      <Chat />
      <ScaleLoader color="#fff" loading={loading}></ScaleLoader>
      <div className={styles.chatInput}>
        <div className={styles.userInput}>
            <input type="text" placeholder="Ask anything" value={prompt} onChange={() => handleChange(event)} onKeyDown={(e) => e.key === 'Enter' ? handleSend() : null}/>
            <div className={styles.submit} onClick={handleSend}><i className="fa-solid fa-paper-plane"></i></div>
        </div>
        <p className={styles.info}>
        QuantumGPT can make mistakes. Check important info. See Cookie Preferences.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
