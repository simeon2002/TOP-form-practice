import "./styles.css";

const validation = {
  postcodeTouched: false,
  emailTouched: false,
  passwordTouched: false,

  /**
   * Validates an email input field
   * @param {HTMLInputElement} field email input field
   */
  validateEmail(e) {
    /** @type {HTMLInputElement} */
    const field = e.target;
    if (field.type !== "email") return;

    field.setCustomValidity("");

    if (field.validity.typeMismatch) {
    } else if (field.validity.patternMismatch) {
      field.setCustomValidity("Please use a '.com' domain at the end.");
    }

    if (field.validity.valid) this.removeError(field);
    else this.showError(field.validationMessage, field);
  },

  /**
   * Validate country input field
   * @param {Event} e event object
   */
  validateCountry(e) {
    /** @type {HTMLInputElement} */
    const selectField = e.target;
    if (selectField.validity.valueMissing)
      this.showError(selectField.validationMessage, selectField);
    else this.removeError(selectField);
  },

  /**
   * Validate the post code
   * @param {Event} e Event object
   */
  validatePostcode(e) {
    /** @type {HTMLInputElement} */
    const field = e.target;
    const country = document.getElementById("country").value;
    const regexBGBE = /^\d{4}$/;
    const regexFR = /^\d{5}$/;
    console.log(regexFR.test(field.value));
    console.log(country);
    let errorMsg;

    if (country === "BG" && !regexBGBE.test(field.value))
      field.setCustomValidity(
        "A Bulgarian post code needs to consist of 4 digits",
      );
    else if (country === "BE" && !regexBGBE.test(field.value))
      field.setCustomValidity(
        "A Belgian post code needs to consist of 4 digits",
      );
    else if (country === "FR" && !regexFR.test(field.value))
      field.setCustomValidity("A French postcode needs to consist of 5 digits");
    else if (country.length === 0)
      field.setCustomValidity("Please select a country first.");

    if (field.validity.valid) this.removeError(field);
    else this.showError(field);
  },

  validatePassword(e) {
    /** @type {HTMLInputElement} */
    const field = e.target;

    // basic password validation
    if (field.validity.valueMissing) {
      this.showError(field.validationMessage, field);
      return;
    }

    if (field.validity.tooShort) {
      this.showError(field.validationMessage, field);
      return;
    }

    const customErrorMsg = this.customPasswordValidation(field.value);

    field.setCustomValidity(customErrorMsg);

    if (field.validity.valid) this.removeError(field);
    else this.showError(customErrorMsg, field);
  },

  customPasswordValidation(password) {
    const regexSpecialSymbol = /[!@#$]/;
    const regexUppercaseLetter = /[A-Z]/;
    const regexNumber = /\d/;
    const regexLowercaseLetter = /[a-z]/;
    let customErrorMsg = "";

    if (!regexSpecialSymbol.test(password)) {
      customErrorMsg +=
        "Your password should contain at least one special character (!, @, # or $)";
    }
    if (!regexUppercaseLetter.test(password)) {
      customErrorMsg = customErrorMsg
        ? `${customErrorMsg}, one uppercase letter`
        : "Your password should contain at least one uppercase letter";
    }

    if (!regexNumber.test(password)) {
      customErrorMsg = customErrorMsg
        ? `${customErrorMsg}, one number`
        : "Your password should contain at least one number";
    }

    if (!regexLowercaseLetter.test(password)) {
      customErrorMsg = customErrorMsg
        ? `${customErrorMsg}, one lower case letter`
        : "Your password should contain at least one lowercase letter";
    }

    return customErrorMsg;
  },

  validatepassWordConfirmation(e) {
    const passwordField = document.getElementById("passw");
    const confirmField = e.target;

    if (passwordField.value !== confirmField.value) {
      this.showError("Passwords don't match!", confirmField);
      return;
    }

    this.removeError(confirmField);
  },

  /**
   *
   * @param {string} message message to display as error
   * @param {HTMLElement} field input element
   */
  showError(message, field) {
    const html = `
      <div class="error" aria-live="polite"">
        <p>${message}</p>
      </div>
    `;

    this.removeError(field);
    field.insertAdjacentHTML("afterend", html);
  },

  /**
   * Remove error
   * @param {HTMLElement} field HTML element
   */
  removeError(field) {
    const errorEl = field.nextElementSibling;
    if (errorEl) errorEl.remove();
  },
};

const form = document.querySelector("form");
const emailField = document.querySelector("#email");
const countryField = document.querySelector("#country");
const postcodeField = document.querySelector("#postcode");
const passwordField = document.querySelector("#passw");
const confirmPasswordfield = document.querySelector("#passw-confirm");

// email validation
emailField.addEventListener("input", (e) => {
  if (!validation.emailTouched) return;
  console.log("testing email input");
  validation.validateEmail.call(validation, e);
});

emailField.addEventListener("blur", (e) => {
  validation.emailTouched = true;
  validation.validateEmail.call(validation, e);
});

form.addEventListener("submit", (e) => e.preventDefault());

//country validation
countryField.addEventListener(
  "input",
  validation.validateCountry.bind(validation),
);

// postal code validation
postcodeField.addEventListener("blur", (e) => {
  validation.postcodeTouched = true;
  validation.validatePostcode.bind(validation)(e);
});

postcodeField.addEventListener("input", (e) => {
  if (!validation.postcodeTouched) return;
  validation.validatePostcode.call(validation, e);
});

postcodeField.addEventListener("focus", (e) => {
  if (!validation.postcodeTouched) return;
  validation.validatePostcode.call(validation, e);
});

passwordField.addEventListener("blur", (e) => {
  validation.passwordTouched = true;
  validation.validatePassword.call(validation, e);
});

passwordField.addEventListener("input", (e) => {
  if (!validation.passwordTouched) return;
  validation.validatePassword.call(validation, e);
});

confirmPasswordfield.addEventListener(
  "input",
  validation.validatepassWordConfirmation.bind(validation),
);
