"use client"

import { useState, useRef } from "react"
import axios from "axios"
import JSZip from "jszip"
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
  InputGroup,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  FormGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowRight,
  faArrowDown,
  faCheck,
  faUpload,
  faProjectDiagram,
  faPaintBrush,
} from "@fortawesome/free-solid-svg-icons"
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons"
import "../assets/css/gen-imgs.css"

const GenImgs = () => {
  // Available models data
  const availableModels = [
    {
      id: "model1",
      name: "JASE-Defocous",
      description: "Fast, efficient and reliable for generating detailed prompts",
      icon: faProjectDiagram,
      color: "warning",
    },
    {
      id: "model2",
      name: "JASE-Flux-Dev",
      description: "Excellent image quality, good understanding of complex prompts",
      icon: faPaintBrush,
      color: "danger",
    },
  ]

  // States
  const [activeTab, setActiveTab] = useState("1")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState([])
  const [simplePrompt, setSimplePrompt] = useState("")
  const [showSimpleResults, setShowSimpleResults] = useState(false)
  const [selectedModel, setSelectedModel] = useState(null)
  const [showModelSelection, setShowModelSelection] = useState(true)
  const [advancedPrompt, setAdvancedPrompt] = useState("")
  const [datasetFile, setDatasetFile] = useState(null)
  const [showAdvancedResults, setShowAdvancedResults] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [detectedClasses, setDetectedClasses] = useState(new Set())
  const [classCounts, setClassCounts] = useState({})
  const [zipError, setZipError] = useState("")

  // Refs
  const fileInputRef = useRef(null)

  // New states from QuestionAnswer component
  const [answer, setAnswer] = useState("")
  const [localResponse, setLocalResponse] = useState(null)
  const [error, setError] = useState("")
  const [debugInfo, setDebugInfo] = useState(null)
  const [fileURL, setFileURL] = useState(null)

  // Helper functions
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab)
      setShowSimpleResults(false)
      setShowAdvancedResults(false)
      setShowModelSelection(true)
      setSelectedModel(null)
      setDetectedClasses(new Set())
      setClassCounts({})
      setDatasetFile(null)
      setZipError("")
    }
  }

  const toggleFavorite = (modelId) => {
    setFavorites((prev) => (prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId]))
  }

  const handleSelectModel = (model) => {
    setSelectedModel(model)
    setShowModelSelection(false)
  }

  const handleBackToModelSelection = () => {
    setShowModelSelection(true)
    setSelectedModel(null)
    setAdvancedPrompt("")
    setDatasetFile(null)
    setDetectedClasses(new Set())
    setClassCounts({})
    setZipError("")
  }

  const handleFileChange = async (e) => {
    setZipError("")
    setDetectedClasses(new Set())
    setClassCounts({})
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setDatasetFile(file)

      try {
        const zip = new JSZip()
        const content = await zip.loadAsync(file)
        const newClasses = new Set()

        // Parcourir les fichiers du ZIP
        Object.keys(content.files).forEach((path) => {
          if (path.startsWith("dataset/") && content.files[path].dir) {
            const className = path.slice("dataset/".length).replace("/", "")
            if (className && !className.includes("/")) {
              newClasses.add(className)
            }
          }
        })

        if (newClasses.size === 0) {
          setZipError("Aucune classe trouvée dans le dossier 'dataset/'")
          return
        }

        setDetectedClasses(newClasses)
        
        // Initialiser les compteurs pour chaque classe
        const initialCounts = {}
        newClasses.forEach(cls => {
          initialCounts[cls] = 0
        })
        setClassCounts(initialCounts)
      } catch (err) {
        console.error("Error reading ZIP file:", err)
        setZipError("Erreur de lecture du fichier ZIP")
      }
    }
  }

  const handleClassCountChange = (className, value) => {
    setClassCounts(prev => ({
      ...prev,
      [className]: parseInt(value) || 0
    }))
  }

  const validateAdvancedForm = () => {
    return (
      advancedPrompt.trim().length > 0 &&
      datasetFile &&
      detectedClasses.size > 0 &&
      Object.values(classCounts).every(count => count > 0)
    )
  }

  // Submit handlers
  const handleSimpleSubmit = async (e) => {
    e.preventDefault()

    if (!simplePrompt.trim()) return

    setIsLoading(true)
    setError("")
    setAnswer("")
    setLocalResponse(null)
    setDebugInfo(null)
    setFileURL(null)
    setShowSimpleResults(true)

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
          messages: [
            {
              role: "user",
              content:
                "the user will give you a description of the dataset he wants to generate including the classes and the number of images he wants in every class and also informations that will guide you , what i want you to do is to generate prompts to give them to the model text to image to generate the images , i want you to respond this way , the name of the class in capital letter after that backslash / after that the prompts in small letter of the class separated with backslash/ and after every prompt point even if its the last(the number of prompts must be the number of images in every class), the comma then END after the end of prompts of every class,don't forget the backslash / even after END,every class on its own folder inside the dataset so write the classes names in capital letters dont forget them also the prompts must be well detailled and high resolution:" +
                simplePrompt,
            },
          ],
        }),
      })

      const responseData = await response.json()
      setDebugInfo(responseData)

      if (!response.ok) {
        throw new Error(
          `API error: ${response.status} - ${responseData.error?.message || JSON.stringify(responseData)}`,
        )
      }

      if (responseData.choices && responseData.choices.length > 0) {
        const aiAnswer = responseData.choices[0].message.content
        setAnswer(aiAnswer)

        // Send the AI response to the local backend
        try {
          const localRes = await axios.post(
            "http://localhost:5000/llm",
            { prompt: aiAnswer },
            {
              headers: { "Content-Type": "application/json" },
              responseType: "blob", // Important: request the response as a blob
            },
          )

          if (localRes.data) {
            // Create a URL for the received file (e.g., ZIP)
            const fileURL = URL.createObjectURL(localRes.data)
            setFileURL(fileURL)
            setLocalResponse("Le fichier a été généré avec succès.")
          }
        } catch (backendErr) {
          console.error("Error calling local backend:", backendErr)
          setLocalResponse(`Erreur du backend: ${backendErr.message}`)
        }
      } else {
        throw new Error("No response content received")
      }
    } catch (err) {
      console.error("Error calling OpenRouter API:", err)
      setError(`Failed to get response: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdvancedSubmit = async (e) => {
    e.preventDefault()
    if (!validateAdvancedForm()) {
      setConfirmModal(true)
      return
    }
    await processAdvancedGeneration()
  }

  const processAdvancedGeneration = async () => {
    setIsLoading(true)
    setShowAdvancedResults(true)
    setConfirmModal(false)

    try {
      // Generate prompts from the description and class counts
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
          model: "deepseek/deepseek-r1-distill-qwen-32b:free",
          messages: [{
            role: "user",
            content: `"the user will give you a description of the dataset he wants to generate including the classes and the number of images he wants in every class and also informations that will guide you , what i want you to do is to generate prompts to give them to the model text to image to generate the images , i want you to respond this way , the name of the class in capital letter after that backslash / after that the prompts in small letter of the class separated with backslash/ and after every prompt point even if its the last(the number of prompts must be the number of images in every class), the comma then END after the end of prompts of every class,don't forget the backslash / even after END, the prompts must be well detailled and high resolution: don't add any other comments"${advancedPrompt}\n\nClasses détectées:\n${Object.entries(classCounts).map(([cls, nb]) => `- ${cls}: ${nb} images`).join('\n')}`
          }]
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error?.message || "Failed to generate prompts")

      const prompts = data.choices[0].message.content
      setAnswer(prompts)

      // Send to local backend with both the ZIP file and prompts
      const formData = new FormData()
      formData.append("dataset", datasetFile)
      formData.append("prompt", prompts)

      const localRes = await axios.post(
        "http://localhost:5000/img2img",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          responseType: "blob",
        }
      )

      if (localRes.data) {
        const fileURL = URL.createObjectURL(localRes.data)
        setFileURL(fileURL)
        setLocalResponse("Dataset généré avec succès")
        
        // Show mock results
        const mockResults = Array(6).fill().map((_, i) => ({
          id: i + 1,
          url: "/placeholder.svg?height=300&width=300",
          prompt: `Generated from: ${advancedPrompt.substring(0, 50)}...`
        }))
        setResults(mockResults)
      }
    } catch (err) {
      console.error("Error in advanced generation:", err)
      setError(`Erreur: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="content">
      <div className="gen-imgs-container">
        {/* Navigation tabs */}
        <Nav tabs className="custom-tabs">
          <NavItem>
            <NavLink className={activeTab === "1" ? "active" : ""} onClick={() => toggleTab("1")}>
              Your synthetic images
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={activeTab === "2" ? "active" : ""} onClick={() => toggleTab("2")}>
              Build with data
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab}>
          {/* Simple Generator Tab */}
          <TabPane tabId="1">
            <Card className="main-card">
              <CardHeader>
                <h4 className="card-title">Describe your dataset</h4>
                <p className="card-category">Generate images from text prompts</p>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSimpleSubmit}>
                  <div className="prompt-input-container flex flex-col gap-2">
                    <InputGroup>
                      <Input
                        type="textarea"
                        className="prompt-input"
                        placeholder="prompt..."
                        value={simplePrompt}
                        onChange={(e) => setSimplePrompt(e.target.value)}
                        rows="4"
                        required
                      />
                    </InputGroup>

                    <div className="text-right mt-4">
                      <Button color="default" className="generate-btn" type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Spinner size="sm" className="mr-2" /> Images generating...
                          </>
                        ) : (
                          <>Generate</>
                        )}
                      </Button>
                    </div>
                  </div>
                </Form>

                {showSimpleResults && (
                  <div className="results-section mt-4">
                    {error && (
                      <div className="error-container p-3 bg-danger-light rounded mb-4">
                        <p className="text-danger mb-0">{error}</p>
                      </div>
                    )}
                    {localResponse && (
                      <div className="local-response-container p-3 bg-info-light rounded mb-4">
                        <h5 className="mb-2">Model Response:</h5>
                        <p className="mb-0">{localResponse}</p>
                      </div>
                    )}

                    {fileURL && (
                      <div className="file-download-container p-3 bg-success-light rounded mb-4">
                        <h5 className="mb-2">Download Dataset:</h5>
                        <a href={fileURL} download="generated_images.zip" className="btn btn-success btn-sm">
                          <FontAwesomeIcon icon={faArrowDown} className="mr-2" />
                          Download ZIP file
                        </a>
                      </div>
                    )}

                    {!isLoading && results.length > 0 && !error && (
                      <div className="generated-images mt-4">
                        <h5 className="mb-3">Generated Images:</h5>
                        <Row className="results-grid">
                          {results.map((result) => (
                            <Col md="3" sm="6" key={result.id} className="result-item mb-4">
                              <Card className="result-image-card h-100">
                                <div className="result-image-container">
                                  <img
                                    src={result.url || "/placeholder.svg"}
                                    alt={`Generated ${result.id}`}
                                    className="result-image"
                                  />
                                  <div className="result-overlay">
                                    <Button color="light" size="sm" className="result-action-btn">
                                      <FontAwesomeIcon icon={faArrowDown} className="mr-1" />
                                      Download
                                    </Button>
                                  </div>
                                </div>
                                <div className="result-prompt p-2">
                                  <small className="text-muted">{result.prompt}</small>
                                </div>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>
          </TabPane>

          {/* Advanced Generator Tab */}
          <TabPane tabId="2">
            <Card className="main-card">
              <CardHeader>
                <h4 className="card-title"></h4>
                <p className="card-category">
                  {showModelSelection ? "Select a model" : `Model: ${selectedModel?.name}`}
                </p>
              </CardHeader>
              <CardBody>
                {showModelSelection ? (
                  <div className="model-selection">
                    <Row>
                      {availableModels.map((model) => (
                        <Col md="6" key={model.id} className="mb-4">
                          <Card
                            className={`model-card clickable-card ${favorites.includes(model.id) ? "favorite" : ""}`}
                            onClick={() => handleSelectModel(model)}
                          >
                            <CardBody>
                              <div className="model-card-content">
                                <div className={`model-icon bg-${model.color}`}>
                                  <FontAwesomeIcon icon={model.icon} />
                                </div>
                                <div className="model-info">
                                  <h5>
                                    {model.name}
                                    <button
                                      className="favorite-btn"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        toggleFavorite(model.id)
                                      }}
                                    >
                                      <FontAwesomeIcon
                                        icon={favorites.includes(model.id) ? faHeartRegular : faHeartRegular}
                                        className={favorites.includes(model.id) ? "text-danger" : "text-muted"}
                                      />
                                    </button>
                                  </h5>
                                  <p className="text-muted">{model.description}</p>
                                </div>
                                <div className="model-arrow">
                                  <FontAwesomeIcon icon={faArrowRight} />
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                ) : (
                  <div className="advanced-generation-form">
                    <Button color="link" className="back-button mb-3" onClick={handleBackToModelSelection}>
                      <FontAwesomeIcon icon={faArrowRight} className="fa-rotate-180 mr-2" />
                      Back to model selection
                    </Button>
                    
                    <Form onSubmit={handleAdvancedSubmit}>
                      {/* ZIP File Upload */}
                      <FormGroup>
                        <Label for="datasetZip">Dataset ZIP File</Label>
                        <div className="custom-file-upload">
                          <Input
                            type="file"
                            id="datasetZip"
                            innerRef={fileInputRef}
                            onChange={handleFileChange}
                            accept=".zip"
                            className="file-input"
                          />
                          <div className="file-upload-ui">
                            <div className="file-info">
                              {datasetFile ? (
                                <>
                                  <FontAwesomeIcon icon={faCheck} className="file-icon text-success" />
                                  <span className="file-name">{datasetFile.name}</span>
                                </>
                              ) : (
                                <>
                                  <FontAwesomeIcon icon={faUpload} className="file-icon text-muted" />
                                  <span className="file-placeholder">Drag & drop or choose a ZIP file</span>
                                </>
                              )}
                            </div>
                            <Button 
                              color="default" 
                              size="sm" 
                              className="browse-btn"
                              onClick={() => fileInputRef.current.click()}
                            >
                              Browse
                            </Button>
                          </div>
                        </div>
                        {zipError && <div className="text-danger small mt-2">{zipError}</div>}
                        <small className="form-text text-muted">
                          The ZIP should contain a 'dataset/' folder with class folders
                        </small>
                      </FormGroup>

                      {/* Detected Classes */}
                      {detectedClasses.size > 0 && (
                        <FormGroup>
                          <Label>Number of Images per Class</Label>
                          {Array.from(detectedClasses).map((cls) => (
                            <div key={cls} className="mb-2">
                              <Label for={`count-${cls}`} className="small mb-1">
                                Class "{cls}"
                              </Label>
                              <Input
                                type="number"
                                id={`count-${cls}`}
                                value={classCounts[cls] || 0}
                                onChange={(e) => handleClassCountChange(cls, e.target.value)}
                                min="1"
                                required
                              />
                            </div>
                          ))}
                        </FormGroup>
                      )}

                      {/* Advanced Prompt */}
                      <FormGroup>
                        <Label for="advancedPrompt">Description</Label>
                        <Input
                          type="textarea"
                          id="advancedPrompt"
                          className="prompt-input"
                          placeholder="Describe what you want to generate..."
                          value={advancedPrompt}
                          onChange={(e) => setAdvancedPrompt(e.target.value)}
                          rows="3"
                          required
                        />
                      </FormGroup>

                      <div className="text-right mt-4">
                        <Button 
                          color="default" 
                          className="generate-btn" 
                          type="submit" 
                          disabled={isLoading || !validateAdvancedForm()}
                        >
                          {isLoading ? (
                            <>
                              <Spinner size="sm" className="mr-2" /> Generating...
                            </>
                          ) : (
                            <>Generate</>
                          )}
                        </Button>
                      </div>
                    </Form>

                    {/* Results Section */}
                    {showAdvancedResults && (
                      <div className="results-section mt-4">
                        {error && (
                          <div className="error-container p-3 bg-danger-light rounded mb-4">
                            <p className="text-danger mb-0">{error}</p>
                          </div>
                        )}

                        {answer && (
                          <div className="mt-4">
                            <h5>Generated Prompts:</h5>
                            <pre className="p-3 bg-light rounded">{answer}</pre>
                            <Button 
                              color="secondary" 
                              size="sm" 
                              onClick={() => navigator.clipboard.writeText(answer)}
                              className="mt-2"
                            >
                              Copy Prompts
                            </Button>
                          </div>
                        )}

                        {fileURL && (
                          <div className="file-download-container p-3 bg-success-light rounded mb-4 mt-4">
                            <h5 className="mb-2">Download Generated Dataset:</h5>
                            <a href={fileURL} download="generated_images.zip" className="btn btn-success btn-sm">
                              <FontAwesomeIcon icon={faArrowDown} className="mr-2" />
                              Download ZIP file
                            </a>
                          </div>
                        )}

                        {!isLoading && results.length > 0 && !error && (
                          <div className="generated-images mt-4">
                            <h5 className="mb-3">Sample Generated Images:</h5>
                            <Row className="results-grid">
                              {results.map((result) => (
                                <Col md="3" sm="6" key={result.id} className="result-item mb-4">
                                  <Card className="result-image-card h-100">
                                    <div className="result-image-container">
                                      <img
                                        src={result.url || "/placeholder.svg"}
                                        alt={`Generated ${result.id}`}
                                        className="result-image"
                                      />
                                      <div className="result-overlay">
                                        <Button color="light" size="sm" className="result-action-btn">
                                          <FontAwesomeIcon icon={faArrowDown} className="mr-1" />
                                          Download
                                        </Button>
                                      </div>
                                    </div>
                                    <div className="result-prompt p-2">
                                      <small className="text-muted">{result.prompt}</small>
                                    </div>
                                  </Card>
                                </Col>
                              ))}
                            </Row>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>
          </TabPane>
        </TabContent>

        {/* Confirmation Modal */}
        <Modal isOpen={confirmModal} toggle={() => setConfirmModal(false)}>
          <ModalHeader toggle={() => setConfirmModal(false)}>Missing Information</ModalHeader>
          <ModalBody>
            Please make sure you have:
            <ul>
              <li>Selected a ZIP file with dataset</li>
              <li>Entered a description</li>
              <li>Specified image counts for all detected classes</li>
            </ul>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setConfirmModal(false)}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  )
}

export default GenImgs