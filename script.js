document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const repeatCount = document.getElementById('repeatCount');
    const addNewline = document.getElementById('addNewline');
    const addSpace = document.getElementById('addSpace');
    const generateBtn = document.getElementById('generateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const outputText = document.getElementById('outputText');
    const copyBtn = document.getElementById('copyBtn');
    const decBtn = document.getElementById('decBtn');
    const incBtn = document.getElementById('incBtn');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = toast.querySelector('i');
    const wordCount = document.getElementById('wordCount');

    // Number input controls with smooth continuous counting if held down
    let intervalId;

    const modifyValue = (delta) => {
        let val = parseInt(repeatCount.value) || 0;
        let newVal = val + delta;
        if (newVal >= 1 && newVal <= 100000) {
            repeatCount.value = newVal;
        } else if (newVal < 1) {
            repeatCount.value = 1;
        } else if (newVal > 100000) {
            repeatCount.value = 100000;
        }
    };

    decBtn.addEventListener('mousedown', () => {
        modifyValue(-1);
        intervalId = setInterval(() => modifyValue(-10), 100);
    });
    decBtn.addEventListener('mouseup', () => clearInterval(intervalId));
    decBtn.addEventListener('mouseleave', () => clearInterval(intervalId));

    incBtn.addEventListener('mousedown', () => {
        modifyValue(1);
        intervalId = setInterval(() => modifyValue(10), 100);
    });
    incBtn.addEventListener('mouseup', () => clearInterval(intervalId));
    incBtn.addEventListener('mouseleave', () => clearInterval(intervalId));

    // Handle touch for mobile devices
    decBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        modifyValue(-1);
        intervalId = setInterval(() => modifyValue(-10), 100);
    });
    decBtn.addEventListener('touchend', () => clearInterval(intervalId));

    incBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        modifyValue(1);
        intervalId = setInterval(() => modifyValue(10), 100);
    });
    incBtn.addEventListener('touchend', () => clearInterval(intervalId));

    // Enforce min/max manually on input
    repeatCount.addEventListener('input', () => {
        let val = parseInt(repeatCount.value);
        if (val < 1) repeatCount.value = 1;
        if (val > 100000) repeatCount.value = 100000;
    });

    // Generate Text
    function generateRepeatedText() {
        const text = inputText.value;
        const count = parseInt(repeatCount.value) || 1;
        const wantsNewline = addNewline.checked;
        const wantsSpace = addSpace.checked;

        if (!text) {
            showToast('Please enter text to repeat!', 'error');
            outputText.value = "";
            updateWordCount("");
            return;
        }

        generateBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Generating...';
        generateBtn.style.opacity = '0.8';
        generateBtn.disabled = true;

        // Using setTimeout to allow UI to update to "Generating..." before heavy lifting
        setTimeout(() => {
            try {
                let separator = "";
                if (wantsNewline) separator += "\n";
                if (wantsSpace) separator += " ";

                // Construct the repeated text
                let result = text;
                if (count > 1) {
                    // For very large counts, this can lock the browser, use fill and join for performance
                    let parts = new Array(count).fill(text);
                    result = parts.join(separator);
                }

                outputText.value = result;
                updateWordCount(result);

                // Add a subtle animation to the output
                outputText.style.transform = 'scale(0.98)';
                outputText.style.opacity = '0.7';
                setTimeout(() => {
                    outputText.style.transform = 'scale(1)';
                    outputText.style.opacity = '1';
                }, 150);

                // Scroll to bottom of output if large
                outputText.scrollTop = 0;
            } catch (e) {
                showToast('Memory limit exceeded for this output size.', 'error');
            } finally {
                generateBtn.innerHTML = '<i class="ph ph-magic-wand"></i> Generate Text';
                generateBtn.style.opacity = '1';
                generateBtn.disabled = false;
            }
        }, 50);
    }

    generateBtn.addEventListener('click', generateRepeatedText);

    // Clear
    clearBtn.addEventListener('click', () => {
        inputText.value = "";
        outputText.value = "";
        repeatCount.value = "10";
        addNewline.checked = true;
        addSpace.checked = false;
        updateWordCount("");
        
        clearBtn.innerHTML = '<i class="ph ph-check"></i> Cleared';
        setTimeout(() => {
            clearBtn.innerHTML = '<i class="ph ph-trash"></i> Clear';
        }, 1500);
    });

    // Copy to Clipboard
    copyBtn.addEventListener('click', () => {
        if (!outputText.value) {
            showToast('Nothing to copy!', 'error');
            return;
        }

        const originalText = copyBtn.innerHTML;
        
        navigator.clipboard.writeText(outputText.value).then(() => {
            copyBtn.innerHTML = '<i class="ph ph-check"></i> Copied';
            copyBtn.classList.add('copied');
            showToast('Copied to clipboard!', 'success');
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            outputText.select();
            document.execCommand('copy');
            showToast('Copied using fallback method.', 'success');
        });
    });

    // Update Word Count
    function updateWordCount(text) {
        if (!text.trim()) {
            wordCount.textContent = "(0 words)";
            return;
        }
        // Match non-whitespace character sequences
        const words = text.trim().match(/\S+/g);
        const count = words ? words.length : 0;
        
        // Format with commas for large numbers
        const formattedCount = new Intl.NumberFormat().format(count);
        wordCount.textContent = `(${formattedCount} word${count !== 1 ? 's' : ''})`;
    }

    // Toast Notification
    let toastTimeout;
    function showToast(message, type = 'success') {
        toastMessage.textContent = message;
        
        if (type === 'error') {
            toast.classList.add('error');
            toastIcon.className = 'ph ph-warning-circle';
        } else {
            toast.classList.remove('error');
            toastIcon.className = 'ph ph-check-circle';
        }
        
        toast.classList.add('show');
        
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
});
