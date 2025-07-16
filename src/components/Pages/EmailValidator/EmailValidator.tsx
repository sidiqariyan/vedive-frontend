import React, { useRef, useState } from 'react';
import { Mail, Upload, HelpCircle, CheckCircle, AlertCircle, FileText, Loader } from 'lucide-react';

interface ValidationResult {
  email: string;
  isValid: boolean;
  checks?: {
    [key: string]: {
      passed: boolean;
      message: string;
    };
  };
  executionTime?: number;
  error?: string;
  reason?: string;
  suggestion?: string;
}

interface ApiResponse {
  result?: ValidationResult;
  email?: string;
  isValid?: boolean;
  error?: string;
  reason?: string;
  suggestion?: string;
  success?: boolean;
}

interface BatchApiResponse {
  results?: ValidationResult[];
  error?: string;
  success?: boolean;
}

function EmailValidator() {
  const [singleEmail, setSingleEmail] = useState('');
  const [batchEmails, setBatchEmails] = useState('');
  const [singleResult, setSingleResult] = useState<ValidationResult | null>(null);
  const [batchResults, setBatchResults] = useState<ValidationResult[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileResults, setFileResults] = useState<ValidationResult[]>([]);
  const [isValidatingSingle, setIsValidatingSingle] = useState(false);
  const [isValidatingBatch, setIsValidatingBatch] = useState(false);
  const [isValidatingFile, setIsValidatingFile] = useState(false);
  const [recipientsPreview, setRecipientsPreview] = useState<string[]>([]);
  const [recipientsFileName, setRecipientsFileName] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API base URL - adjust this to match your backend URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  const handleApiError = (error: any): string => {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return 'Unable to connect to validation server. Please check if the server is running.';
    }
    return error.message || 'An unexpected error occurred';
  };

  const validateEmailAPI = async (email: string): Promise<ValidationResult> => {
    try {
      const response = await fetch(`${API_BASE_URL}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      
      if (data.error) {
        return {
          email: email,
          isValid: false,
          error: data.error
        };
      }

      // Handle the response structure from your server
      if (data.result) {
        return data.result;
      }

      // Fallback for different response structure
      return {
        email: data.email || email,
        isValid: data.isValid || false,
        error: data.reason || data.error,
        suggestion: data.suggestion
      };
    } catch (error: any) {
      return {
        email: email,
        isValid: false,
        error: handleApiError(error)
      };
    }
  };

  const validateBatchAPI = async (emails: string[]): Promise<ValidationResult[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/validate-batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emails: emails.join(',') }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BatchApiResponse = await response.json();
      
      if (data.error) {
        // Return error results for all emails
        return emails.map(email => ({
          email,
          isValid: false,
          error: data.error
        }));
      }

      return data.results || [];
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      return emails.map(email => ({
        email,
        isValid: false,
        error: errorMessage
      }));
    }
  };

  const handleSingleValidation = async () => {
    if (!singleEmail.trim()) {
      setSingleResult({
        email: singleEmail,
        isValid: false,
        error: 'Email is required'
      });
      return;
    }

    setIsValidatingSingle(true);
    setApiError(null);
    setSingleResult(null);
    
    try {
      const result = await validateEmailAPI(singleEmail.trim());
      setSingleResult(result);
    } catch (error: any) {
      setApiError(handleApiError(error));
      setSingleResult({
        email: singleEmail,
        isValid: false,
        error: 'Validation failed'
      });
    } finally {
      setIsValidatingSingle(false);
    }
  };

  const handleBatchValidation = async () => {
    if (!batchEmails.trim()) {
      setBatchResults([]);
      return;
    }

    setIsValidatingBatch(true);
    setApiError(null);
    setBatchResults([]);
    
    try {
      const emails = batchEmails
        .split(/[,\n]/)
        .map(email => email.trim())
        .filter(email => email.length > 0);
      
      if (emails.length === 0) {
        setBatchResults([]);
        return;
      }

      const results = await validateBatchAPI(emails);
      setBatchResults(results);
    } catch (error: any) {
      setApiError(handleApiError(error));
    } finally {
      setIsValidatingBatch(false);
    }
  };

  const handleFileUpload = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      setSelectedFile(file);
      setRecipientsFileName(file.name);
      setFileResults([]);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const emails = text
          .split(/[,\n\r]/)
          .map(email => email.trim())
          .filter(email => email.length > 0);
        setRecipientsPreview(emails.slice(0, 5));
      };
      reader.readAsText(file);
    }
  };

  const handleFileValidation = async () => {
    if (!selectedFile) return;
    
    setIsValidatingFile(true);
    setApiError(null);
    setFileResults([]);
    
    try {
      const text = await selectedFile.text();
      const emails = text
        .split(/[,\n\r]/)
        .map(email => email.trim())
        .filter(email => email.length > 0);
      
      if (emails.length === 0) {
        setFileResults([]);
        return;
      }

      const results = await validateBatchAPI(emails);
      setFileResults(results);
    } catch (error: any) {
      setApiError(handleApiError(error));
    } finally {
      setIsValidatingFile(false);
    }
  };

  const handleReset = () => {
    setSingleEmail('');
    setBatchEmails('');
    setSingleResult(null);
    setBatchResults([]);
    setSelectedFile(null);
    setFileResults([]);
    setRecipientsPreview([]);
    setRecipientsFileName(null);
    setApiError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getValidationIcon = (result: ValidationResult) => {
    if (result.isValid) {
      return <CheckCircle className="text-green-500" size={16} />;
    } else {
      return <AlertCircle className="text-red-500" size={16} />;
    }
  };

  const renderValidationDetails = (result: ValidationResult) => {
    if (!result.checks) return null;

    //   <div className="mt-3 space-y-2">
    //     <h6 className="text-sm font-medium text-gray-700">Validation Checks:</h6>
    //     {Object.entries(result.checks).map(([checkName, checkResult]) => (
    //       <div key={checkName} className="flex items-center justify-between p-2 bg-white bg-opacity-20 rounded">
    //         {/* <div>
    //           <span className="text-sm font-medium capitalize">{checkName}</span>
    //           <br />
    //           <span className="text-xs">{checkResult.message}</span>
    //         </div> */}
    //         <div className={`text-lg ${checkResult.passed ? 'text-green-300' : 'text-red-300'}`}>
    //           {/* {checkResult.passed ? '✓' : '✗'} */}
    //         </div>
    //       </div>
    //     ))}
    //     {result.executionTime && (
    //       <div className="text-xs text-center mt-2 p-2 bg-black bg-opacity-10 rounded">
    //         Completed in {result.executionTime}ms
    //       </div>
    //     )}
    //   </div>
    // );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-0 sm:p-4 md:p-8">
      <div className="mx-auto bg-white rounded-lg shadow-md border border-gray-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-b border-gray-300">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <Mail className="text-blue-500" size={30} />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">Email Validation</h1>
          </div>
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
            <HelpCircle size={16} className="text-blue-500" />
            <span>Need help?</span>
            <a href="#" className="text-blue-500 underline">
              Watch tutorial
            </a>
          </div>
        </div>

        {/* API Error Display */}
        {apiError && (
          <div className="mx-4 sm:mx-6 mt-4 p-4 bg-red-50 border border-red-300 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="text-red-500" size={20} />
              <span className="text-red-700 font-medium">Connection Error</span>
            </div>
            <p className="text-red-600 text-sm mt-1">{apiError}</p>
          </div>
        )}

        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* Single Email Validation */}
          <div className="space-y-4 p-4 sm:p-6 border border-gray-300 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <Mail className="text-blue-500" size={20} />
              <h2 className="text-lg font-medium text-gray-900">Single Email Validation</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter email address to validate</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={singleEmail}
                    onChange={(e) => setSingleEmail(e.target.value)}
                    placeholder="Enter email address to validate"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    onKeyPress={(e) => e.key === 'Enter' && !isValidatingSingle && handleSingleValidation()}
                    disabled={isValidatingSingle}
                  />
                  <button
                    onClick={handleSingleValidation}
                    disabled={isValidatingSingle || !singleEmail.trim()}
                    className={`px-4 py-2 rounded-lg text-white font-medium flex items-center space-x-2 ${
                      isValidatingSingle || !singleEmail.trim()
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    {isValidatingSingle ? (
                      <>
                        <Loader className="animate-spin" size={16} />
                        <span>Validating...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        <span>Validate</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {singleResult && (
              <div className={`p-4 border rounded-lg ${
                singleResult.isValid 
                  ? 'bg-green-50 border-green-300' 
                  : 'bg-red-50 border-red-300'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  {getValidationIcon(singleResult)}
                  <span className="font-medium text-gray-800">{singleResult.email}</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    singleResult.isValid 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {singleResult.isValid ? 'VALID' : 'INVALID'}
                  </span>
                </div>
                
                {!singleResult.isValid && singleResult.error && (
                  <div className="text-red-600 text-sm mb-2">
                    Error: {singleResult.error}
                  </div>
                )}
                
                {singleResult.suggestion && (
                  <div className="text-blue-600 text-sm mb-2">
                    Suggestion: {singleResult.suggestion}
                  </div>
                )}
                
                {renderValidationDetails(singleResult)}
              </div>
            )}
          </div>

          {/* Batch Validation */}
          <div className="space-y-4 p-4 sm:p-6 border border-gray-300 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="text-blue-500" size={20} />
                <h2 className="text-lg font-medium text-gray-900">Batch Validation</h2>
              </div>
              <button
                onClick={handleBatchValidation}
                disabled={isValidatingBatch || !batchEmails.trim()}
                className={`px-4 py-2 rounded-lg text-white font-medium flex items-center space-x-2 ${
                  isValidatingBatch || !batchEmails.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isValidatingBatch ? (
                  <>
                    <Loader className="animate-spin" size={16} />
                    <span>Validating...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    <span>Validate Batch</span>
                  </>
                )}
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Validate multiple emails at once (comma-separated or newline-separated)
              </label>
              <textarea
                value={batchEmails}
                onChange={(e) => setBatchEmails(e.target.value)}
                placeholder="email1@example.com, email2@example.com, email3@example.com or one per line"
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 resize-none"
                disabled={isValidatingBatch}
              />
            </div>

            {batchResults.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-gray-900">Batch Results</h3>
                  <div className="flex space-x-4 text-sm">
                    <span className="text-green-600">Valid: {batchResults.filter(r => r.isValid).length}</span>
                    <span className="text-red-600">Invalid: {batchResults.filter(r => !r.isValid).length}</span>
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {batchResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 border rounded-lg ${
                        result.isValid 
                          ? 'bg-green-50 border-green-300' 
                          : 'bg-red-50 border-red-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getValidationIcon(result)}
                          <span className="text-sm text-gray-700 truncate">{result.email}</span>
                        </div>
                        <span className={`text-sm font-medium ${
                          result.isValid ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {result.isValid ? 'Valid' : result.error || 'Invalid'}
                        </span>
                      </div>
                      {result.suggestion && (
                        <div className="mt-1 text-xs text-blue-600">
                          Suggestion: {result.suggestion}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* File Upload Section */}
          <div className="space-y-4 p-4 sm:p-6 border border-gray-300 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-2">
                  <Upload className="text-blue-500" size={24} />
                </div>
                <h3 className="text-base font-medium text-gray-900">Upload Email File</h3>
                <p className="text-sm text-gray-500 mt-1">Upload a .txt or .csv file containing emails</p>
              </div>
              {selectedFile && (
                <button
                  onClick={handleFileValidation}
                  disabled={isValidatingFile || !selectedFile}
                  className={`px-4 py-2 rounded-lg text-white font-medium flex items-center space-x-2 ${
                    isValidatingFile || !selectedFile
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {isValidatingFile ? (
                    <>
                      <Loader className="animate-spin" size={16} />
                      <span>Validating...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      <span>Validate File</span>
                    </>
                  )}
                </button>
              )}
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isValidatingFile}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Browse Files...
              </button>
            </div>
            
            <input
              type="file"
              accept=".txt,.csv"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            
            {recipientsFileName && (
              <p className="text-sm text-gray-600 text-center truncate">{recipientsFileName}</p>
            )}
            
            {recipientsPreview.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Preview (first 5 emails):</h4>
                <div className="space-y-1">
                  {recipientsPreview.map((email, index) => (
                    <div key={index} className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                      {email}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {fileResults.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-gray-900">File Results</h3>
                  <div className="flex space-x-4 text-sm">
                    <span className="text-green-600">Valid: {fileResults.filter(r => r.isValid).length}</span>
                    <span className="text-red-600">Invalid: {fileResults.filter(r => !r.isValid).length}</span>
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {fileResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 border rounded-lg ${
                        result.isValid 
                          ? 'bg-green-50 border-green-300' 
                          : 'bg-red-50 border-red-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getValidationIcon(result)}
                          <span className="text-sm text-gray-700 truncate">{result.email}</span>
                        </div>
                        <span className={`text-sm font-medium ${
                          result.isValid ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {result.isValid ? 'Valid' : result.error || 'Invalid'}
                        </span>
                      </div>
                      {result.suggestion && (
                        <div className="mt-1 text-xs text-blue-600">
                          Suggestion: {result.suggestion}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reset Button */}
          <div className="flex justify-center pt-4">
            <button
              className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              onClick={handleReset}
              disabled={isValidatingSingle || isValidatingBatch || isValidatingFile}
            >
              Reset All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailValidator;