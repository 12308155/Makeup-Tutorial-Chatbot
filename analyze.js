document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.querySelector('.upload-area');
    const fileInput = document.querySelector('#file-input');
    const previewContainer = document.querySelector('.preview-container');
    const previewImage = document.querySelector('#preview-image');
    const fileName = document.querySelector('.file-name');
    const analyzeBtn = document.querySelector('.analyze-btn');
    const changePhotoBtn = document.querySelector('.change-photo-btn');
    const resultsSection = document.querySelector('.analysis-results');
    const steps = document.querySelectorAll('.step');

    // Initially hide preview and results
    previewContainer.style.display = 'none';
    resultsSection.style.display = 'none';

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.choose-file-btn, .analyze-btn, .change-photo-btn');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });

    function createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.className = 'ripple';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 1000);
    }

    // Update active step with animation
    function updateSteps(activeIndex) {
        steps.forEach((step, index) => {
            if (index <= activeIndex) {
                step.classList.add('active');
                animateStep(step);
            } else {
                step.classList.remove('active');
            }
        });
    }

    function animateStep(step) {
        const number = step.querySelector('.step-number');
        number.style.transform = 'scale(1.2)';
        setTimeout(() => {
            number.style.transform = 'scale(1)';
        }, 200);
    }

    // Handle drag and drop with visual feedback
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.add('dragover');
            uploadArea.querySelector('.upload-icon').style.transform = 'scale(1.1) translateY(-5px)';
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.remove('dragover');
            uploadArea.querySelector('.upload-icon').style.transform = 'scale(1)';
        });
    });

    uploadArea.addEventListener('drop', handleDrop);
    fileInput.addEventListener('change', handleFiles);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files } });
    }

    function handleFiles(e) {
        const file = e.target.files[0];
        if (file) {
            if (validateFile(file)) {
                displayPreview(file);
                updateSteps(1);
            }
        }
    }

    function validateFile(file) {
        const validTypes = ['image/jpeg', 'image/png'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!validTypes.includes(file.type)) {
            showError('Please upload a JPG or PNG file.');
            return false;
        }

        if (file.size > maxSize) {
            showError('File size must be less than 5MB.');
            return false;
        }

        return true;
    }

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        uploadArea.appendChild(errorDiv);
        errorDiv.style.opacity = '1';
        
        setTimeout(() => {
            errorDiv.style.opacity = '0';
            setTimeout(() => errorDiv.remove(), 300);
        }, 3000);
    }

    function displayPreview(file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            uploadArea.style.display = 'none';
            previewContainer.style.display = 'block';
            
            // Add fade-in animation
            setTimeout(() => {
                previewContainer.classList.add('show');
            }, 10);

            previewImage.src = e.target.result;
            fileName.textContent = file.name;

            // Add image load animation
            previewImage.style.opacity = '0';
            previewImage.style.transform = 'scale(0.9)';
            
            previewImage.onload = () => {
                previewImage.style.transition = 'all 0.5s ease';
                previewImage.style.opacity = '1';
                previewImage.style.transform = 'scale(1)';
            };
        }
        
        reader.readAsDataURL(file);
    }

    function analyzeSkin(imageData) {
        // Simulated skin analysis results
        return {
            gender: detectGender(),
            skinType: detectSkinType(),
            concerns: detectSkinConcerns(),
            characteristics: analyzeCharacteristics()
        };
    }

    function detectGender() {
        // Simulated gender detection
        const genders = ['Female', 'Male'];
        return genders[Math.floor(Math.random() * genders.length)];
    }

    function detectSkinType() {
        // Simulated skin type detection
        const types = ['Oily', 'Dry', 'Combination', 'Normal'];
        return types[Math.floor(Math.random() * types.length)];
    }

    function detectSkinConcerns() {
        // Simulated skin concerns detection
        const concerns = [
            'Acne',
            'Dark spots',
            'Fine lines',
            'Uneven texture',
            'Large pores'
        ];
        return concerns.slice(0, Math.floor(Math.random() * 3) + 1);
    }

    function analyzeCharacteristics() {
        // Simulated characteristics analysis
        return {
            moisture: Math.floor(Math.random() * 100),
            elasticity: Math.floor(Math.random() * 100),
            pigmentation: Math.floor(Math.random() * 100),
            pores: Math.floor(Math.random() * 100)
        };
    }

    function getProductRecommendations(analysis) {
        // Product recommendations based on skin analysis
        const products = {
            Oily: [
                { name: 'Oil-Free Cleanser', brand: 'CeraVe', price: '$12' },
                { name: 'Mattifying Moisturizer', brand: 'La Roche-Posay', price: '$25' },
                { name: 'Clay Mask', brand: 'Innisfree', price: '$15' }
            ],
            Dry: [
                { name: 'Hydrating Cleanser', brand: 'CeraVe', price: '$15' },
                { name: 'Rich Moisturizer', brand: 'First Aid Beauty', price: '$32' },
                { name: 'Hydrating Serum', brand: 'The Ordinary', price: '$18' }
            ],
            Combination: [
                { name: 'Balanced Cleanser', brand: 'Cetaphil', price: '$14' },
                { name: 'Gel Moisturizer', brand: 'Neutrogena', price: '$22' },
                { name: 'BHA Toner', brand: 'Paula\'s Choice', price: '$29' }
            ],
            Normal: [
                { name: 'Gentle Cleanser', brand: 'Fresh', price: '$38' },
                { name: 'Daily Moisturizer', brand: 'Kiehl\'s', price: '$32' },
                { name: 'Vitamin C Serum', brand: 'Timeless', price: '$25' }
            ]
        };

        return products[analysis.skinType];
    }

    function createRoutine(analysis) {
        // Create personalized skincare routine
        const steps = [
            {
                time: 'Morning',
                steps: [
                    '1. Cleanse with recommended cleanser',
                    '2. Apply toner (if recommended)',
                    '3. Apply serum',
                    '4. Moisturize',
                    '5. Apply sunscreen'
                ]
            },
            {
                time: 'Evening',
                steps: [
                    '1. Double cleanse (oil cleanser + water-based cleanser)',
                    '2. Apply toner',
                    '3. Apply treatment products',
                    '4. Apply night cream',
                    '5. Apply eye cream'
                ]
            }
        ];

        return steps;
    }

    function displayResults(analysis) {
        const skinDetails = document.getElementById('skin-details');
        const productList = document.getElementById('product-recommendations');
        const routineSteps = document.getElementById('skincare-routine');

        // Display skin characteristics (without gender)
        skinDetails.innerHTML = `
            <div class="analysis-card skin-type">
                <h4><i class="fas fa-check-circle"></i> Skin Type</h4>
                <p>${analysis.skinType}</p>
            </div>
            <div class="analysis-card concerns">
                <h4><i class="fas fa-exclamation-circle"></i> Skin Concerns</h4>
                <ul>${analysis.concerns.map(concern => `<li>${concern}</li>`).join('')}</ul>
            </div>
            <div class="characteristics-grid">
                ${Object.entries(analysis.characteristics).map(([key, value]) => `
                    <div class="characteristic-item">
                        <div class="characteristic-label">${key.charAt(0).toUpperCase() + key.slice(1)}</div>
                        <div class="characteristic-bar">
                            <div class="bar-fill" style="width: ${value}%"></div>
                        </div>
                        <div class="characteristic-value">${value}%</div>
                    </div>
                `).join('')}
            </div>
        `;

        // Display product recommendations
        const products = getProductRecommendations(analysis);
        productList.innerHTML = `
            <div class="products-grid">
                ${products.map(product => `
                    <div class="product-card">
                        <div class="product-info">
                            <h4>${product.name}</h4>
                            <p class="brand">${product.brand}</p>
                            <p class="price">${product.price}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Display skincare routine
        const routine = createRoutine(analysis);
        routineSteps.innerHTML = `
            ${routine.map(timeBlock => `
                <div class="routine-block">
                    <h4>${timeBlock.time} Routine</h4>
                    <ul class="routine-list">
                        ${timeBlock.steps.map(step => `<li>${step}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        `;
    }

    analyzeBtn.addEventListener('click', async () => {
        try {
            analyzeBtn.disabled = true;
            analyzeBtn.innerHTML = '<div class="loading-spinner"></div>Analyzing...';
            
            // Simulate analysis delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Perform skin analysis
            const analysis = analyzeSkin(previewImage.src);
            
            // Display results
            resultsSection.style.display = 'block';
            displayResults(analysis);
            resultsSection.classList.add('show');
            
            updateSteps(2);
            
            // Scroll to results
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Analysis failed:', error);
            showError('Failed to analyze the image. Please try again.');
        } finally {
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = 'Analyze Skin';
        }
    });

    changePhotoBtn.addEventListener('click', () => {
        previewContainer.classList.remove('show');
        resultsSection.classList.remove('show');
        
        setTimeout(() => {
            uploadArea.style.display = 'block';
            previewContainer.style.display = 'none';
            resultsSection.style.display = 'none';
            fileInput.value = '';
            updateSteps(0);
        }, 300);
    });

    // Add hover animations for interactive elements
    const interactiveElements = document.querySelectorAll('.upload-area, .preview-container, .analyze-btn');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseover', () => {
            element.style.transform = 'translateY(-2px)';
        });
        
        element.addEventListener('mouseout', () => {
            element.style.transform = 'translateY(0)';
        });
    });
}); 