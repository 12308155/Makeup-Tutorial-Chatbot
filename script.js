// Formspree Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form-modern');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.submit-btn');
            const formStatus = this.querySelector('.form-status');
            const originalBtnText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            formStatus.style.display = 'none';
            
            // Get form data
            const formData = new FormData(this);
            const formDataObj = {};
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });
            
            try {
                // Send to Formspree with proper headers
                const response = await fetch('https://formspree.io/f/mzzkqkvw', {
                    method: 'POST',
                    body: JSON.stringify(formDataObj),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Success
                    formStatus.className = 'form-status success';
                    formStatus.textContent = '✓ Thank you! Your message has been sent successfully. We\'ll get back to you soon!';
                    formStatus.style.display = 'block';
                    this.reset();
                } else {
                    // Error from Formspree
                    throw new Error(data.error || data.errors?.[0]?.message || 'Submission failed');
                }
            } catch (error) {
                // Network or other error
                formStatus.className = 'form-status error';
                formStatus.textContent = '✗ Oops! Something went wrong. Please try again or email us directly.';
                formStatus.style.display = 'block';
                console.error('Form submission error:', error);
            } finally {
                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }
});
