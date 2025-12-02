import styles from './Sidebar.module.css'
import { useContext, useEffect } from 'react';
import  {MyContext}  from './MyContext';
import {v1 as uuidv1} from 'uuid';

function Sidebar() {
    const {allThreads,setAllThreads,currThreadID,newChat,setNewChat,setPrompt,setReply,setCurrThreadID,setPrevChat} = useContext(MyContext);
    const getAllThreads = async () => {
        try{
            const response = await fetch("http://localhost:8080/api/thread");
            const res= await response.json();
            const filterData = res.map(thread => ({threadID : thread.threadID, title : thread.title}))
            console.log(filterData)
            setAllThreads(filterData);
        } catch(error) {
            console.log(error)
        }
    }
    useEffect(()=> {
        getAllThreads();
    },[currThreadID])

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadID(uuidv1());
        setPrevChat([]); 
    }
    
    const changeThread = async (newThreadId) => {
        setCurrThreadID(newThreadId);
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
            const res =await response.json();
            console.log(res);
            setPrevChat(res);
            setNewChat(false);
            setReply(null);
        } catch(error) {
            console.log(error)
        }
    }

    const deleteThread = async (threadID) =>{
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadID}`,{method : "DELETE"});
            const res = await response.json();
            console.log(res);
            setAllThreads(prev => prev.filter(thread => thread.threadID !== threadID));
            if(threadID === currThreadID) {
                createNewChat()
            }
        } catch (error) {
            console.log(error)
        }
    }
    return ( 
        <section className={styles.sidebar}>
            <button className={styles.btn} onClick={createNewChat}>
                <img className={styles.logo} src="src/assets/blacklogo.png" alt="quantamGPT" />
                <span className={styles.icon}><i className="fa-solid fa-pen-to-square"></i></span>
            </button>
            <ul className={styles.history}>
               {allThreads?.map((ele,idx) => (
                <li key={idx} onClick={() => changeThread(ele.threadID)} className={ele.threadID === currThreadID ? styles.highlighted : ""}>{ele.title}
                <i onClick={(e) => {
                    e.stopPropagation();
                    deleteThread(ele.threadID)
                }} className={`fa-solid fa-trash ${styles.icn}`}></i>
                </li>
               ))}
            </ul>
            <div className={styles.sign}>
                <p>By StreVital &hearts;</p>
            </div>
        </section>
     );
}

export default Sidebar;