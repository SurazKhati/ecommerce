import { Avatar } from 'flowbite-react';
import React, { useCallback, useEffect } from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import chatService from './chat.service';
import LoadingComponent from '../../components/common/loading/loading.component';

interface ChatItemProps {
  _id: string;
  name: string;
  image: string;
  message: any;
  clickEvent: any;
  
}
interface Message{
  id: string ;
  sender : 'user' | 'friend';
  timestamp : string;
  content: string
}

const ChatItem: React.FC<ChatItemProps> = ({ _id ,name,  message, image , clickEvent}) => {
  return (
    <div 
    onClick={() =>{
        clickEvent(_id)
    }}
    className="flex items-centre p-4 border-b border-gray-300 mb-4 border-t shadow-lg hover:bg-gray-200 cursor-pointer">
      {/* <Avatar img={image ? import.meta.env.VITE_IMAGE_URL+'/user/'+image:''} rounded={true}  className="w-12 h-12 object-cover" /> */}
      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
  <img
    src={image ? import.meta.env.VITE_IMAGE_URL + '/user/' + image : ''}
    alt={name}
    className="w-full h-full object-cover"
  />
</div>

      <div className="ml-4 flex-grow">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-semibold">{name}</h4>
          <span className="text-sm text-gray-500">{ message && message.length ? message[0].date : ''}</span>
        </div>
        <p className="text-gray-500">{message && message.length ? message[0].message: '' }</p>
      </div>
    </div>
  );
};



const ChatView : React.FC= () => {
    const [chatList, setChatList] = useState<any>()

    const [currentChat, setCurrentChat] = useState<any>()
    const [loading ,setLoading] = useState<boolean>(false)

    const [messages, setMessages] = useState<Message[]>([
      { id: '1', sender: 'friend', content: 'Hey there!', timestamp: '10:30 AM' },
      { id: '2', sender: 'user', content: 'Hello! How are you?', timestamp: '10:31 AM' },
      { id: '3', sender: 'friend', content: 'I am good, thanks!', timestamp: '10:32 AM' },
      // Add more messages as needed
    ]);
    
    const [newMessage, setNewMessage] = useState('');
    
    const handleSendMessage = () => {
      if (newMessage.trim() !== '') {
        setMessages([
          ...messages,
          {
            id: (messages.length + 1).toString(),
            sender: 'user',
            content: newMessage.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setNewMessage('');
      }
    };

    const getChatList = useCallback(async()=>{
      try{

        const response:any = await chatService.getRequest('/chat/list',{auth:true} )
        setChatList(response.result)

      }catch(exception){
        
        toast.error("Error loading chat list")
        

      }
    },[chatList])
    
   useEffect(()=>{

    getChatList()

   },[])
   const handleSelectChat = async(id: string)=>{
    try{
      
      // setCurrentChat()

    }catch(exception)
    {
      console.log(exception)
      toast.error("error loading chat message")
    }

   }
    return (
     <div className=' p-6'>
      <div className="flex">
        <div className="w-1/4 bg-slate-200 min-h-screen border-r border-solid border-slate-300 border-spacing-2">
        {
          chatList && chatList.map((item:any, i:number) =>(
            <ChatItem {...item} key={i} clickEvent ={handleSelectChat}></ChatItem>
          ))
        }
        </div>
        <div className="w-3/4 bg-slate-200">
        {
          loading?<>
          <LoadingComponent/>
          </>: (
            currentChat ?
             <>
              <div className="bg-blue-600 text-white p-4 flex items-center">
            <div className="flex items-center space-x-4">
              <img src="https://placehold.co/400x400" alt="Friend Avatar" className="w-10 h-10 rounded-full" />
              <div>
                <h3 className="text-lg font-semibold">Friend's Name</h3>
                <p className="text-sm text-blue-200">Online</p>
              </div>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs rounded-lg p-3 ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-500 text-white'
                        }`}
                      >
                        <p>{message.content}</p>
                        <small className={`text-xs ${
                          message.sender === 'user' ? 'text-white': 'text-gray-800'
                        } text-gray-200 mt-1 block italic`}>
                          {message.timestamp}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>

        </div>
        <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center">
                <input
                    type="text"
                    className="flex-1 border rounded-t px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-t hover:bg-blue-600"
                    onClick={handleSendMessage}
                >
                    Send
                </button>
            </div>
        </div>            
            
            </>:<div className='bg-slate-100  m-auto flex items-center justify-center h-screen'> Select a User First</div>
          )
        }
        

        </div>
      </div>
     </div>
    );
  };
  
export default ChatView;