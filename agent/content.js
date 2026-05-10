chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "START_AGENT") {
    runAutonomousAgent().then(() => sendResponse({ success: true }));
    return true; // Keeps the message channel open for async work
  }
});

async function runAutonomousAgent() {
  console.log("🤖 HustleBuddy Agent: Booting up...");

  // 1. EXTRACT (The Eyes)
  const inputs = Array.from(document.querySelectorAll("input:not([type='hidden']), textarea"));
  const formFields = inputs.map(input => ({
    id: input.id || "no-id",
    name: input.name || "no-name",
    type: input.type,
    placeholder: input.placeholder || "",
    label: input.getAttribute('aria-label') || ""
  }));

  console.log(`🤖 Agent: Found ${formFields.length} readable fields. Sending to Brain...`);

  // 2. REASON (The Brain - Calling your backend)
  try {
    const response = await fetch("http://localhost:3000/ai/agent-autofill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        formFields: formFields,
        userId: 4 // HARDCODED for testing. Later we will link this to your login token!
      })
    });

    const data = await response.json();

    if (!data.success) {
      console.error("🤖 Agent Error:", data.error);
      return;
    }

    const aiMapping = data.mapping;
    console.log("🤖 Agent: Brain returned mapping:", aiMapping);

    // 3. EXECUTE (The Hands)
    // Loop through the AI's answers and inject them into the page
    inputs.forEach(input => {
      // The AI might have keyed the answer by the input's ID or Name
      const answer = aiMapping[input.id] || aiMapping[input.name];
      
      if (answer) {
        input.value = answer;
        
        // This forces React/Angular websites to realize the input changed
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Add a cool visual flash so the user sees the AI working!
        input.style.backgroundColor = "#e0e7ff"; 
        input.style.transition = "background-color 0.5s";
        setTimeout(() => input.style.backgroundColor = "", 1500);
      }
    });

    console.log("Agent: Autofill complete!");

  } catch (err) {
    console.error("Agent: Failed to reach backend Brain.", err);
  }
}