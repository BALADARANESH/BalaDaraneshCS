import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Fix for ESM __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client helper
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required but missing in system secrets. Please configure it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// In-memory Transaction Database (Initial State)
let transactions: any[] = [
  {
    id: "TX-8812-X",
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(), // 3 mins ago
    merchant: "Chronos Lux Travel Co.",
    amount: 14200.00,
    riskScore: 92,
    riskLevel: "Critical" as const,
    category: "Luxury Travel",
    device: "iPhone 15 Pro Max (Unrecognized)",
    location: "Zurich, Switzerland (IP Location Mismatch)",
    flaggedReason: "Velocity Spike (3 transactions within 4 seconds) + Geo-IP mismatch + High-value luxury terminal",
    status: "Flagged" as const
  },
  {
    id: "TX-7749-B",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    merchant: "Apex Digital Goods Inc.",
    amount: 1250.00,
    riskScore: 78,
    riskLevel: "High" as const,
    category: "Digital Electronics",
    device: "Chrome on Linux (New User Agent)",
    location: "Lagos, Nigeria",
    flaggedReason: "Suspicious Card-Not-Present digital voucher purchase + Fingerprint mismatch",
    status: "Investigating" as const
  },
  {
    id: "TX-1055-M",
    timestamp: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
    merchant: "Walmart.com",
    amount: 89.90,
    riskScore: 12,
    riskLevel: "Safe" as const,
    category: "Retail",
    device: "Android 13 App (Trusted)",
    location: "Chicago, IL, USA",
    flaggedReason: "Normal recurring buyer profile",
    status: "Approved" as const
  },
  {
    id: "TX-5421-A",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    merchant: "Steam Games Global",
    amount: 345.22,
    riskScore: 45,
    riskLevel: "Caution" as const,
    category: "Digital Games",
    device: "Windows Desktop PC",
    location: "Tokyo, Japan",
    flaggedReason: "Sub-dollar transaction followed by immediate mid-tier game credits charge",
    status: "Flagged" as const
  },
  {
    id: "TX-2210-H",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hrs ago
    merchant: "Uber Eats",
    amount: 42.50,
    riskScore: 8,
    riskLevel: "Safe" as const,
    category: "Food Delivery",
    device: "iPhone 14 Pro (Trusted)",
    location: "Chicago, IL, USA",
    flaggedReason: "Matched historical patterns",
    status: "Approved" as const
  },
  {
    id: "TX-9932-Y",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    merchant: "Coinbase Exchange",
    amount: 8500.00,
    riskScore: 88,
    riskLevel: "Critical" as const,
    category: "Digital Crypto",
    device: "Brave Browser (Private Mode)",
    location: "Reykjavik, Iceland",
    flaggedReason: "Attempted high-value crypto withdraw immediately following account email change",
    status: "Blocked" as const
  },
  {
    id: "TX-1188-K",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    merchant: "Whole Foods Market",
    amount: 112.45,
    riskScore: 15,
    riskLevel: "Safe" as const,
    category: "Retail",
    device: "iPhone 14 Pro (Trusted)",
    location: "Chicago, IL, USA",
    flaggedReason: "Routine checkout location",
    status: "Approved" as const
  },
  {
    id: "TX-3041-N",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    merchant: "AWS Cloud Infrastructure",
    amount: 2350.00,
    riskScore: 32,
    riskLevel: "Caution" as const,
    category: "Utility / Cloud",
    device: "API Access (Automated)",
    location: "Dublin, Ireland",
    flaggedReason: "First-time charge on freshly updated enterprise subscription billing",
    status: "Approved" as const
  },
  {
    id: "TX-4402-W",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    merchant: "Nordstrom luxury goods",
    amount: 4100.00,
    riskScore: 82,
    riskLevel: "High" as const,
    category: "Luxury Retail",
    device: "Safari on macOS (New Device ID)",
    location: "Los Angeles, CA, USA",
    flaggedReason: "Proxy IP address + high-value cart + overnight express shipping request",
    status: "Flagged" as const
  }
];

// Live Simulated Security Insights feed
let insights = [
  {
    id: "ins-1",
    timestamp: new Date().toISOString(),
    message: "Global anomaly velocity spike detected in Luxury Merchant category (+32% volume in last 10m).",
    type: "warning" as const
  },
  {
    id: "ins-2",
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    message: "New machine learning rule deployed: 'Cross-Border Travel Velocity Threshold V2' is now live.",
    type: "info" as const
  },
  {
    id: "ins-3",
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    message: "Blocked 14 credential stuffing attempts matching known proxy endpoints in the Tokyo sector.",
    type: "alert" as const
  }
];

// Seed generator to continuously inject randomized alerts for real-time emulation
setInterval(() => {
  const merchants = ["Amazon Web Services", "Stripe Checkout", "Best Buy Inc", "Tesla Motors Supercharger", "Etsy Craft Store", "Air France Booking", "Lululemon Athletica"];
  const categories = ["Utility / Cloud", "Digital Payments", "Retail", "Luxury Retail", "Retail", "Luxury Travel", "Retail"];
  const devices = ["Android App", "iPhone App", "Chrome Windows", "Safari macOS", "Firefox Linux"];
  const locations = ["London, UK", "New York, NY, USA", "Paris, France", "Sydney, Australia", "Berlin, Germany", "Toronto, Canada"];
  const reasons = [
    "Unusual velocity in secondary card verification attempts",
    "Cardholder travelling speed physically impossible based on previous coordinates",
    "High value transaction on historically dormant account",
    "Device hardware fingerprint matches an entry in known darknet list",
    "Mismatched billing and shipping country with proxy IP enabled"
  ];
  const levels = ["Safe", "Caution", "High", "Critical"] as const;
  
  const randIdx = Math.floor(Math.random() * merchants.length);
  const isSuspicious = Math.random() > 0.65;
  const riskScore = isSuspicious ? Math.floor(Math.random() * 41) + 60 : Math.floor(Math.random() * 40);
  
  let riskLevel: any = levels[0];
  if (riskScore >= 85) riskLevel = levels[3];
  else if (riskScore >= 60) riskLevel = levels[2];
  else if (riskScore >= 30) riskLevel = levels[1];

  const amount = parseFloat((isSuspicious ? (Math.random() * 5000 + 400) : (Math.random() * 150 + 10)).toFixed(2));
  
  const newTx = {
    id: `TX-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
    timestamp: new Date().toISOString(),
    merchant: merchants[randIdx],
    amount,
    riskScore,
    riskLevel,
    category: categories[randIdx],
    device: devices[Math.floor(Math.random() * devices.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    flaggedReason: isSuspicious ? reasons[Math.floor(Math.random() * reasons.length)] : "Consistent with normal historical footprint",
    status: isSuspicious ? ("Flagged" as const) : ("Approved" as const)
  };

  transactions.unshift(newTx);
  if (transactions.length > 50) {
    transactions.pop();
  }

  // Randomly inject an alert insight
  if (isSuspicious) {
    const newInsight = {
      id: `ins-${Math.floor(Math.random() * 10000)}`,
      timestamp: new Date().toISOString(),
      message: `Critical Flag raised on transaction ${newTx.id} ($${newTx.amount.toLocaleString()}) at ${newTx.merchant}. Risk: ${newTx.riskScore}/100.`,
      type: "alert" as const
    };
    insights.unshift(newInsight);
    if (insights.length > 10) insights.pop();
  }
}, 12000); // Trigger every 12 seconds to keep it active and engaging

// API Endpoint: Get transactions
app.get("/api/transactions", (req, res) => {
  const { search, riskLevel, category, status } = req.query;
  let filtered = [...transactions];

  if (search) {
    const s = String(search).toLowerCase();
    filtered = filtered.filter(t => 
      t.id.toLowerCase().includes(s) ||
      t.merchant.toLowerCase().includes(s) ||
      t.location.toLowerCase().includes(s) ||
      t.device.toLowerCase().includes(s) ||
      t.flaggedReason.toLowerCase().includes(s)
    );
  }

  if (riskLevel) {
    filtered = filtered.filter(t => t.riskLevel.toLowerCase() === String(riskLevel).toLowerCase());
  }

  if (category) {
    filtered = filtered.filter(t => t.category.toLowerCase() === String(category).toLowerCase());
  }

  if (status) {
    filtered = filtered.filter(t => t.status.toLowerCase() === String(status).toLowerCase());
  }

  res.json(filtered);
});

// API Endpoint: Perform transaction security action
app.post("/api/transactions/:id/action", (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Approved, Blocked, Investigating

  const txIndex = transactions.findIndex(t => t.id === id);
  if (txIndex === -1) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  transactions[txIndex].status = status;
  
  // Create a log insight
  const statusColors: Record<string, string> = { Approved: "Cleared", Blocked: "HEAVY BLACKLIST", Investigating: "Under Review" };
  const actionInsight = {
    id: `ins-${Math.floor(Math.random() * 10000)}`,
    timestamp: new Date().toISOString(),
    message: `Analyst updated ID ${id} to [${statusColors[status] || status}]. State locked securely.`,
    type: (status === "Blocked" ? "alert" : "info") as "alert" | "info"
  };
  insights.unshift(actionInsight);

  res.json({ success: true, transaction: transactions[txIndex] });
});

// API Endpoint: Get stats summary
app.get("/api/stats", (req, res) => {
  const activeAlertsCount = transactions.filter(t => t.status === "Flagged" || t.riskLevel === "Critical" || t.riskLevel === "High").length;
  
  // Calculate category distributions
  const fraudTypeDistribution = [
    { name: "Card Not Present", value: 50 },
    { name: "Identity Theft", value: 30 },
    { name: "Account Takeover", value: 20 }
  ];

  const attemptsByMerchant = [
    { name: "Retail", value: transactions.filter(t => t.category === "Retail").length * 8 + 42 },
    { name: "Luxury Travel", value: transactions.filter(t => t.category === "Luxury Travel").length * 15 + 78 },
    { name: "Digital Crypto", value: transactions.filter(t => t.category === "Digital Crypto").length * 12 + 65 },
    { name: "Digital Electronics", value: transactions.filter(t => t.category === "Digital Electronics").length * 10 + 51 },
    { name: "Utility / Cloud", value: transactions.filter(t => t.category === "Utility / Cloud").length * 4 + 22 }
  ];

  res.json({
    realtimeVolume: 1284,
    volumeTrend: "+12.5%",
    activeFraudAlerts: activeAlertsCount,
    aiPrecision: "98.5%",
    fraudTypeDistribution,
    attemptsByMerchant,
    insights: insights.slice(0, 8)
  });
});

// API Endpoint: Gemini AI analysis for transactions
app.post("/api/analyze", async (req, res) => {
  const { transaction } = req.body;
  if (!transaction) {
    return res.status(400).json({ error: "Transaction payload is required for Gemini AI analysis." });
  }

  try {
    const ai = getAiClient();
    const prompt = `You are an expert FinTech Forensic AI security systems auditor.
We need you to perform a real-time risk classification and security assessment on the following financial transaction:

TRANSACTION DATA:
- ID: ${transaction.id}
- Merchant: ${transaction.merchant}
- Amount: $${transaction.amount}
- Category: ${transaction.category}
- Device: ${transaction.device}
- Coordinate Location: ${transaction.location}
- Flagged Reason: ${transaction.flaggedReason}
- User State Current Risk: ${transaction.riskScore}/100 (${transaction.riskLevel})

Provide a comprehensive structural JSON response with EXACTLY this schema structure (do NOT add other fields or text):
{
  "riskSummary": "Provide an elegant 2-3 sentence technical overview detailing the exact nature of the threat or security threat vectors.",
  "anomalies": ["list of specific anomaly vectors (minimum 3), e.g., 'Mismatched Coordinate Velocity', 'Unusual Merchant categorization'"],
  "threatVector": "A brief category title of the exact attack vector (e.g. Card-Not-Present Fraud, Coordinate Velocity Jump, Account Takeover Compromise)",
  "nextSteps": ["List at least 3 concrete actionable instructions for security or fraud operations analyst, e.g. 'Initiate two-factor SMS verify', 'Temporarily blacklist IP range'"],
  "confidence": 95
}

Analyze carefully, factoring in transaction amount, device, location mismatches, and velocities. Ensure the "confidence" is an integer between 0 and 100.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const analysisText = response.text || "{}";
    const analysisObj = JSON.parse(analysisText.trim());
    res.json(analysisObj);

  } catch (error: any) {
    console.error("Gemini AI Analysis Error:", error);
    res.status(500).json({ 
      error: "Gemini analysis failed.", 
      message: error.message || "An unexpected error occurred." 
    });
  }
});

// Vite/Static Setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FraudGuard AI Backend] Server running at http://localhost:${PORT}`);
  });
}

startServer();
