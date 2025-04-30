<<<<<<< HEAD
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import TemplateEditor from "./TemplateEditor";
import Navbar from "../Pages/Hero/Navbar";
import { useAuth } from "../Pages/Mailer/AuthContext";
import { NavLink } from "react-router-dom";
=======
import React, { useEffect, useState } from "react";
import axios from "axios";
import TemplateEditor from "./TemplateEditor";
import Navbar from "../Pages/Hero/Navbar";
import { NavLink, useNavigate } from "react-router-dom";
>>>>>>> eb0bf73 (new changes are added)
import { Helmet } from 'react-helmet';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
<<<<<<< HEAD
  const [categories, setCategories] = useState(["All", "Promotional", "Seasonal", "Newsletter", "Transactional"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentEditedHtml, setCurrentEditedHtml] = useState(null);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const { isLoggedIn, login, logout } = useAuth();

  // Debugging: Log posts and their categories when posts are fetched
  useEffect(() => {
    if (posts.length > 0) {
      console.log("Loaded posts with categories:", posts.map(post => post.category));
    }
  }, [posts]);

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
              onClick={onClose}
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
    if (!isLoggedIn) {
      setIsLoginModalVisible(true);
      return;
    }
  
    if (editingPost?._id === selectedTemplate._id) {
      setEditingPost(null);
      setCurrentEditedHtml(null);
    } else {
      setEditingPost(selectedTemplate);
    }
  };
  
  const editorInstanceRef = useRef(null);

=======
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentEditedHtml, setCurrentEditedHtml] = useState(null);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(true);
  const navigate = useNavigate();

  
  // Check device type for responsive layout
>>>>>>> eb0bf73 (new changes are added)
  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      setIsMobileOrTablet(width <= 1024);
    };
    
    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);
    
    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

<<<<<<< HEAD
=======
  // Set background color
>>>>>>> eb0bf73 (new changes are added)
  useEffect(() => {
    document.body.style.backgroundColor = "#f9f9f9";
  
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);
<<<<<<< HEAD
  
  useEffect(() => {
    const fetchPosts = async () => {
=======

  useEffect(() => {
    const fetchUserData = async () => {
      setIsSubscriptionLoading(true); // Start loading subscription status
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // If no token, user isn't logged in
          setUser({ currentPlan: "free" });
          setIsSubscriptionLoading(false); // Finished loading
          return;
        }
        
        // Fetch user authentication data
        const API_URL = "https://vedive.com:3000";
        const userResponse = await fetch(`${API_URL}/api/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (!userResponse.ok) {
          if (userResponse.status === 401) {
            localStorage.removeItem("token");
            setUser({ currentPlan: "free" });
            setIsSubscriptionLoading(false); // Finished loading
            return;
          }
          throw new Error(`HTTP error: ${userResponse.status}`);
        }
        
        const userData = await userResponse.json();
        
        // Fetch subscription status
        const subscriptionResponse = await fetch(`${API_URL}/api/subscription/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (subscriptionResponse.ok) {
          const subscriptionData = await subscriptionResponse.json();
          // Combine user data with subscription data
          userData.currentPlan = subscriptionData.currentPlan;
        } else {
          userData.currentPlan = "free";
        }
        
        setUser(userData);
        setIsSubscriptionLoading(false); // Finished loading
      } catch (err) {
        console.error("Error fetching user data:", err);
        setUser({ currentPlan: "free" }); // Default to free if error
        setIsSubscriptionLoading(false); // Finished loading even if there's an error
      }
    };
    
    fetchUserData();
  }, []);

  
  // Fetch posts and set categories only once
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
>>>>>>> eb0bf73 (new changes are added)
      try {
        const response = await axios.get("https://vedive.com:3000/api/posts");
        setPosts(response.data);
        
<<<<<<< HEAD
        // Extract unique categories from the posts and update the categories state
        const uniqueCategories = [...new Set(response.data.map(post => post.category))];
        if (uniqueCategories.length > 0) {
          setCategories(["All", ...uniqueCategories]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
=======
        // Extract unique categories from the posts
        const uniqueCategories = [...new Set(response.data.map(post => 
          post.category ? post.category.trim() : null
        ).filter(Boolean))];
        
        // Only set categories once with "All" as the first option
        setCategories(["All", ...uniqueCategories]);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
>>>>>>> eb0bf73 (new changes are added)
      }
    };
    fetchPosts();
  }, []);

<<<<<<< HEAD
  const handleSave = async (postId, updatedHtml) => {
=======
  const isPaidUser = () => {
    return user && user.currentPlan && user.currentPlan.toLowerCase() !== "free";
  };

  const toggleEditor = () => {
    if (!isPaidUser()) {
      navigate("/plan"); // Redirect to subscription page
      return;
    }
    
    if (editingPost?._id === selectedTemplate._id) {
      setEditingPost(null);
      setCurrentEditedHtml(null);
    } else {
      setEditingPost(selectedTemplate);
    }
  };
  
  const editorInstanceRef = React.useRef(null);

  const handleSave = async (postId, updatedHtml) => {
    if (!isPaidUser()) {
      navigate("/plan");
      return;
    }
    
>>>>>>> eb0bf73 (new changes are added)
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
<<<<<<< HEAD
=======
    if (!isPaidUser()) {
      navigate("/plan");
      return;
    }
    
>>>>>>> eb0bf73 (new changes are added)
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadEdited = (editedHtml) => {
<<<<<<< HEAD
=======
    if (!isPaidUser()) {
      navigate("/plan");
      return;
    }
    
>>>>>>> eb0bf73 (new changes are added)
    setCurrentEditedHtml(editedHtml);
    handleDownload(editedHtml, `${selectedTemplate.name}-edited.html`);
  };

<<<<<<< HEAD
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

=======
>>>>>>> eb0bf73 (new changes are added)
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

  // Case-insensitive category filtering
  const filteredPosts = activeCategory === "All" 
    ? posts 
    : posts.filter(post => 
        post.category && post.category.toLowerCase() === activeCategory.toLowerCase()
      );

  return (
    <>
      <Helmet>
        <title>Choose Your Email Template for Bulk Email Marketing.</title>
        <meta name="description" content="Explore Vedive's customizable email templates for bulk email sender. Create engaging campaigns with professional designs tailored for your business"/>
      </Helmet>
      {viewMode === "grid" && <Navbar />}
<<<<<<< HEAD
      <LoginPromptModal 
        isOpen={isLoginModalVisible} 
        onClose={() => setIsLoginModalVisible(false)} 
      />

=======
>>>>>>> eb0bf73 (new changes are added)
      <div className="email-templates-container" style={{ 
        fontFamily: 'Arial, sans-serif',
        padding: "1vw",
        width:'98vw',
        margin: "0 auto"
      }}>
        {viewMode === "grid" ? (
          <>
            <h1 style={{ 
              fontSize: "32px", 
              marginBottom: "8px", 
              color: "#333",
              textAlign: "center"
            }}>
              Email Templates
            </h1>
            <p style={{ 
              fontSize: "16px", 
              color: "#666", 
              marginBottom: "32px",
              textAlign: "center"
            }}>
              Choose from our collection of professional email templates
            </p>

<<<<<<< HEAD
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

            {/* Templates Grid with debug info */}
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
=======
            {/* Category Navigation - Only show when categories are loaded */}
            {categories.length > 0 && (
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
            )}

            {/* Loading state */}
            {isLoading ? (
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "50px 0"
              }}>
                <div style={{
                  width: "50px",
                  height: "50px",
                  border: "5px solid #f3f3f3",
                  borderTop: "5px solid #7c3aed",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }}></div>
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            ) : (
              /* Templates Grid */
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
                        zoom: 0.65,
                        aspectRatio: '4/4',
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
                          {post.category && (
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
                          )}
                        </div>
                        
                        <p style={{ 
                          margin: "0 0 16px 0", 
                          fontSize: "14px", 
                          color: "#666",
                          lineHeight: "1.5"
                        }}>
                          {post.description && post.description.length > 80 
                            ? post.description.substring(0, 80) + "..." 
                            : post.description}
                        </p>
                        
                        {post.tags && post.tags.length > 0 && (
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
>>>>>>> eb0bf73 (new changes are added)
                                backgroundColor: "#f5f5f5",
                                padding: "4px 10px",
                                borderRadius: "100px",
                                fontSize: "12px",
                                color: "#777",
<<<<<<< HEAD
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
=======
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
            )}
>>>>>>> eb0bf73 (new changes are added)
          </>
        ) : (
        selectedTemplate && (
          <div style={{
            backgroundColor: "#fff", 
            overflow: "hidden",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            height: "95vh",
            display: "flex",
<<<<<<< HEAD
            flexDirection: isMobileOrTablet ? "column" : "row" // Changed to column layout for tablets/mobile
=======
            flexDirection: isMobileOrTablet ? "column" : "row"
>>>>>>> eb0bf73 (new changes are added)
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
<<<<<<< HEAD
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
=======
                      onClick={() => {
                        if (!isPaidUser()) {
                          navigate("/plan");
                          return;
                        }
                        
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
>>>>>>> eb0bf73 (new changes are added)
                        border: "none",
                        padding: "14px 16px",
                        borderRadius: "6px",
                        fontWeight: "500",
<<<<<<< HEAD
                        cursor: "pointer",
                        fontSize: "16px"
                      }}
                    >
                      {editingPost?._id === selectedTemplate._id ? "View Template" : "Edit Template"}
                    </button>
                  </div>
                )}
              </div>
=======
                        cursor: isPaidUser() ? "pointer" : "not-allowed",
                        fontSize: "16px",
                        opacity: isPaidUser() ? 1 : 0.7
                      }}
                    >
                      {isPaidUser() ? "Download Edited" : "Premium"}
                    </button>
                  ) : (
                    <button
                      onClick={() => isPaidUser() 
                        ? handleDownload(selectedTemplate.htmlContent, `${selectedTemplate.name}.html`) 
                        : navigate("/plan")}
                      style={{
                        backgroundColor: "#f4f1fe",
                        color: "#7c3aed",
                        border: "none",
                        padding: "14px 16px",
                        borderRadius: "6px",
                        fontWeight: "500",
                        cursor: isPaidUser() ? "pointer" : "not-allowed",
                        fontSize: "16px",
                        opacity: isPaidUser() ? 1 : 0.7
                      }}
                    >
                      {isPaidUser() ? "Download Template" : "Get Access"}
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
                      fontSize: "16px",
                      opacity: isPaidUser() ? 1 : 0.7
                    }}
                  >
                    {editingPost?._id === selectedTemplate._id ? "View" : isPaidUser() ? "Edit Template" : "Upgrade To Edit"}
                  </button>
                </div>
              )}
            </div>
>>>>>>> eb0bf73 (new changes are added)
              
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
<<<<<<< HEAD
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
=======
                    {selectedTemplate.description || "No description available"}
                  </p>
                </div>
                
                {selectedTemplate.category && (
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
                )}
                
                {selectedTemplate.tags && selectedTemplate.tags.length > 0 && (
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
                )}
              </div>
              
              {/* Buttons at the bottom of sidebar - Only show for desktop */}
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
          if (!isPaidUser()) {
            navigate("/plan");
            return;
          }
          
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
          backgroundColor: isPaidUser() ? "#f4f1fe" : "#f9f5ff",
          color: "#7c3aed",
          border: isPaidUser() ? "none" : "1px solid #e9d8fd",
          padding: "12px 0",
          borderRadius: "8px",
          fontWeight: "600",
          fontSize: "15px",
          cursor: isPaidUser() ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          width: "100%",
          transition: "all 0.2s ease",
          opacity: isPaidUser() ? 1 : 0.9
        }}
        onMouseOver={(e) => {
          if (isPaidUser()) {
            e.currentTarget.style.backgroundColor = "#ebe5fd";
          }
        }}
        onMouseOut={(e) => {
          if (isPaidUser()) {
            e.currentTarget.style.backgroundColor = "#f4f1fe";
          }
        }}
      >
        {isPaidUser() ? (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 16L4 17C4 18.6569 5.34315 20 7 20L17 20C18.6569 20 20 18.6569 20 17L20 16M16 12L12 16M12 16L8 12M12 16L12 4" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Download Edited Template</span>
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Premium Feature</span>
          </>
        )}
      </button>
    ) : (
      <button
        onClick={() => isPaidUser() 
          ? handleDownload(selectedTemplate.htmlContent, `${selectedTemplate.name}.html`) 
          : navigate("/plan")}
        style={{
          backgroundColor: isPaidUser() ? "#f4f1fe" : "#f9f5ff",
          color: "#7c3aed",
          border: isPaidUser() ? "none" : "1px solid #e9d8fd",
          padding: "12px 0",
          borderRadius: "8px",
          fontWeight: "600",
          fontSize: "15px",
          cursor: isPaidUser() ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          width: "100%",
          transition: "all 0.2s ease",
          opacity: isPaidUser() ? 1 : 0.9
        }}
        onMouseOver={(e) => {
          if (isPaidUser()) {
            e.currentTarget.style.backgroundColor = "#ebe5fd";
          }
        }}
        onMouseOut={(e) => {
          if (isPaidUser()) {
            e.currentTarget.style.backgroundColor = "#f4f1fe";
          }
        }}
      >
        {isPaidUser() ? (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 16L4 17C4 18.6569 5.34315 20 7 20L17 20C18.6569 20 20 18.6569 20 17L20 16M16 12L12 16M12 16L8 12M12 16L12 4" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Download Template</span>
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Upgrade To Download</span>
          </>
        )}
      </button>
    )}
    
    <button
      onClick={toggleEditor}
      style={{
        backgroundColor: "#7c3aed",
        color: "white",
        border: "none",
        padding: "12px 0",
        borderRadius: "8px",
        fontWeight: "600",
        fontSize: "15px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        width: "100%",
        transition: "all 0.2s ease",
        boxShadow: "0 2px 4px rgba(124, 58, 237, 0.2)"
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = "#6d28d9";
        e.currentTarget.style.boxShadow = "0 4px 6px rgba(124, 58, 237, 0.25)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "#7c3aed";
        e.currentTarget.style.boxShadow = "0 2px 4px rgba(124, 58, 237, 0.2)";
      }}
    >
      {editingPost?._id === selectedTemplate._id ? (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2.45825 12C3.73253 7.94288 7.52281 5 12.0004 5C16.4781 5 20.2684 7.94291 21.5426 12C20.2684 16.0571 16.4781 19 12.0005 19C7.52281 19 3.73251 16.0571 2.45825 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>View Template</span>
        </>
      ) : isPaidUser() ? (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 5H6C4.89543 5 4 5.89543 4 7V18C4 19.1046 4.89543 20 6 20H17C18.1046 20 19 19.1046 19 18V13M17.5858 3.58579C18.3668 2.80474 19.6332 2.80474 20.4142 3.58579C21.1953 4.36683 21.1953 5.63316 20.4142 6.41421L11.8284 15H9L9 12.1716L17.5858 3.58579Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Edit Template</span>
        </>
      ) : (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Upgrade to Edit</span>
        </>
      )}
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
>>>>>>> eb0bf73 (new changes are added)

            {/* Right/Bottom area - Template preview or editor taking full space */}
            <div style={{ 
              flex: 1, 
              position: "relative",
              display: "flex",
              flexDirection: "column",
<<<<<<< HEAD
              height: isMobileOrTablet ? "calc(95vh - 200px)" : "100%" // Adjust height for tablet mode
=======
              height: isMobileOrTablet ? "calc(95vh - 200px)" : "100%" 
>>>>>>> eb0bf73 (new changes are added)
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
<<<<<<< HEAD
                    editorRef={editorInstanceRef} // Pass the ref to the TemplateEditor
=======
                    editorRef={editorInstanceRef}
>>>>>>> eb0bf73 (new changes are added)
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