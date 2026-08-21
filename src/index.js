/* eslint-disable no-undef */
import "./styles.css";

const form = document.querySelector("form");
const emailField = document.querySelector("#email");
const countryField = document.querySelector("#country");
const postcodeField = document.querySelector("#postcode");
const passwordField = document.querySelector("#passw");
const confirmPasswordfield = document.querySelector("#passw-confirm");

const validation = {
  postcodeTouched: false,
  emailTouched: false,
  passwordTouched: false,

  /**
   * Validate all fields at once
   */
  validateAll() {
    this.validateEmail(emailField);
    this.validateCountry(countryField);
    this.validatePostcode(postcodeField);
    this.validatePassword(passwordField);
    this.validatepassWordConfirmation(confirmPasswordfield);
  },

  /**
   * Validates an email input field
   * @param {HTMLInputElement} field email input field
   */
  validateEmail(field) {
    /** @type {HTMLInputElement} */
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
  validateCountry(selectField) {
    /** @type {HTMLInputElement} */
    if (selectField.validity.valueMissing)
      this.showError(selectField.validationMessage, selectField);
    else this.removeError(selectField);
  },

  /**
   * Validate the post code
   * @param {Event} e Event object
   */
  validatePostcode(field) {
    /** @type {HTMLInputElement} */
    console.log(field);

    const country = document.getElementById("country").value;
    const regexBGBE = /^\d{4}$/;
    const regexFR = /^\d{5}$/;
    console.log(regexFR.test(field.value));
    console.log(country);

    field.setCustomValidity("");

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
    else this.showError(field.validationMessage, field);
  },

  validatePassword(field) {
    /** @type {HTMLInputElement} */

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

  validatepassWordConfirmation(confirmField) {
    const passwordField = document.getElementById("passw");
    console.log(passwordField.validity.valid);
    confirmField.setCustomValidity("");

    if (!passwordField.validity.valid) {
      confirmField.setCustomValidity("Please fill in the password first");
    } else if (passwordField.value !== confirmField.value) {
      confirmField.setCustomValidity("Passwords don't match!");
    }

    if (confirmField.validity.valid) this.removeError(confirmField);
    else this.showError(confirmField.validationMessage, confirmField);
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

// email validation
emailField.addEventListener("input", (e) => {
  if (!validation.emailTouched) return;
  console.log("testing email input");
  validation.validateEmail.call(validation, e.target);
});

emailField.addEventListener("blur", (e) => {
  validation.emailTouched = true;
  validation.validateEmail.call(validation, e.target);
});

//country validation
countryField.addEventListener("input", (e) =>
  validation.validateCountry.bind(validation)(e.target),
);

// postal code validation
postcodeField.addEventListener("blur", (e) => {
  validation.postcodeTouched = true;
  validation.validatePostcode.bind(validation)(e.target);
});

postcodeField.addEventListener("input", (e) => {
  if (!validation.postcodeTouched) return;
  validation.validatePostcode.call(validation, e.target);
});

postcodeField.addEventListener("focus", (e) => {
  if (!validation.postcodeTouched) return;
  validation.validatePostcode.call(validation, e.target);
});

passwordField.addEventListener("blur", (e) => {
  validation.passwordTouched = true;
  validation.validatePassword.call(validation, e.target);
});

passwordField.addEventListener("input", (e) => {
  if (!validation.passwordTouched) return;
  validation.validatePassword.call(validation, e.target);
});

confirmPasswordfield.addEventListener("input", (e) =>
  validation.validatepassWordConfirmation.bind(validation)(e.target),
);

confirmPasswordfield.addEventListener("focus", (e) =>
  validation.validatepassWordConfirmation.bind(validation)(e.target),
);

form.addEventListener("submit", formHandler);

function formHandler(e) {
  e.preventDefault();

  console.log(form.checkValidity());
  if (!form.checkValidity()) {
    validation.validateAll();
    console.log("test html");
  } else {
    const successEl = document.createElement("p");
    successEl.textContent = "let's gooooo, succesfully created an account!";
    form.insertAdjacentElement("afterend", successEl);
  }
}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();

  import.meta.webpackHot.dispose(() => {
    form.removeEventListener("submit", formHandler);
  });
}
