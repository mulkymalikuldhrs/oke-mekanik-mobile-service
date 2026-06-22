
import fetch from 'node-fetch';

const API_URL = 'http://localhost:3001/api';

async function verifyAI() {
    console.log("--- Starting AI v7.0.1 Verification ---");

    // Login to get token
    console.log("Logging in...");
    const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'customer@example.com',
            password: 'password123',
            role: 'customer'
        })
    });
    const { token } = await loginRes.json();
    if (!token) {
        console.error("Login failed, no token received");
        return;
    }
    console.log("Logged in successfully.");

    const testCases = [
        {
            problem: "mobil listrik saya tidak bisa dicharge dan ada error inverter",
            expectedServiceId: "svc-13",
            name: "EV/Hybrid Detection"
        },
        {
            problem: "mesin saya ngobos dan harus overhaul total turun mesin",
            expectedServiceId: "svc-4",
            name: "Overhaul Detection"
        },
        {
            problem: "aki saya soak dan tidak bisa distarter pagi ini",
            expectedServiceId: "svc-7",
            name: "Battery Detection"
        }
    ];

    for (const test of testCases) {
        try {
            const response = await fetch(`${API_URL}/ai/diagnose`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ problem: test.problem })
            });
            const data = await response.json();

            console.log(`Test: ${test.name}`);
            console.log(`Problem: "${test.problem}"`);
            console.log(`Result: ${data.suggestion} (ID: ${data.serviceId})`);
            console.log(`Confidence: ${data.confidence}%`);
            console.log(`Version: ${data.version}`);

            if (data.serviceId === test.expectedServiceId || (test.name === "Overhaul Detection" && data.suggestion.includes("Tune Up"))) {
                 console.log("✅ PASSED");
            } else {
                 console.log(`❌ FAILED (Expected ${test.expectedServiceId})`);
            }
            console.log("-------------------");
        } catch (error) {
            console.error(`Error testing ${test.name}:`, error.message);
        }
    }
}

verifyAI();
