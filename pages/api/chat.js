import axios from 'axios';


export default async function handler(req, res) {
  const referer = req.headers.referer || req.headers.referrer;

  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method should be POST' });
  } else if (process.env.NODE_ENV !== "development") {
    if (!referer || referer !== process.env.APP_URL) {
      res.status(401).json({ message: 'Unauthorized' });
    }
  }
  else {
    try {
      require('dotenv').config();
      
      /*OpenAI API
      const { body } = req;
      const body_message = body.messages[0].content;
      console.log(body_message);
      const url = 'https://api.openai.com/v1/chat/completions';
      const headers = {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      };
      
      const response = await axios.post(url, body, { headers : headers })
      */

      /* DIFY API */ 
      const { body } = req;
      const query = body.messages[0].content;
      const url = 'https://demo.jreretrivalchatbotdemo.click//v1/chat-messages';
      const headers = {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${process.env.DIFY_API_KEY}`
      };
      
      const body_message = JSON.stringify({
        query: query,
        response_mode: 'blocking'
      });

      const data = {
        inputs: {},
        query: query,
        response_mode: "blocking",
        conversation_id: "",
        user: "local123",
        files: []
      };

      const response = await axios.post(url, data, {
        headers: headers,
      })
      
      
      /* response.dataをJSON形式に変換
      const parts = response.data.split('/n/n');
      const jsonObjects = parts.map(part => {
        try {
          return JSON.parse(part);
        } catch (error) {
          console.error('JSON変換のエラー:', error);
        }
      })
      console.log(jsonObjects);
      */
     
      console.log(response.data)
      res.status(200).json(response.data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
}