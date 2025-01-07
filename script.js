document.addEventListener("DOMContentLoaded", () => {
    // Attach event listeners
    document.getElementById("promoType").addEventListener("change", (event) => {
        updatePromoInputs(event.target.value);

        // Clear the output box
        document.getElementById("output").style.display = "none";
        document.getElementById("copyBtn").style.display = "none";
        document.getElementById("error").style.display = "none";
        document.getElementById("disclaimer").style.display = "none";
        document.getElementById("generateBtn").style.display = "block";
        // Hide the "Copied!" message if it exists
        const copyMessage = document.getElementById("copyMessage");
        if (copyMessage) {
            copyMessage.textContent = ""; // Hide the text
        }
    });

    document.getElementById("generateBtn").addEventListener("click", () => {
        const inputs = getFormInputs();
        const errors = validateInputs(inputs);

        const errorContainer = document.getElementById("error");
        if (errors.length > 0) {
            displayErrors(errorContainer, errors);
        } else {
            clearErrors(errorContainer);
            const terms = promoGenerators[inputs.promoType](inputs);
            displayOutput(terms);
        }

        // Scroll to the bottom of the page
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth", // Adds a smooth scrolling effect
        });
    });

    document.getElementById("copyBtn").addEventListener("click", () => {
        const output = document.getElementById("output").textContent; // Use textContent instead of value
        navigator.clipboard.writeText(output).then(() => {
            // Update the button text
            const copyBtn = document.getElementById("copyBtn");
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "Copied!";
            
            // Revert back to the original text after 2 seconds
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        });
    });
    

    // Function to update the input fields based on selected promo type
    function updatePromoInputs(promoType) {
        const promoInputsContainer = document.getElementById("promoInputs");
        promoInputsContainer.innerHTML = ""; // Clear previous inputs

        const commonInputs = `
            <label for="endDate">End Date:</label>
            <input type="date" id="endDate" class="input-field">

            <label for="dashPassOnly">DashPass Only?</label>
            <select id="dashPassOnly" class="input-field boolean-field">
                <option value="">Select...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
            </select>
            <label for="mxLocationExclusive">Mx/Location Exclusive?</label>
            <select id="mxLocationExclusive" class="input-field boolean-field">
                <option value="">Select...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
            </select>

            <label for="mxLocation">Mx/Location (required if "Yes" above):</label>
            <input type="text" id="mxLocation" class="input-field">

        `;

        promoInputsContainer.innerHTML = commonInputs;

        if (promoType === "xOff") {
            promoInputsContainer.innerHTML += `
                <label for="minSubtotal">Minimum Subtotal:</label>
                <input type="number" id="minSubtotal" class="input-field">
        
                <label for="orders">Number of Orders:</label>
                <input type="number" id="orders" class="input-field">
        
                <label for="promoCode">Promo Code (optional):</label>
                <input type="text" id="promoCode" class="input-field">
        
                <label for="autoRedeem">Auto Redeem?</label>
                <select id="autoRedeem" class="input-field boolean-field">
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>

                <label for="discountLevels">Discount Levels ($)</label>
                <input type="number" id="discountLevels" class="input-field">

                <label for="showInWallet">Show in Wallet?</label>
                <select id="showInWallet" class="input-field boolean-field">
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
        
                <label for="pickup">Available for pickup orders?</label>
                <select id="pickup" class="input-field boolean-field">
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
        
                <label for="alcohol">Alcohol?</label>
                <select id="alcohol" class="input-field boolean-field">
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            `;
        } else if (promoType === "zeroDelivery") {
            promoInputsContainer.innerHTML += `
                <label for="minSubtotal">Minimum Subtotal:</label>
                <input type="number" id="minSubtotal" class="input-field">
        
                <label for="orders">Number of Orders:</label>
                <input type="number" id="orders" class="input-field">
        
                <label for="promoCode">Promo Code (optional):</label>
                <input type="text" id="promoCode" class="input-field">
        
                <label for="autoRedeem">Auto Redeem?</label>
                <select id="autoRedeem" class="input-field boolean-field">
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
        
                <label for="dashPassOnly">DashPass Only?</label>
                <select id="dashPassOnly" class="input-field boolean-field">
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            `;
        } else if (promoType === "bogo") {
            promoInputsContainer.innerHTML += `
                <label for="numBogoItems">Number of BOGO items:</label>
                <input type="number" id="numBogoItems" class="input-field">
            `;
        } else if (promoType === "xOffSaveUpToX") {
            promoInputsContainer.innerHTML += `
            <label for="discountLevelsPercent">Discount Levels (%)</label>
            <input type="number" id="discountLevelsPercent" class="input-field">
             <label for="maxDiscount">Max Discount ($)</label>
            <input type="number" id="maxDiscount" class="input-field">  
            <label for="minSubtotal">Minimum Subtotal ($)</label>
            <input type="number" id="minSubtotal" class="input-field"> 
            <label for="orders">Number of Orders:</label>
            <input type="number" id="orders" class="input-field">
            <label for="pickup">Available for pickup orders?</label>
            <select id="pickup" class="input-field boolean-field">
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
            </select>
            <label for="promoCode">Promo Code (optional):</label>
            <input type="text" id="promoCode" class="input-field">
            <label for="autoRedeem">Auto Redeem?</label>
                <select id="autoRedeem" class="input-field boolean-field">
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            <label for="showInWallet">Show in Wallet?</label>
                <select id="showInWallet" class="input-field boolean-field">
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            <label for="alcohol">Alcohol?</label>
                <select id="alcohol" class="input-field boolean-field">
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
                `;
        }
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
            !mxLocationField
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
    function displayErrors(container, errors) {
        container.textContent = errors.join("\n");
        container.classList.add("error");
        container.style.display = "block";
    }

    // Function to clear errors
    function clearErrors(container) {
        container.style.display = "none";
    }

    // Function to display generated terms
    function displayOutput(terms) {
        document.getElementById("output").innerHTML = terms;
        document.getElementById("output").style.display = "block";
        document.getElementById("copyBtn").style.display = "block";
    }

    // Promo Generators
    const promoGenerators = {
        xOff: (inputs) => {
            let terms = `Offer valid through ${inputs.endDate}`;
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
            let terms = `Offer valid through ${inputs.endDate}`;
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
            let terms = `Offer valid through ${inputs.endDate}`;

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
            let terms = `Offer valid through ${inputs.endDate}`;
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
});