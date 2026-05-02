import express from 'express';
import cors from 'cors';
import multer from 'multer';
import axios from 'axios';
import { PDFParse } from 'pdf-parse'; 

const app = express();
app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

const SYSTEM_PROMPT = `
You are an expert Insurance Data Extractor. Extract the following details from the motor insurance policy text and return ONLY a valid JSON object. If a value is missing, return "".
JSON Schema:
{
  "given_company": "Company Name", "company": "Company Name", "contact_number": "Phone",
  "start_date": "DD/MM/YYYY", "expiry_date": "DD/MM/YYYY", "policy_number": "Number",
  "risk_month": "Month string", "type_of_insurance": "Type", "name": "Customer Name",
  "customer_address": "Address", "year": "Year", "make": "Make", "model": "Model",
  "sub_model": "Sub Model", "vehicle_no": "Reg No", "engine_no": "Engine No",
  "chassis_no": "Chassis No", "idv": "IDV", "b_to_b": "Add on premium",
  "discount": "Discount", "ncb": "NCB", "total_od": "Total OD",
  "net_premium": "Premium Paid", "fuel_type": "Fuel"
}`;

app.post('/api/extract-policy', upload.single('policyPdf'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send("No PDF uploaded.");

        // --- NEW LOGIC FOR VERSION 2.4.5 ---
        const parser = new PDFParse(); // Create the instance
        const result = await parser.parse(req.file.buffer); // Use the parse method
        const rawText = result.text;
        // -----------------------------------

        const ollamaResponse = await axios.post('http://localhost:11434/api/generate', {
            model: 'mistral',
            prompt: `${SYSTEM_PROMPT}\n\nRAW TEXT:\n${rawText}`,
            format: 'json',
            stream: false
        });

        const aiData = JSON.parse(ollamaResponse.data.response);

        const csvHeaders = [
            "GIVEN COMPANY", "COMPANY", "BUSINESS TYPE", "CONTACT NUMBER", "START DATE", 
            "EXPIRY DATE", "POLICY NUMBER", "RISK MONTH", "TYPE OF INSURANCE", "NAME", 
            "CUSTOMER ADDRESS", "YEAR", "MAKE", "MODEL", "SUB MODEL", "VEHICLE NO", 
            "ENGINE NO", "CHASSIS NO", "IDV", "B TO B", "DISCOUNT", "NCB", "NILDEP RATINGS", 
            "TOTAL OD", "NET PREMIUM", "GROSS PREMIUM", "COLLECT PREMIUM", "PAYMENT MODE", 
            "SHORTFALL", "FUEL TYPE", "MOP", "REMARKS", "RECEIVED DATE", "COLLECTION PERON", 
            "COLLECTION CITY", "ID", "CHEQUE BOUNCE", "PAYOUT"
        ];

        const rowData = [
            aiData.given_company || "", aiData.company || "", "", aiData.contact_number || "", 
            aiData.start_date || "", aiData.expiry_date || "", aiData.policy_number || "", 
            aiData.risk_month || "", aiData.type_of_insurance || "", aiData.name || "", 
            `"${aiData.customer_address || ""}"`, aiData.year || "", aiData.make || "", 
            aiData.model || "", aiData.sub_model || "", aiData.vehicle_no || "", 
            aiData.engine_no || "", aiData.chassis_no || "", aiData.idv || "", 
            aiData.b_to_b || "", aiData.discount || "", aiData.ncb || "", "", 
            aiData.total_od || "", aiData.net_premium || "", aiData.net_premium || "", 
            aiData.net_premium || "", "", "", aiData.fuel_type || "", 
            "", "", "", "", "", "", "", ""
        ];

        const csvContent = csvHeaders.join(",") + "\n" + rowData.join(",");

        res.header('Content-Type', 'text/csv');
        res.attachment(`Extracted_Policy_${aiData.policy_number || 'Data'}.csv`);
        res.send(csvContent);

    } catch (error) {
        console.error("Extraction Error:", error);
        res.status(500).send("Failed to extract data.");
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Backend Engine is running successfully on http://localhost:${PORT}`);
});