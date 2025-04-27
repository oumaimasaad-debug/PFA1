



"use client"

import { useState } from "react"
import axios from "axios"
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Row,
  Col,
  Spinner,
  Form,
  FormGroup,
  Label,
  Alert
} from "reactstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowDown, faDatabase, faMagic, faDownload } from "@fortawesome/free-solid-svg-icons"
import { IconBase } from "react-icons"

const promptNames = ['Yawn', 'Drinking', 'SafeDriving', 'SleepyDriving', 'DangerousDriving', 'Distracted']
const prompts = [
  "prompts like this one by ensuring diversity in age sex and skin tone 'Create a highly detailed and realistic close-up image of a yawning driver(man-woman,skintone,age....) inside a car...",
  "prompts like this one by varying gender age and skin tone and mention high resolution and clear expressions all of them should finish with frontal shot captured from behind the Wheel...",
  "Generate food dishes",
  "Generate people doing sports",
  "Generate natural landscapes",
  "Generate futuristic cities"
]

function Icons() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [answer, setAnswer] = useState("")
  const [downloadUrl, setDownloadUrl] = useState("")
  const [imageCount, setImageCount] = useState(5)
  const [selectedPrompt, setSelectedPrompt] = useState("")
  const [showResponse, setShowResponse] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedPrompt) {
      setError("Please select a behavior type")
      return
    }

    setIsLoading(true)
    setError("")
    setAnswer("")
    setDownloadUrl("")
    setShowResponse(false)

    const fullPrompt = `generate ${imageCount} ${selectedPrompt}`

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer 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`,
          "HTTP-Referer": "https://deepseek-appy.com",
          "X-Title": "DeepSeek-appy",
          Origin: window.location.origin,
        },
        body: JSON.stringify({
          model: "anthropic/claude-3-haiku",
          messages: [{
            role: "user",
            content: "the user will give you a description of the dataset he wants to generate including the classe and the number of images he wants in class and also informations that will guide you , what i want you to do is to generate prompts to give them to the model text to image to generate the images , i want you to respond this way , the name of the class in capital letter after that backslash / after that the prompts in small letter of the class separated with backslash/ and after every prompt point even if its the last(the number of prompts must be the number of images in every class), the comme then END after the end of prompts of class,don't forget the backslash / even after END, the prompts must be well detailled and high resolution:" + fullPrompt
          }],
        }),
      })

      const responseData = await response.json()
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} - ${responseData.error?.message || JSON.stringify(responseData)}`)
      }

      const generatedText = responseData.choices?.[0]?.message?.content || "No answer received"
      setAnswer(generatedText)
      setShowResponse(true)

      const backendResponse = await axios.post(
        "http://localhost:5000/llm",
        { prompt: generatedText },
        {
          responseType: 'blob',
          headers: { "Content-Type": "application/json" },
        }
      )

      const blob = new Blob([backendResponse.data], { type: 'application/zip' })
      const url = window.URL.createObjectURL(blob)
      setDownloadUrl(url)

    } catch (err) {
      console.error("Error:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const downloadImages = () => {
    if (downloadUrl) {
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = 'generated_images.zip'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="content">
      <div className="gen-imgs-container">
        <Card className="main-card">
          <CardHeader className="app-card-header">
            <div className="d-flex align-items-center">
              <div>
                <p className="app-subtitle mb-0">Create synthetic image datasets </p>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label className="form-label">Number of images per class</Label>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={imageCount}
                      onChange={(e) => setImageCount(Math.min(20, Math.max(1, e.target.value)))}
                      className="form-input"
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label className="form-label">Behavior Type</Label>
                    <Input
                      type="select"
                      value={selectedPrompt}
                      onChange={(e) => setSelectedPrompt(e.target.value)}
                      className="form-input"
                    >
                      <option value="">Select a behavior type</option>
                      {prompts.map((_, index) => (
                        <option key={index} value={prompts[index]}>
                          {promptNames[index]}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              <div className="text-center mt-4">
                <Button
                  color="default"
                  className="generate-btn"
                  type="submit"
                  disabled={isLoading || !selectedPrompt}
                >
                  {isLoading ? (
                    <>
                      <Spinner size="sm" className="mr-2" /> Processing...
                    </>
                  ) : (
                    <>
                      Generate 
                    </>
                  )}
                </Button>
              </div>
            </Form>

            {error && (
              <Alert color="danger" className="mt-4">
                <strong>Error:</strong> {error}
              </Alert>
            )}

            {showResponse && answer && (
              <div className="response-container mt-4">
                <div className="response-header" onClick={() => setShowResponse(!showResponse)}>
                  <h5 className="response-title">
                    <FontAwesomeIcon 
                      icon={faArrowDown} 
                      className={`mr-2 transition-transform ${showResponse ? 'transform rotate-180' : ''}`} 
                    />
                    Model Response
                  </h5>
                </div>
                {showResponse && (
                  <div className="response-content">
                    <pre>{answer}</pre>
                  </div>
                )}
              </div>
            )}

            {downloadUrl && (
              <div className="download-container mt-4 text-center">
                <Button 
                  color="success" 
                  className="download-button"
                  onClick={downloadImages}
                >
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  Download Dataset (ZIP)
                </Button>
                <p className="text-muted mt-2">
                  Contains {imageCount} images per selected class
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <style jsx>{`
        .content {
          background-color: #f8fafc;
          min-height: 100vh;
          padding: 2rem;
        }
        
        .gen-imgs-container {
          max-width: 900px;
          margin: 0 auto;
        }
        
        .main-card {
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
          border: none;
          overflow: hidden;
        }
        
        .app-card-header {
          background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
          color: white;
          padding: 1.5rem;
        }
        
        .app-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
        }
        
        .app-subtitle {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
        }
        
        .form-label {
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.5rem;
          display: block;
        }
        
        .form-input {
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          padding: 0.75rem 1rem;
          transition: all 0.2s;
          background-color: #fff;
        }
        
        .form-input:focus {
          border-color: #4361ee;
          box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
        }
         .generate-btn {
          padding: 10px 25px;
          border-radius: 8px;
          font-weight: 500;
        }
          
        .submit-button {
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          letter-spacing: 0.5px;
          transition: all 0.2s;
          min-width: 220px;
          border: none;
        }
        
        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(66, 153, 225, 0.2);
        }
        
        .submit-button:disabled {
          background-color: #a0aec0;
          transform: none;
          box-shadow: none;
        }
        
        .response-container {
          background-color: #fff;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }
        
        .response-header {
          background-color: #f7fafc;
          padding: 1rem;
          cursor: pointer;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .response-title {
          font-weight: 600;
          color: #2d3748;
          margin: 0;
          display: flex;
          align-items: center;
        }
        
        .response-content {
          padding: 1.5rem;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .response-content pre {
          white-space: pre-wrap;
          word-wrap: break-word;
          margin: 0;
          font-family: 'Fira Code', monospace;
          font-size: 14px;
          line-height: 1.5;
          color: #4a5568;
        }
        
        .download-container {
          padding: 1.5rem;
          background-color: #f0fff4;
          border-radius: 8px;
          border: 1px solid #c6f6d5;
        }
        
        .download-button {
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.2s;
        }
        
        .download-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(72, 187, 120, 0.2);
        }
        
        .transition-transform {
          transition: transform 0.2s ease;
        }
        
        .transform {
          transform: translateY(0);
        }
        
        .rotate-180 {
          transform: rotate(180deg);
        }
      `}</style>
    </div>
  )
}

export default Icons