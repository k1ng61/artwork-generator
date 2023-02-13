import Head from 'next/head'
import Image from 'next/image'

import {useState} from 'react'
import buildspaceLogo from '../assets/buildspace-logo.png'



export default function Home() {
  
  const [isGenerating, setisGenerating] = useState(false);
  const [imgUrl, setimgUrl] = useState('');
  const[input, setInput] = useState('');

  const sleep = async (milliseconds) => {
    await new Promise(resolve => {
        return setTimeout(resolve, milliseconds)
    });
};

const getInference = async (inferenceid) => {
  while (true){
    await sleep(5000);
    const options = {
      method: 'GET',
      headers: {accept: 'application/json', authorization: `Bearer ${process.env.NEXT_PUBLIC_LEAP_TOKEN}`}
      };
    const data  = await fetch(`https://api.leapml.dev/api/v1/images/models/8b1b897c-d66d-45a6-b8d7-8e32421d02cf/inferences/${inferenceid}`, options);
    const jsondata  = await data.json();
    
    if (jsondata.state === 'finished'){
      setimgUrl(jsondata.images[0].uri);
      setisGenerating(false);
      break;
    }
    
  } 

}


  const CreateInference = () => {
    setisGenerating(true);
    const options = {
      method: 'POST',
      headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: `Bearer ${process.env.NEXT_PUBLIC_LEAP_TOKEN}`
      },
      body: JSON.stringify({
          prompt: `${input}, futuristic concept art, by greg rutkowski, by Hubert Robert, HD`,
          steps: 50,
          width: 512,
          height: 512,
          numberOfImages: 1,
          seed: 4523184
      })
  };
  
  fetch('https://api.leapml.dev/api/v1/images/models/8b1b897c-d66d-45a6-b8d7-8e32421d02cf/inferences', options)
      .then(response => response.json())
      .then(response => getInference(response.id))
      .catch(err => console.error(err));
  }

  

  return (
    <>
      <div className="root">
      <Head>
        <title>Artwork Generator</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Generate Art in seconds</h1>
          </div>
          <div className="header-subtitle">
            <h2>Artwork inspired by Greg rutkowski and Hubert Robert</h2>
          </div>
          <div className="prompt-container">
        <input className="prompt-box" value={input} onChange={(e) => setInput(e.target.value)} />
        <div className="prompt-buttons">
          <a
            className={
              isGenerating ? 'generate-button loading' : 'generate-button'
            }
            onClick={CreateInference}
          >
            <div className="generate">
              {isGenerating ? (
                <span className="loader"></span>
              ) : (
                <p>Generate</p>
              )}
            </div>
          </a>
        </div>
      </div>
        </div>
        {imgUrl && (
      <div className="output-content">
        <Image src={imgUrl} width={512} height={512} alt={input} />
      </div>
    )}
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <img  src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
    </>
  )
}
