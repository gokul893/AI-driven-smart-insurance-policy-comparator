import React, { useState } from 'react';

const PolicyUploader = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        if (!file) return alert("Please select a PDF first!");
        
        setLoading(true);
        const formData = new FormData();
        formData.append("policyPdf", file);

        try {
            // Notice we are hitting port 3000 where our new server.js is running!
            const response = await fetch('http://localhost:3000/api/extract-policy', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `HR_Payroll_Extraction.csv`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            alert("CSV Extracted Successfully!");
        } catch (error) {
            console.error(error);
            alert("Error processing the policy. Is the backend server running?");
        } finally {
            setLoading(false);
            setFile(null);
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 max-w-xl mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">HR Salary Process</h2>
            <p className="text-sm text-gray-500 mb-6">Upload a Motor Insurance PDF to automatically extract payroll data into CSV format.</p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                <input 
                    type="file" 
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer mb-4"
                />
                
                <button 
                    onClick={handleUpload}
                    disabled={loading}
                    className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
                >
                    {loading ? "AI is Extracting Data (Please Wait)..." : "Extract Data to CSV"}
                </button>
            </div>
        </div>
    );
};

export default PolicyUploader;