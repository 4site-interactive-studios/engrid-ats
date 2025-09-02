export const customScript = function (App, EnForm) {
  /*
   * Updates the label of a field to indicate if it is required.
   * @param {HTMLElement} field - The ".en__field" element to update.
   */
  function updateLabel(field) {
    const fieldEl = field.querySelector(".en__field__input");

    let isFieldRequired =
      fieldEl.required ||
      fieldEl.getAttribute("aria-required") === "true" ||
      field.classList.contains("en__mandatory") ||
      fieldEl.closest(".en__component--formblock.i-required");

    const enField = fieldEl.closest(".en__field");
    const enForm = enField?.parentElement;

    if (enForm) {
      // Check if field is required based on its parent's iX-required class
      const index = [...enForm.children].indexOf(enField);
      if (enForm.classList.contains(`i${index + 1}-required`)) {
        isFieldRequired = true;
      }

      // Update the label to reflect the required status
      const labelEl = enField.querySelector(".en__field__label");
      if (labelEl) {
        const label = labelEl.textContent.trim();
        if (isFieldRequired && !label.endsWith("*")) {
          labelEl.textContent = `${label}*`;
        } else if (!isFieldRequired && label.endsWith("*")) {
          labelEl.textContent = label.slice(0, -1);
        }
      }
    }
  }

  // Update the label of each field based on its required status
  const fields = document.querySelectorAll(".en__field");
  fields.forEach((field) => {
    const skipFields = ["en__field--donationAmt", "en__field--recurrfreq"];
    if (
      [...field.classList].some((className) => skipFields.includes(className))
    ) {
      return;
    }

    updateLabel(field);
    const observer = new MutationObserver(() => updateLabel(field));
    observer.observe(field, {
      childList: true,
      subtree: true,
    });
  });

  /*
   * Clears and sets a placeholder for the "Other Amount" input field when it is focused or blurred.
   */
  function handleOtherAmtPlaceholder() {
    const donationFields = document.querySelectorAll(
      ".en__field--donationAmt .en__field__item"
    );

    donationFields.forEach((field) => {
      const input = field.querySelector(
        "input[name='transaction.donationAmt.other']"
      );
      if (input) {
        const placeholder = "Other";
        input.placeholder = placeholder;
        input.addEventListener("focusin", function () {
          this.placeholder = "";
        });
        input.addEventListener("focusout", function () {
          if (!this.value && isVisuallyEmpty(this)) {
            this.placeholder = placeholder;
          }
        });
      }
    });
  }

  function isVisuallyEmpty(input) {
    // Check if the ::before pseudo-element has visible content
    const beforeContent = window
      .getComputedStyle(input, "::before")
      .getPropertyValue("content");
    return (
      beforeContent === "none" ||
      beforeContent === '""' ||
      beforeContent.trim() === ""
    );
  }

  const targetNode = document.querySelector(".en__field--donationAmt");
  if (targetNode) {
    const observer = new MutationObserver(handleOtherAmtPlaceholder);
    observer.observe(targetNode, {
      childList: true,
      subtree: true,
    });
    handleOtherAmtPlaceholder();
  }

  // Add upsell message below the recurring selector
  const upsell = document.querySelector(".upsell-message");
  const recurrField = document.querySelector(".en__field--recurrfreq");
  if (upsell && recurrField) {
    // Inserting it at the end and using CSS to handle order to prevent disrupting i-X field helpers
    recurrField.parentElement?.insertAdjacentElement("beforeend", upsell);
  }

  const inlineMonthlyUpsell = document.querySelector(
    ".move-after-transaction-recurrfreq"
  );
  const recurrFrequencyField = document.querySelector(".en__field--recurrfreq");
  if (inlineMonthlyUpsell && recurrFrequencyField) {
    recurrFrequencyField.insertAdjacentElement(
      "beforeend",
      inlineMonthlyUpsell
    );
    // inlineMonthlyUpsell.style.visibility='visible';
  }

  // Add Images to the transaction.giveBySelect labels
  const paymentMethods = document.querySelectorAll(
    "[name='transaction.giveBySelect'] + label"
  );
  paymentMethods.forEach((label) => {
    switch (label.getAttribute("for")) {
      case "give-by-select-card":
        label.innerHTML = `<img class="credit-card-logos" src="https://acb0a5d73b67fccd4bbe-c2d8138f0ea10a18dd4c43ec3aa4240a.ssl.cf5.rackcdn.com/10129/donation-payment-type_credit-cards.png" alt="Credit Card Logos" />`;
        break;
      case "give-by-select-apple-google":
        label.innerHTML = `<img class="apple-pay-google-pay" src="https://acb0a5d73b67fccd4bbe-c2d8138f0ea10a18dd4c43ec3aa4240a.ssl.cf5.rackcdn.com/10129/donation-payment-type_apple-pay-google-pay.png" alt="Apple Pay and Google Pay Logos" />`;
        break;
      case "give-by-select-venmo":
        label.innerHTML = `<img class="venmo" src="https://acb0a5d73b67fccd4bbe-c2d8138f0ea10a18dd4c43ec3aa4240a.ssl.cf5.rackcdn.com/10129/venmo.png" alt="Venmo Logo" />`;
        break;
      case "give-by-select-paypal":
        label.innerHTML = `<img class="paypal" src="https://acb0a5d73b67fccd4bbe-c2d8138f0ea10a18dd4c43ec3aa4240a.ssl.cf5.rackcdn.com/10129/donation-payment-type_paypal.png" alt="Paypal Logo" />`;
        break;
      case "give-by-select-paypaltouch":
        label.innerHTML = `<img class="paypaltouch" src="https://acb0a5d73b67fccd4bbe-c2d8138f0ea10a18dd4c43ec3aa4240a.ssl.cf5.rackcdn.com/10129/donation-payment-type_paypal.png" alt="Paypal Logo" />`;
        break;
    }
  });
};
