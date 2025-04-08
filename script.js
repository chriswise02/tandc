document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const elements = {
        promoType: document.getElementById("promoType"),
        promoInputs: document.getElementById("promoInputs"),
        generateBtn: document.getElementById("generateBtn"),
        error: document.getElementById("error"),
        output: document.getElementById("output"),
        copyBtn: document.getElementById("copyBtn"),
        disclaimer: document.getElementById("disclaimer")
    };

    // Initialize the app
    function init() {
        // Hide elements that should be hidden initially
        elements.generateBtn.style.display = "none";
        elements.error.style.display = "none";
        elements.output.style.display = "none";
        elements.copyBtn.style.display = "none";
        elements.disclaimer.style.display = "none";

        // Attach event listeners
        attachEventListeners();
    }

    // Attach all event listeners
    function attachEventListeners() {
        elements.promoType.addEventListener("change", handlePromoTypeChange);
        elements.generateBtn.addEventListener("click", handleGenerateClick);
        elements.copyBtn.addEventListener("click", handleCopyClick);
    }

    // Handle promo type change
    function handlePromoTypeChange(event) {
        const promoType = event.target.value;
        updatePromoInputs(promoType);
        resetOutput();
    }

    // Handle generate button click
    function handleGenerateClick() {
        const inputs = getFormInputs();
        const errors = validateInputs(inputs);

        if (errors.length > 0) {
            displayErrors(errors);
        } else {
            clearErrors();
            const terms = promoGenerators[inputs.promoType](inputs);
            displayOutput(terms);
        }

        // Scroll to the output section
        scrollToOutput();
    }

    // Handle copy button click
    function handleCopyClick() {
        const output = elements.output.textContent;
        navigator.clipboard.writeText(output).then(() => {
            // Visual feedback for copy
            elements.copyBtn.classList.add("copied");
            elements.copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            
            // Revert back after 2 seconds
            setTimeout(() => {
                elements.copyBtn.classList.remove("copied");
                elements.copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy to Clipboard';
            }, 2000);
        });
    }

    // Reset output section
    function resetOutput() {
        elements.output.style.display = "none";
        elements.copyBtn.style.display = "none";
        elements.error.style.display = "none";
        elements.disclaimer.style.display = "none";
        elements.generateBtn.style.display = "block";
    }

    // Scroll to output section
    function scrollToOutput() {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
        });
    }

    // Function to update the input fields based on selected promo type
    function updatePromoInputs(promoType) {
        elements.promoInputs.innerHTML = ""; // Clear previous inputs

        // Add common inputs for all promo types
        const commonInputs = createCommonInputs();
        elements.promoInputs.innerHTML = commonInputs;

        // Add specific inputs based on promo type
        if (promoType === "xOff") {
            elements.promoInputs.innerHTML += createXOffInputs();
        } else if (promoType === "zeroDelivery") {
            elements.promoInputs.innerHTML += createZeroDeliveryInputs();
        } else if (promoType === "bogo") {
            elements.promoInputs.innerHTML += createBogoInputs();
        } else if (promoType === "xOffSaveUpToX") {
            elements.promoInputs.innerHTML += createXOffSaveUpToXInputs();
        }
    }

    // Create common input fields for all promo types
    function createCommonInputs() {
        return `
            <div class="form-group">
                <label for="endDate">End Date:</label>
                <input type="date" id="endDate" class="input-field">
            </div>

            <div class="form-group">
                <label for="dashPassOnly">DashPass Only?</label>
                <select id="dashPassOnly" class="input-field boolean-field">
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            </div>

            <div class="form-group">
                <label for="mxLocationExclusive">Mx/Location Exclusive?</label>
                <select id="mxLocationExclusive" class="input-field boolean-field">
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            </div>

            <div class="form-group">
                <label for="mxLocation">Mx/Location (required if "Yes" in previous field):</label>
                <input type="text" id="mxLocation" class="input-field">
            </div>
        `;
    }

    // Create input fields for $X Off promo type
    function createXOffInputs() {
        return `
            <div class="form-group">
                <label for="minSubtotal">Minimum Subtotal:</label>
                <input type="number" id="minSubtotal" class="input-field">
            </div>
    
            <div class="form-group">
                <label for="orders">Number of Orders:</label>
                <input type="number" id="orders" class="input-field">
            </div>
    
            <div class="form-group">
                <label for="promoCode">Promo Code (optional):</label>
                <input type="text" id="promoCode" class="input-field">
            </div>
    
            <div class="form-group">
                <label for="autoRedeem">Auto Redeem?</label>
                <select id="autoRedeem" class="input-field boolean-field">
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            </div>

            <div class="form-group">
                <label for="discountLevels">Discount Levels ($)</label>
                <input type="number" id="discountLevels" class="input-field">
            </div>

            <div class="form-group">
                <label for="showInWallet">Show in Wallet?</label>
                <select id="showInWallet" class="input-field boolean-field">
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            </div>
    
            <div class="form-group">
                <label for="pickup">Available for pickup orders?</label>
                <select id="pickup" class="input-field boolean-field">
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            </div>
    
            <div class="form-group">
                <label for="alcohol">Alcohol?</label>
                <select id="alcohol" class="input-field boolean-field">
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            </div>
        `;
    }

    // Create input fields for $0 Delivery Fee promo type
    function createZeroDeliveryInputs() {
        return `
            <div class="form-group">
                <label for="minSubtotal">Minimum Subtotal:</label>
                <input type="number" id="minSubtotal" class="input-field">
            </div>
    
            <div class="form-group">
                <label for="orders">Number of Orders:</label>
                <input type="number" id="orders" class="input-field">
            </div>
    
            <div class="form-group">
                <label for="promoCode">Promo Code (optional):</label>
                <input type="text" id="promoCode" class="input-field">
            </div>
    
            <div class="form-group">
                <label for="autoRedeem">Auto Redeem?</label>
                <select id="autoRedeem" class="input-field boolean-field">
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            </div>
        `;
    }

    // Create input fields for BOGO promo type
    function createBogoInputs() {
        return `
            <div class="form-group">
                <label for="numBogoItems">Number of BOGO items:</label>
                <input type="number" id="numBogoItems" class="input-field">
            </div>
        `;
    }

    // Create input fields for X% Off Save Up to $X promo type
    function createXOffSaveUpToXInputs() {
        return `
            <div class="form-group">
                <label for="discountLevelsPercent">Discount Levels (%)</label>
                <input type="number" id="discountLevelsPercent" class="input-field">
            </div>
            
            <div class="form-group">
                <label for="maxDiscount">Max Discount ($)</label>
                <input type="number" id="maxDiscount" class="input-field">
            </div>
            
            <div class="form-group">
                <label for="minSubtotal">Minimum Subtotal ($)</label>
                <input type="number" id="minSubtotal" class="input-field">
            </div>
            
            <div class="form-group">
                <label for="orders">Number of Orders:</label>
                <input type="number" id="orders" class="input-field">
            </div>
            
            <div class="form-group">
                <label for="pickup">Available for pickup orders?</label>
                <select id="pickup" class="input-field boolean-field">
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="promoCode">Promo Code (optional):</label>
                <input type="text" id="promoCode" class="input-field">
            </div>
            
            <div class="form-group">
                <label for="autoRedeem">Auto Redeem?</label>
                <select id="autoRedeem" class="input-field boolean-field">
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="showInWallet">Show in Wallet?</label>
                <select id="showInWallet" class="input-field boolean-field">
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="alcohol">Alcohol?</label>
                <select id="alcohol" class="input-field boolean-field">
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            </div>
        `;
    }

    // Function to get form inputs
    function getFormInputs() {
        const getValue = (id) =>
            document.getElementById(id) ? document.getElementById(id).value : "";
            
        return {
            promoType: getValue("promoType"),
            endDate: getValue("endDate"),
            discountLevels: getValue("discountLevels"),
            discountLevelsPercent: getValue("discountLevelsPercent"),
            minSubtotal: getValue("minSubtotal"),
            orders: getValue("orders"),
            pickup: getValue("pickup"),
            promoCode: getValue("promoCode"),
            autoRedeem: getValue("autoRedeem"),
            showInWallet: getValue("showInWallet"),
            alcohol: getValue("alcohol"),
            dashPassOnly: getValue("dashPassOnly"),
            mxLocationExclusive: getValue("mxLocationExclusive"),
            mxLocation: getValue("mxLocation"),
            numBogoItems: getValue("numBogoItems"),
            maxDiscount: getValue("maxDiscount"),
        };
    }

    // Function to format date as MM-DD-YYYY
    function formatDate(dateString) {
        if (!dateString) return "";
        
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${month}-${day}-${year}`;
    }

    // Function to validate inputs
    function validateInputs(inputs) {
        const errors = [];

        // Validate boolean fields only if they exist on the page
        document.querySelectorAll(".boolean-field").forEach((field) => {
            if (field.closest("#promoInputs")) {
                // Ensure the field is within the dynamically added container
                if (!field.value) {
                    errors.push(
                        `Please select "Yes" or "No" for ${field.previousElementSibling.textContent}`
                    );
                }
            }
        });

        // Validate Mx/Location Exclusive field only if it exists
        const mxLocationField = document.getElementById("mxLocation");
        if (
            document.getElementById("mxLocationExclusive") &&
            inputs.mxLocationExclusive === "Yes" &&
            !mxLocationField.value
        ) {
            errors.push(
                "If 'Mx/Location Exclusive?' is set to 'Yes', you must fill out 'Mx/Location'."
            );
        }

        // Validate End Date only if the field exists
        const endDateField = document.getElementById("endDate");
        if (endDateField && !inputs.endDate) {
            errors.push("You must set an 'End Date' for the promotion.");
        }

        // Validate Discount Level only if the field exists
        const discountLevelField = document.getElementById("discountLevels");
        if (discountLevelField && !inputs.discountLevels) {
            errors.push("You must set a 'Discount Level' for the promotion.");
        }
        
        // Validate Discount Level % only if the field exists
        const discountLevelsPercentField = document.getElementById("discountLevelsPercent");
        if (discountLevelsPercentField && !inputs.discountLevelsPercent) {
            errors.push("You must set a 'Discount Level' for the promotion.");
        }
        
        // Validate min subtotal only if the field exists
        const minSubtotalField = document.getElementById("minSubtotal");
        if (minSubtotalField && !inputs.minSubtotal) {
            errors.push("You must set the minimum subtotal for the promotion.");
        }

        return errors;
    }

    // Function to display errors
    function displayErrors(errors) {
        elements.error.textContent = errors.join("\n");
        elements.error.style.display = "block";
    }

    // Function to clear errors
    function clearErrors() {
        elements.error.style.display = "none";
    }

    // Function to display generated terms
    function displayOutput(terms) {
        elements.output.innerHTML = terms;
        elements.output.style.display = "block";
        elements.copyBtn.style.display = "block";
        elements.disclaimer.style.display = "block";
    }

    // Promo Generators
    const promoGenerators = {
        xOff: (inputs) => {
            let terms = `Offer valid through ${formatDate(inputs.endDate)}`;
            if (inputs.mxLocationExclusive === "Yes" && inputs.mxLocation) {
                terms += ` on orders placed at ${inputs.mxLocation}`;
            }

            terms += `. Valid on only ${inputs.orders} ${
                inputs.orders == 1 ? "order" : "orders"
            }`;
            if (inputs.minSubtotal > 0) {
                terms += ` with a minimum subtotal of $${inputs.minSubtotal}`;
            }

            terms += `, excluding fees and taxes. Discount applies to subtotal only; does not apply to fees, taxes, and gratuity. `;
            terms += `If the full $${inputs.discountLevels} value is not used on a single order, the remaining value will be forfeited.`;

            if (inputs.pickup === "No") terms += ` Not valid for pickup.`;
            if (inputs.orders == 1) terms += ` Limit one per person.`;
            if (inputs.alcohol === "No")
                terms += ` Not valid for the purchase of alcohol.`;
            else
                terms += ` Alcohol delivery and alcohol sales are permitted in certain states and only to people 21+. Please drink responsibly.`;
            terms +=
                " Fees, taxes, and gratuity still apply. Only available to select users as indicated in their account associated with this email address.";
            if (inputs.promoCode)
                terms += ` Use promo code ${inputs.promoCode.toUpperCase()} to redeem.`;
            if (inputs.dashPassOnly === "Yes")
                terms += ` Must have an active DashPass subscription.`;
            if (inputs.showInWallet === "Yes")
                terms += ` Select offer from wallet to redeem.`;
            if (inputs.autoRedeem === "Yes")
                terms += ` Offer will be automatically applied to order upon checkout.`;
            terms += ` See further terms and conditions at https://drd.sh/8ONpZP/.`;
            return terms;
        },
        zeroDelivery: (inputs) => {
            let terms = `Offer valid through ${formatDate(inputs.endDate)}`;
            if (inputs.mxLocationExclusive === "Yes" && inputs.mxLocation) {
                terms += ` on orders placed at ${inputs.mxLocation}`;
            }

            terms += `. Valid only ${inputs.orders} ${
                inputs.orders == 1 ? "order" : "orders"
            }`;
            if (inputs.minSubtotal > 0) {
                terms += ` with a minimum subtotal of $${inputs.minSubtotal}`;
            }

            terms += `, excluding fees and taxes. Other fees (including service fee), taxes, and gratuity still apply. Qualifying orders containing alcohol will be charged a $0.01 Delivery Fee.`;

            if (inputs.orders == 1) terms += ` Limit one per person.`;
            if (inputs.alcohol === "No")
                terms += ` Not valid for the purchase of alcohol.`;
            else
                terms += ` Alcohol delivery and alcohol sales are permitted in certain states and only to people 21+. Please drink responsibly.`;

            if (inputs.promoCode)
                terms += ` Use promo code ${inputs.promoCode.toUpperCase()} to redeem.`;
            if (inputs.dashPassOnly === "Yes")
                terms += ` Must have an active DashPass account.`;
            if (inputs.showInWallet === "Yes")
                terms += ` Select offer from wallet to redeem.`;
            if (inputs.autoRedeem === "Yes")
                terms += ` Offer will be automatically applied to order upon checkout.`;

            terms += ` See further terms and conditions at https://drd.sh/8ONpZP/.`;
            terms += ` Non-transferable.`;
            return terms;
        },
        bogo: (inputs) => {
            let terms = `Offer valid through ${formatDate(inputs.endDate)}`;

            terms += ` for 1 free, regular-priced menu item labeled as a 'Buy 1 get 1 free' menu item for delivery orders`;
            if (inputs.mxLocation) {
                terms += ` from participating locations of ${inputs.mxLocation}`;
            } else {
                terms += ` from participating locations`;
            }
            terms += `, while supplies last.`;

            terms += ` Cart must include at least ${
                inputs.numBogoItems * 2
            } items labeled as 'Buy 1 get 1 free' menu items.`;
            terms += ` Discount applies to base item price only; fees, taxes, and gratuity still apply.`;
            terms += ` Only available to select users as indicated in their account associated with this email address.`;

            terms += ` Limit of ${inputs.numBogoItems} items labeled as 'Buy 1, get 1 free' items can be added to cart per order; half of those eligible items will be free.`;

            if (inputs.dashPassOnly === "Yes") {
                terms += ` Must have an active DashPass account.`;
            }

            terms += ` DoorDash reserves the right to modify or cancel this offer at any time.`;
            terms += ` See further terms and conditions at https://drd.sh/8ONpZP/.`;

            return terms;
        },
        xOffSaveUpToX: (inputs) => {
            let terms = `Offer valid through ${formatDate(inputs.endDate)}`;
            if (inputs.mxLocationExclusive === "Yes" && inputs.mxLocation) {
                terms += ` on orders placed at ${inputs.mxLocation}`;
            }

            terms += `. Valid only on ${inputs.orders} ${
                inputs.orders == 1 ? "order" : "orders"
            }`;
            if (inputs.minSubtotal > 0) {
                terms += ` with a minimum subtotal of $${inputs.minSubtotal}, excluding fees and taxes`;
            }

            if (inputs.maxDiscount && inputs.maxDiscount !== 1000) {
                terms += `. Maximum value of discount is $${inputs.maxDiscount}`;
            }

            terms += `. Discount applies to subtotal only; does not apply to fees, taxes, and gratuity.`;

            if (inputs.pickup === "No") {
                terms += ` Not valid for pickup.`;
            }

            if (inputs.orders == 1) {
                terms += ` Limit one per person.`;
            }

            if (inputs.alcohol === "No") {
                terms += ` Not valid for the purchase of alcohol.`;
            } else {
                terms += ` Alcohol delivery and alcohol sales are permitted in certain states and only to people 21+. Please drink responsibly.`;
            }

            terms += ` Fees, taxes, and gratuity still apply. Only available to select users as indicated in their account associated with this email address.`;

            if (inputs.promoCode && inputs.promoCode !== "N/A") {
                terms += ` Use promo code ${inputs.promoCode.toUpperCase()} to redeem.`;
            }

            if (inputs.dashPassOnly === "Yes") {
                terms += ` Must have an active DashPass account.`;
            }

            if (inputs.autoRedeem === "Yes") {
                terms += ` Offer will be automatically applied to order upon checkout.`;
            }

            if (inputs.showInWallet === "Yes") {
                terms += ` Select offer from wallet to redeem.`;
            }

            terms += ` See further terms and conditions at https://drd.sh/8ONpZP/.`;

            return terms;
        },
    };

    // Initialize the app
    init();
});