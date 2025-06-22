import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'
import ai from '../assets/ai.gif'
import user from '../assets/user.gif'
import domtoimage from 'dom-to-image';

const Home = () => {
  const { authUser, askAssistant, logout } = useAuthStore()
  const [userText, setuserText] = useState('')
  const [aiText, setaiText] = useState('')
  const navigate = useNavigate()

  const isSpeakingRef = useRef(false)
  const recognitionRef = useRef(null)
  const isRecognizingRef = useRef(false)
  const [isListening, setIsListening] = useState(false)
  const synth = window.speechSynthesis

  const handleLogout = async () => {
    const response = await logout()
    if (response) {
      console.log('logged out')
    }
  }
  const copyToClipboardFallback = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  };

  const speak = (text, callback) => {
    const speech = new SpeechSynthesisUtterance(text)
    speech.lang = 'en-US'
    isSpeakingRef.current = true
    speech.onend = () => {
      isSpeakingRef.current = false
      if (callback) callback()
      else startRecognition()
    }
    synth.speak(speech)
  }

  const handleCommand = (data) => {
    const { type, userInput, result } = data
    switch (type) {
      case 'google_search':
        window.open(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`, '_blank')
        break
      case 'youtube_search':
        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`, '_blank')
        break
      case 'youtube_play':
        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}&sp=EgIQAQ%253D%253D`, '_blank')
        break
      case 'facebook_open':
        window.open('https://www.facebook.com', '_blank')
        break
      case 'instagram_open':
        window.open('https://www.instagram.com', '_blank')
        break
      case 'calculator_open':
        window.open('https://www.google.com/search?q=calculator', '_blank')
        break
      case 'weather-show':
        window.open(`https://www.google.com/search?q=weather+${encodeURIComponent(userInput || '')}`, '_blank')
        break
      
      case 'get_battery':
        navigator.getBattery().then(battery => {
          speak(`Battery is at ${Math.floor(battery.level * 100)} percent`);
        });
        break;
      case 'screenshot':
        domtoimage.toPng(document.body)
          .then(dataUrl => {
            const link = document.createElement('a');
            link.download = 'screenshot.png';
            link.href = dataUrl;
            link.click();
            speak('Screenshot taken');
          })
          .catch(error => {
            console.error('Screenshot error:', error);
            speak('Failed to take screenshot');
          });
        break;
      
        navigator.clipboard.writeText(userInput);
        speak('Copied to clipboard');
        break;
        case 'copy_to_clipboard':
          // Focus the document first
          window.focus();
          
          // Add slight delay to ensure focus is established
          setTimeout(async () => {
            try {
              await navigator.clipboard.writeText(userInput);
              speak('Copied to clipboard');
            } catch (error) {
              console.error('Copy failed:', error);
              // Fallback method
              copyToClipboardFallback(userInput);
              speak('Copied to clipboard');
            }
          }, 100);
          break;
        
      case 'get_location':
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            speak(`Your approximate location is latitude ${position.coords.latitude}, longitude ${position.coords.longitude}`);
          });
        } else {
          speak("Geolocation is not supported");
        }
        break;
      case 'general':
        speak(result || 'No result provided.')
        return
      default:
        console.log('Unknown command type.')
    }
    speak(result || 'Here is what I found.')
  }

  const initRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = true

    recognition.onstart = () => {
      isRecognizingRef.current = true
      setIsListening(true)
      console.log('Speech recognition started')
    }

    recognition.onend = () => {
      isRecognizingRef.current = false
      setIsListening(false)
      console.log('Speech recognition ended')
      if (!isSpeakingRef.current && isListening) {
        setTimeout(startRecognition, 1000)
      }
    }

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error)
      isRecognizingRef.current = false
      setIsListening(false)

      if ((event.error === 'no-speech' || event.error === 'audio-capture' || event.error === 'network') && !isSpeakingRef.current) {
        console.log('Retrying due to no speech...')
        setTimeout(startRecognition, 1000)
      }

      if (event.error === 'abort' && !isSpeakingRef.current) {
        setTimeout(startRecognition, 1000)
      }
    }

    recognition.onresult = async (event) => {
      const command = event.results[event.results.length - 1][0].transcript.trim()
      console.log('Heard:', command)
      if (command.toLowerCase().includes(authUser.assistantName.toLowerCase())) {
        setuserText(command)
        setaiText('')
        recognition.stop()
        isRecognizingRef.current = false
        setIsListening(false)
        const data = await askAssistant({ command })
        console.log('Response:', data)
        handleCommand(data)
        setuserText('')
        setaiText(data.result || 'No response from assistant.')
      }
    }

    recognitionRef.current = recognition
  }

  const startRecognition = () => {
    if (recognitionRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current.start()
      } catch (error) {
        if (error.name !== 'InvalidStateError') {
          console.error('Recognition start error:', error)
        }
      }
    }
  }

  const stopRecognition = () => {
    if (recognitionRef.current && isRecognizingRef.current) {
      recognitionRef.current.stop()
      isRecognizingRef.current = false
      setIsListening(false)
    }
  }

  const toggleAssistant = () => {
    if (isListening) {
      stopRecognition()
    } else {
      speak(`Hello ${authUser.name}, how can I assist you today?`, () => {
        startRecognition()
      })
    }
  }

  const handleCustomizeAssistant = () => {
    stopRecognition()
    navigate('/assistant_select')
  }

  useEffect(() => {
    initRecognition()
    return () => {
      stopRecognition()
      recognitionRef.current = null
    }
  }, [askAssistant, authUser.assistantName])

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] flex flex-col items-center justify-center p-4 relative overflow-hidden'>
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 animate-pulse"></div>

      {/* Main Content */}
      <div className='backdrop-blur-lg bg-[#232526]/80 border border-[#2c5364]/50 shadow-2xl rounded-2xl p-8 md:p-12 max-w-4xl w-full transition-all duration-300 relative z-10'>
        <h1 className='text-3xl md:text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-lg'>
          Welcome back, <span className="text-blue-400">{authUser.name}</span>!
        </h1>

        <div className='flex flex-col lg:flex-row items-center lg:items-start gap-8'>
          {/* Assistant Image */}
          <div className="relative">
            <img
              src={authUser.assistantImage}
              alt={`${authUser.assistantName} Image`}
              className='w-48 h-48 object-cover rounded-full border-4 border-blue-400 shadow-2xl transition-all duration-300'
            />
            {isListening && (
              <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping"></div>
            )}
          </div>

          {/* Assistant Info */}
          <div className='text-center lg:text-left flex-1'>
            <h2 className='text-2xl md:text-3xl font-bold mb-4 text-gray-200'>
              Your Assistant: <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">{authUser.assistantName}</span>
            </h2>
            <div className="bg-[#1a1a2e]/80 rounded-xl p-4 mb-6">
              <p className='text-gray-300 text-lg mb-2'>
                <span className="text-blue-400 font-semibold">Email:</span> {authUser.email}
              </p>
              <p className='text-gray-300 text-lg'>
                <span className="text-purple-400 font-semibold">Status:</span>
                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${isListening ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-200'
                  }`}>
                  {isListening ? 'Listening...' : 'Ready'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center mt-8'>
          <button
            onClick={toggleAssistant}
            className={`px-8 py-3 rounded-xl font-bold text-white transition-all duration-200 shadow-lg ${isListening
              ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
              : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
              }`}
          >
            {isListening ? '🛑 Stop Listening' : '🎤 Start Assistant'}
          </button>

          <button
            onClick={handleCustomizeAssistant}
            className='px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-purple-700 hover:to-blue-800 rounded-xl text-white font-bold transition-all duration-200 shadow-lg'
          >
            ⚙️ Customize Assistant
          </button>

          <button
            className='px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 rounded-xl text-white font-bold transition-all duration-200 shadow-lg'
            onClick={() => {
              stopRecognition()
              handleLogout()
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Activity Indicator */}
      <div className='mt-8 flex flex-col items-center'>
        {userText && (
          <div className="bg-[#232526]/80 backdrop-blur-lg border border-blue-400/50 rounded-xl p-4 mb-4 max-w-2xl">
            <p className="text-blue-400 font-semibold">You said:</p>
            <p className="text-gray-200">{userText}</p>
          </div>
        )}

        {aiText && (
          <div className="bg-[#232526]/80 backdrop-blur-lg border border-purple-400/50 rounded-xl p-4 mb-4 max-w-2xl">
            <p className="text-purple-400 font-semibold">{authUser.assistantName} responded:</p>
            <p className="text-gray-200">{aiText}</p>
          </div>
        )}

        {/* Animated GIFs */}
        <div className="relative">
          {!aiText && (
            <img
              src={user}
              alt='User'
              className='w-32 h-32 rounded-full border-4 border-blue-400/50 shadow-lg transition-all duration-300'
            />
          )}
          {aiText && (
            <img
              src={ai}
              alt='AI'
              className='w-32 h-32 rounded-full border-4 border-purple-400/50 shadow-lg transition-all duration-300'
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
