document.getElementById('contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const status = document.getElementById('form-status');
    status.textContent = "Sending...";
  
    // Replace with your Formspree endpoint
    const endpoint = "https://formspree.io/f/manogzzp"; // <-- update this!
  
    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value
    };
  
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        status.textContent = "I will contact you shortly. Thank you.";
        form.reset();
      } else {
        status.textContent = "There was an error. Please try again.";
      }
    } catch {
      status.textContent = "There was an error. Please try again.";
    }
  });