import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import TemplateEditor from "./TemplateEditor";
import Navbar from "../Pages/Hero/Navbar";
import { useAuth } from "../Pages/Mailer/AuthContext"; // Import the useAuth hook
import { NavLink } from "react-router-dom";
import { Helmet } from 'react-helmet';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "detail"
  const [categories, setCategories] = useState(["All", "Promotional", "Seasonal", "Newsletter", "Transactional"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentEditedHtml, setCurrentEditedHtml] = useState(null);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false); // Add this line
  const { isLoggedIn, login, logout } = useAuth();

  const LoginPromptModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div 
          className="fixed inset-0 bg-black opacity-50"
          onClick={onClose}
        />
        <div className="relative bg-white p-6 rounded-lg max-w-md w-full mx-4">
          <h2 className="text-xl font-bold mb-4">Login Required</h2>
          <p className="mb-6">Please log in to edit templates.</p>
          
          <div className="flex justify-end space-x-2">
            <button 
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Close
            </button>
            <NavLink to="/login">
            <button 
              onClick={() => {
                // Add your login navigation logic here
                // For example:
                // router.push('/login');
                onClose();
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Go to Login
            </button>
            </NavLink>
          </div>
        </div>
      </div>
    );
  };

  const toggleEditor = () => {
    // Check if user is logged in
    if (!isLoggedIn) {
      // Show login prompt modal
      setIsLoginModalVisible(true);
      return;
    }
  
    if (editingPost?._id === selectedTemplate._id) {
      setEditingPost(null); // Close editor
      setCurrentEditedHtml(null);
    } else {
      setEditingPost(selectedTemplate); // Open editor
    }
  };
  
  // Add a ref to store the editor instance
  const editorInstanceRef = useRef(null);

  // Check if the device is a mobile or tablet
  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      setIsMobileOrTablet(width <= 1024); // Common breakpoint for tablets/iPads
    };
    
    // Initial check
    checkDeviceType();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkDeviceType);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

  useEffect(() => {
    // Set background when the component mounts
    document.body.style.backgroundColor = "#f9f9f9";
  
    return () => {
      // Reset background when the component unmounts
      document.body.style.backgroundColor = "";
    };
  }, []);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("https://vedive.com:3000/api/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const handleSave = async (postId, updatedHtml) => {
    try {
      await axios.put(`/api/posts/${postId}`, { htmlContent: updatedHtml });
      alert("Template saved successfully!");
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, htmlContent: updatedHtml } : post
        )
      );
      setEditingPost(null);
      setCurrentEditedHtml(null);
      setViewMode("detail");
    } catch (error) {
      console.error("Error saving template:", error);
    }
  };

  const handleDownload = (htmlContent, fileName) => {
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  // New handler for downloading edited templates
  const handleDownloadEdited = (editedHtml) => {
    // Store the current edited HTML
    setCurrentEditedHtml(editedHtml);
    
    // Download it
    handleDownload(editedHtml, `${selectedTemplate.name}-edited.html`);
  };

  // Function to get the current HTML from the GrapesJS editor
  const getCurrentEditedHtml = () => {
    if (editorInstanceRef.current) {
      const html = editorInstanceRef.current.getHtml();
      const css = editorInstanceRef.current.getCss();
      return `<html>
        <head>
          <style>${css}</style>
        </head>
        <body>${html}</body>
      </html>`;
    }
    return null;
  };

  const viewTemplateDetails = (post) => {
    setSelectedTemplate(post);
    document.body.style.backgroundColor = "#ffffff";
    setViewMode("detail");
  };

  const backToGrid = () => {
    setViewMode("grid");
    document.body.style.backgroundColor = "#f9f9f9";
    setEditingPost(null);
    setCurrentEditedHtml(null);
  };


  const filteredPosts = activeCategory === "All" 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  return (
    <>
      <Helmet>
      <title>Choose Your Email Template for Bulk Email Marketing.</title>
      <meta name="description" content="Explore Vedive’s customizable email templates for bulk email sender. Create engaging campaigns with professional designs tailored for your business"/>
      </Helmet>
    {/* Only show Navbar in grid view */}
    {viewMode === "grid" && <Navbar />}
    <LoginPromptModal 
        isOpen={isLoginModalVisible} 
        onClose={() => setIsLoginModalVisible(false)} 
      />

    <div className="email-templates-container" style={{ 
      fontFamily: 'Arial, sans-serif',
      padding: "1vw",
      width:'98vw',
      margin: "0 auto"
    }}>
      {viewMode === "grid" ? (
        <>
            <h1 className="text-primary" style={{ 
            fontSize: "32px", 
            marginBottom: "8px", 
            color: "#333",
            textAlign: "center"
          }}>
            Email Templates
          </h1>
          <p className="text-primary"  style={{ 
            fontSize: "16px", 
            color: "#666", 
            marginBottom: "32px",
            textAlign: "center"
          }}>
            Choose from our collection of professional email templates
          </p>

          {/* Category Navigation */}
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            marginBottom: "32px",
            gap: "12px",
            flexWrap: "wrap"
          }}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "100px",
                  backgroundColor: activeCategory === category ? "#7c3aed" : "#fff",
                  color: activeCategory === category ? "#fff" : "#666",
                  border: "none",
                  fontWeight: "500",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  transition: "all 0.2s ease"
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "32px",
          }}>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div
                  key={post._id}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    cursor: "pointer",
                  }}
                  onClick={() => viewTemplateDetails(post)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.12)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
                  }}
                >
                <div style={{
                  zoom:0.65,
                  aspectRatio:'4/4',
                  overflow: "hidden",
                  position: "relative",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px 8px 0 0",
                }}>
                  <iframe
                    title={`preview-${post._id}`}
                    srcDoc={post.htmlContent}
                    style={{
                      width: "100%",
                      height: "140%",
                      border: "none",
                      transform: "scale(0.75)",
                      transformOrigin: "top center",
                      pointerEvents: "none"
                    }}
                    scrolling="no"
                  ></iframe>
                  <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "60px",
                    background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))",
                    pointerEvents: "none"
                  }}></div>
                </div>
                  
                  <div style={{ padding: "20px" }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px"
                    }}>
                      <h3 style={{ 
                        margin: 0, 
                        fontSize: "18px", 
                        fontWeight: "600", 
                        color: "#333" 
                      }}>
                        {post.name}
                      </h3>
                      <span style={{
                        backgroundColor: "#f0edfc",
                        color: "#7c3aed",
                        fontSize: "12px",
                        fontWeight: "500",
                        padding: "4px 10px",
                        borderRadius: "100px"
                      }}>
                        {post.category}
                      </span>
                    </div>
                    
                    <p style={{ 
                      margin: "0 0 16px 0", 
                      fontSize: "14px", 
                      color: "#666",
                      lineHeight: "1.5"
                    }}>
                      {post.description.length > 80 
                        ? post.description.substring(0, 80) + "..." 
                        : post.description}
                    </p>
                    
                    {post.tags.length > 0 && (
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            style={{
                              backgroundColor: "#f5f5f5",
                              padding: "4px 10px",
                              borderRadius: "100px",
                              fontSize: "12px",
                              color: "#777",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span style={{
                            backgroundColor: "#f5f5f5",
                            padding: "4px 10px",
                            borderRadius: "100px",
                            fontSize: "12px",
                            color: "#777",
                          }}>
                            +{post.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ 
                textAlign: "center", 
                gridColumn: "1 / -1", 
                color: "#666",
                padding: "40px",
                backgroundColor: "#fff",
                borderRadius: "8px"
              }}>
                No templates available in this category.
              </p>
            )}
          </div>
        </>
      ) : (
        selectedTemplate && (
          <div style={{
            backgroundColor: "#fff", 
            overflow: "hidden",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            height: "95vh",
            display: "flex",
            flexDirection: isMobileOrTablet ? "column" : "row" // Changed to column layout for tablets/mobile
          }}>
            {/* Top/Left sidebar - Template info with header and buttons */}
            <div style={{ 
              width: isMobileOrTablet ? "100%" : "250px", 
              borderRight: isMobileOrTablet ? "none" : "1px solid #eaeaea",
              borderBottom: isMobileOrTablet ? "1px solid #eaeaea" : "none",
              padding: "14px",
              overflowY: "auto",
              display: "flex",
              flexDirection: isMobileOrTablet ? "column" : "column",
              maxHeight: isMobileOrTablet ? "auto" : "100%"
            }}>
              {/* Header */}
              <div style={{ 
                marginBottom: isMobileOrTablet ? "16px" : "24px",
                display: "flex",
                flexDirection: isMobileOrTablet ? "row" : "column",
                alignItems: isMobileOrTablet ? "center" : "flex-start",
                justifyContent: isMobileOrTablet ? "space-between" : "flex-start",
                width: "100%"
              }}>
                <div>
                  <button
                    onClick={backToGrid}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      color: "#7c3aed",
                      cursor: "pointer",
                      padding: "8px 0",
                      fontSize: "16px",
                      marginBottom: isMobileOrTablet ? "0" : "16px"
                    }}
                  >
                    ← Back to templates
                  </button>
                  <h2 style={{ 
                    fontSize: isMobileOrTablet ? "20px" : "24px", 
                    margin: 0,
                    color: "#333"
                  }}>
                    {selectedTemplate.name}
                  </h2>
                </div>
                
                {/* Move buttons to header for tablet/mobile view */}
                {isMobileOrTablet && (
                  <div style={{ 
                    display: "flex",
                    gap: "10px"
                  }}>
                    {editingPost?._id === selectedTemplate._id ? (
                      <button
                        onClick={() => {
                          if (editorInstanceRef.current) {
                            const html = editorInstanceRef.current.getHtml();
                            const css = editorInstanceRef.current.getCss();
                            const fullHtml = `<html>
                              <head>
                                <style>${css}</style>
                              </head>
                              <body>${html}</body>
                            </html>`;
                            
                            handleDownload(fullHtml, `${selectedTemplate.name}-edited.html`);
                            setCurrentEditedHtml(fullHtml);
                          } else if (currentEditedHtml) {
                            handleDownload(currentEditedHtml, `${selectedTemplate.name}-edited.html`);
                          }
                        }}
                        style={{
                          backgroundColor: "#f4f1fe",
                          color: "#7c3aed",
                          border: "none",
                          padding: "14px 16px",
                          borderRadius: "6px",
                          fontWeight: "500",
                          cursor: "pointer",
                          fontSize: "16px"
                        }}
                      >
                        Download Edited Template
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDownload(selectedTemplate.htmlContent, `${selectedTemplate.name}.html`)}
                        style={{
                          backgroundColor: "#f4f1fe",
                          color: "#7c3aed",
                          border: "none",
                          padding: "14px 16px",
                          borderRadius: "6px",
                          fontWeight: "500",
                          cursor: "pointer",
                          fontSize: "16px"
                        }}
                      >
                        Download Template
                      </button>
                    )}
                    
                    <button
                      id="edit-button"
                      onClick={toggleEditor}
                      style={{
                        backgroundColor: "#7c3aed",
                        color: "white",
                        border: "none",
                        padding: "14px 16px",
                        borderRadius: "6px",
                        fontWeight: "500",
                        cursor: "pointer",
                        fontSize: "16px"
                      }}
                    >
                      {editingPost?._id === selectedTemplate._id ? "View Template" : "Edit Template"}
                    </button>
                  </div>
                )}
              </div>
              
              {/* Template info in the middle - Horizontal layout for tablet/mobile */}
              <div style={{ 
                flex: isMobileOrTablet ? "0" : "1",
                display: isMobileOrTablet ? "none" : "block",
                flexDirection: isMobileOrTablet ? "row" : "column",
                gap: isMobileOrTablet ? "16px" : "0",
                flexWrap: isMobileOrTablet ? "wrap" : "nowrap",
                marginBottom: isMobileOrTablet ? "8px" : "0"
              }}>
                <div style={{ 
                  marginBottom: isMobileOrTablet ? "0" : "24px",
                  flex: isMobileOrTablet ? "1 1 60%" : "auto",
                  minWidth: isMobileOrTablet ? "200px" : "auto"
                }}>
                  <h4 style={{ 
                    fontSize: "14px", 
                    color: "#666", 
                    marginBottom: "8px",
                    fontWeight: "500"
                  }}>
                    Description
                  </h4>
                  <p style={{ 
                    color: "#333", 
                    margin: 0,
                    lineHeight: "1.5",
                    fontSize: "14px"
                  }}>
                    {selectedTemplate.description}
                  </p>
                </div>
                
                <div style={{ 
                  marginBottom: isMobileOrTablet ? "0" : "24px",
                  flex: isMobileOrTablet ? "1 1 30%" : "auto",
                  minWidth: isMobileOrTablet ? "150px" : "auto" 
                }}>
                  <h4 style={{ 
                    fontSize: "14px", 
                    color: "#666", 
                    marginBottom: "8px",
                    fontWeight: "500"
                  }}>
                    Category
                  </h4>
                  <div>
                    <span style={{
                      backgroundColor: "#f0edfc",
                      padding: "6px 12px",
                      borderRadius: "100px",
                      fontSize: "14px",
                      color: "#7c3aed",
                      fontWeight: "500"
                    }}>
                      {selectedTemplate.category}
                    </span>
                  </div>
                </div>
                
                <div style={{ 
                  marginBottom: isMobileOrTablet ? "0" : "24px",
                  flex: isMobileOrTablet ? "1 1 100%" : "auto"
                }}>
                  <h4 style={{ 
                    fontSize: "14px", 
                    color: "#666", 
                    marginBottom: "8px",
                    fontWeight: "500"
                  }}>
                    Tags
                  </h4>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {selectedTemplate.tags.map((tag, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: "#f5f5f5",
                          padding: "6px 12px",
                          borderRadius: "100px",
                          fontSize: "13px",
                          color: "#777",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Buttons at the bottom of sidebar - Only show for desktop */}
              {!isMobileOrTablet && (
                <div style={{ 
                  marginTop: "auto", 
                  paddingTop: "20px", 
                  borderTop: "1px solid #eaeaea",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px"
                }}>
                  {editingPost?._id === selectedTemplate._id ? (
                    <button
                      onClick={() => {
                        if (editorInstanceRef.current) {
                          const html = editorInstanceRef.current.getHtml();
                          const css = editorInstanceRef.current.getCss();
                          const fullHtml = `<html>
                            <head>
                              <style>${css}</style>
                            </head>
                            <body>${html}</body>
                          </html>`;
                          
                          handleDownload(fullHtml, `${selectedTemplate.name}-edited.html`);
                          setCurrentEditedHtml(fullHtml);
                        } else if (currentEditedHtml) {
                          handleDownload(currentEditedHtml, `${selectedTemplate.name}-edited.html`);
                        }
                      }}
                      style={{
                        backgroundColor: "#f4f1fe",
                        color: "#7c3aed",
                        border: "none",
                        padding: "12px 20px",
                        borderRadius: "6px",
                        fontWeight: "500",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        width: "100%"
                      }}
                    >
                      <span>Download Edited Template</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDownload(selectedTemplate.htmlContent, `${selectedTemplate.name}.html`)}
                      style={{
                        backgroundColor: "#f4f1fe",
                        color: "#7c3aed",
                        border: "none",
                        padding: "12px 20px",
                        borderRadius: "6px",
                        fontWeight: "500",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        width: "100%"
                      }}
                    >
                      <span>Download</span>
                    </button>
                  )}
                  
                  <button
                    onClick={toggleEditor}
                    style={{
                      backgroundColor: "#7c3aed",
                      color: "white",
                      border: "none",
                      padding: "12px 20px",
                      borderRadius: "6px",
                      fontWeight: "500",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      width: "100%"
                    }}
                  >
                    {editingPost?._id === selectedTemplate._id ? "View Template" : "Edit Template"}
                  </button>
                </div>
              )}
            </div>
            <style>
    {`
      @media (max-width: 480px) {
        #edit-button {
          display: none;
        }
      }
    `}
  </style>

            {/* Right/Bottom area - Template preview or editor taking full space */}
            <div style={{ 
              flex: 1, 
              position: "relative",
              display: "flex",
              flexDirection: "column",
              height: isMobileOrTablet ? "calc(95vh - 200px)" : "100%" // Adjust height for tablet mode
            }}>
              {editingPost?._id === selectedTemplate._id ? (
                <div style={{ 
                  position: "absolute", 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0
                }}>
                  <TemplateEditor
                    htmlContent={selectedTemplate.htmlContent}
                    onSave={(updatedHtml) => handleSave(selectedTemplate._id, updatedHtml)}
                    onDownload={handleDownloadEdited}
                    editorRef={editorInstanceRef} // Pass the ref to the TemplateEditor
                  />
                </div>
              ) : (
                <div style={{
                  flex: 1,
                  position: "relative",
                  width: "100%",
                  height: "100%"
                }}>
                  <iframe
                    title={`template-${selectedTemplate._id}`}
                    srcDoc={selectedTemplate.htmlContent}
                    style={{
                      position: "relative",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: "none",
                      overflow: "auto"
                    }}
                  ></iframe>
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
    </>
  );
};

export default PostList;