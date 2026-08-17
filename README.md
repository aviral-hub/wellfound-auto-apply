# Wellfound Auto-Apply — Usage Guide

## Overview

`wellfound-auto-apply` is a browser-console automation script designed to streamline repetitive actions when reviewing and applying to jobs on Wellfound.

The script can:

* Detect available job listings.
* Open job details.
* Skip jobs older than 7 days.
* Fill supported application questions.
* Insert a predefined application message.
* Submit eligible applications.
* Continue through additional job listings.
* Display a final summary of applications and skipped jobs.

> **Important:** Review every application before submitting it when possible. Automated answers should accurately represent your skills, experience, location preferences, and eligibility. Use automation only in ways permitted by Wellfound's current terms and policies.

---

## Requirements

You need:

* A Wellfound account.
* A desktop browser such as Chrome or Edge.
* Access to Wellfound job listings.
* The JavaScript file from this repository.

No Node.js, Python, npm, or additional dependencies are required for the browser-console version.

---

## 1. Open Wellfound

Open Wellfound in your browser and navigate to the jobs section.

Sign in to your account and configure your job search normally.

For example, you may first filter jobs according to:

* Job role
* Location
* Remote/hybrid/on-site
* Experience level
* Salary
* Skills
* Employment type

The script works on the jobs currently exposed by the Wellfound page.

---

## 2. Open the Browser Developer Console

In Chrome or Edge:

### Windows

Press:

```text
Ctrl + Shift + J
```

### macOS

Press:

```text
Cmd + Option + J
```

Alternatively:

1. Right-click the page.
2. Select **Inspect**.
3. Open the **Console** tab.

---

## 3. Copy the Automation Script

Open:

```text
src/wellfound-auto-apply.js
```

Copy the complete contents of the file.

Paste it into the browser's Console.

If the browser displays a warning about pasting code into the DevTools console, do not bypass that warning unless you understand exactly what the pasted code does.

---

## 4. Start the Script

After pasting the script, press:

```text
Enter
```

You should see a message similar to:

```text
🚀 Starting smart auto-apply on Wellfound (1 week filter)...
```

The script will then begin processing the currently loaded job listings.

---

## 5. Job Age Filter

The default behavior is to process jobs posted within the previous **7 days**.

The script checks:

* `datetime` attributes on time/date elements.
* Visible job-date text.
* Expressions such as:

  * `2 weeks ago`
  * `3 weeks`
  * `5 days ago`
  * `5d ago`
  * `2w ago`

Jobs identified as older than one week are skipped.

The console reports:

```text
⏭️ Skipping - Job older than 1 week
```

---

## 6. Application Message

The application message is defined inside:

```javascript
const applicationText = `...`;
```

Before using the script, replace the example text with your own accurate information.

For example:

```javascript
const applicationText = `Hey there,

I'm Aviral Pathak, an Information Technology undergraduate with experience in B2B sales, data analysis, stakeholder coordination, leadership, and business-focused problem solving.

GitHub:
https://github.com/aviral-hub/datavtool

LinkedIn:
https://www.linkedin.com/in/aviralpathak/

Portfolio:
https://aviralweb.vercel.app/`;
```

Do not claim experience, qualifications, work authorization, location, or skills that you do not actually have.

---

## 7. Custom Questions

The script attempts to detect custom radio-button questions.

For supported questions, it currently uses positional selection:

```text
3 options → second option
2 options → first option
```

This is intentionally generic and **should not be treated as a reliable way to answer employer questions**.

If an employer asks questions such as:

* Years of experience
* Work authorization
* Willingness to relocate
* Salary expectations
* Availability
* Specific technical experience

you should configure the automation to select an answer that is actually true for you.

---

## 8. Relocation Questions

The script attempts to detect the relocation/location qualification form.

It looks for:

```text
qualification.location.action
```

and the location selector associated with:

```text
qualification.location.locationId
```

If detected, it attempts to select the first available location.

Because Wellfound's interface can change, this part may stop working if the site's HTML structure changes.

---

## 9. Scrolling

The script processes jobs currently available on the page.

When it reaches the end of the currently loaded listings, it scrolls down:

```javascript
window.scrollTo({
  top: document.body.scrollHeight,
  behavior: "smooth"
});
```

It will attempt up to:

```javascript
const maxScrolls = 10;
```

consecutive scroll cycles without finding new job buttons.

You can adjust this value if necessary:

```javascript
const maxScrolls = 20;
```

A higher value may result in the script running for considerably longer.

---

## 10. Console Output

During execution, the script reports its activity.

### Starting

```text
🚀 Starting smart auto-apply...
```

### Opening a job

```text
🔍 [1] Opened job modal...
```

### Skipping an old job

```text
⏭️ Skipping - Job older than 1 week
```

### Filling application

```text
📝 Autofilled application
```

### Successful application

```text
✅ Applied successfully
```

### Scrolling

```text
📜 Scrolling to load more jobs...
```

---

## 11. Final Summary

When the script finishes, it prints a summary such as:

```text
🎉 All done! Smart auto-apply finished.

📌 Jobs Applied: 8
📌 Jobs Skipped (other reasons): 3
📌 Jobs Skipped (older than 1 week): 12
```

These counters are maintained only for the current browser-console session.

---

## 12. Stopping the Script

The safest way to stop the script is to reload the Wellfound page.

You can also close the tab.

If the script is currently waiting during a delay, reloading the page will terminate the current execution context.

---

## 13. Troubleshooting

### `Uncaught SyntaxError`

Make sure you copied the entire JavaScript file correctly.

Do not introduce line breaks inside quoted strings.

For example, this is invalid:

```javascript
console.log('color:
blue');
```

Use:

```javascript
console.log('color: blue');
```

---

### `Modal failed to load`

The Wellfound page may have changed or the page may still be loading.

Try:

1. Reloading Wellfound.
2. Opening the jobs page again.
3. Waiting for listings to load.
4. Running the script again.

---

### `Apply button not found`

The site's HTML selectors may have changed.

The script currently looks for:

```javascript
button[data-test="JobDescriptionSlideIn--SubmitButton"]
```

If Wellfound changes this selector, the script will need to be updated.

---

### `Dropdown not found`

The relocation form may have changed.

The script currently expects a selector associated with:

```text
qualification.location.locationId
```

Inspect the current Wellfound page with DevTools to determine whether the element structure has changed.

---

### Script stops unexpectedly

Check the browser Console for an error.

Common causes include:

* Changed Wellfound DOM structure.
* Network/loading delays.
* Login/session expiration.
* CAPTCHA or verification.
* Unexpected application questions.
* Changes to Wellfound's application flow.

---

## 14. Updating the Script

When Wellfound changes its interface, update the selectors in:

```text
src/wellfound-auto-apply.js
```

The most important selectors are:

```javascript
button[data-test="LearnMoreButton"]
```

```javascript
button[data-test="JobDescriptionSlideIn--SubmitButton"]
```

```javascript
button[data-test="closeButton"]
```

and:

```javascript
input[name="qualification.location.action"]
```

---

## 15. Recommended Workflow

For the safest workflow:

1. Open Wellfound.
2. Apply your desired job-search filters.
3. Review the listings.
4. Run the automation.
5. Monitor the Console.
6. Review applications and submitted information.
7. Stop the script if unexpected questions or behavior appear.

Do not leave the automation running unattended for extended periods.

---

## Disclaimer

This project is provided for educational and personal productivity purposes.

The author does not guarantee compatibility with Wellfound's current or future interface.

Websites can change their HTML, APIs, application flows, rate limits, anti-automation mechanisms, and terms of service at any time.

Users are responsible for complying with applicable laws, website terms, employer requirements, and platform policies.

---

## Author

**Aviral Pathak**

GitHub:
https://github.com/aviral-hub

LinkedIn:
https://www.linkedin.com/in/aviralpathak/

Portfolio:
https://aviralweb.vercel.app/
