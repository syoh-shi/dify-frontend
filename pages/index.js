import { useState } from "react";
import axios from 'axios';
import LoadingAnimation from "./components/LoadingAnimation";
import Image from "next/image";
import Link from 'next/link';

// メッセージ内のURLをハイパーリンクに変換する関数
const parseMessage = (message) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return message.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <Link key={index} href={part} legacyBehavior>
          <a target="_blank" rel="noopener noreferrer" className="underline text-blue-400">{part}</a>
        </Link>
      );
    }
    return part;
  });
};

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setChatLog((prevChatLog) => [...prevChatLog, { type: 'user', message: inputValue }])
    sendMessage(inputValue);
    setInputValue('');
  }

  const sendMessage = (message) => {
    const url = '/api/chat';

    const data = {
      model: "gpt-3.5-turbo",
      messages: [{ "role": "user", "content": message }]
    };
    setIsLoading(true);
    axios.post(url, data).then((response) => {
      console.log(response);
      setChatLog((prevChatLog) => [...prevChatLog, { type: 'bot', message: response.data.answer }])
      setIsLoading(false);
    }).catch((error) => {
      setIsLoading(false);
      console.log(error);
    })
  }

  return (
    <div className="container mx-auto max-w-[700px] px-3">
      <div className="flex flex-col justify-between min-h-screen h-[100%]">
        <div>
          <div>
          <Image className="py-5" src="/JREChat_logo.png" alt="logo" width={100} height={30}/>
          </div>
          <h1 className="text-[#008803] text-center font-extrabold sm:text-6xl text-5xl py-5">Ask to Us</h1>

          <div className="flex flex-col space-y-4">
            {chatLog.map((message, index) => (
              message.message && (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`${message.type === 'user' ? 'bg-[#008803]' : 'bg-[#194d19]'} rounded-lg sm:p-4 p-2 text-white max-w-[90%]`}>
                    {parseMessage(message.message)}
                  </div>
                </div>
              )
            ))}
            {isLoading && (
              <div key="chatLog.length" className="flex justify-start">
                <div className="bg-[#fff] border border-[#ddd] rounded-lg p-4 text-white">
                  <LoadingAnimation />
                </div>
              </div>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex-none py-10">
          <div className="flex rounded-lg bg-[#ddd]">
            <input type="text" className="flex-grow px-5 py-3 bg-transparent text-[#333] focus:outline-none" placeholder="Send a message" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            <button type="submit" className=" bg-[#008803] rounded-r-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300">Send</button>
          </div>
        </form>
      </div>
    </div>
  )
}