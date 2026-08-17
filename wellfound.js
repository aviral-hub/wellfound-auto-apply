(async () => {
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const waitForElement = async (selector, timeout = 5000) => {
    const start = Date.now();

    while (Date.now() - start < timeout) {
      const el = document.querySelector(selector);
      if (el) return el;

      await delay(100);
    }

    return null;
  };

  // ============================================================
  // CHECK WHETHER JOB WAS POSTED WITHIN THE LAST 7 DAYS
  // ============================================================

  const isJobRecent = (modal) => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    // Check datetime attributes
    const timeElements = modal.querySelectorAll(
      'time[datetime], [data-test*="time"], [data-test*="date"]'
    );

    for (const el of timeElements) {
      const dateTime = el.getAttribute("datetime");

      if (dateTime) {
        const jobDate = new Date(dateTime).getTime();

        if (!Number.isNaN(jobDate) && jobDate < oneWeekAgo) {
          return false;
        }
      }
    }

    // Check visible text
    const textContent = modal.textContent.toLowerCase();

    // Examples:
    // "2 weeks ago"
    // "3 weeks"
    // "10 days ago"
    // "10d ago"
    // "2w ago"

    const weekMatch = textContent.match(
      /(\d+)\s*(?:week|weeks|w)\b/
    );

    const dayMatch = textContent.match(
      /(\d+)\s*(?:day|days|d)\b/
    );

    if (weekMatch && parseInt(weekMatch[1], 10) >= 1) {
      return false;
    }

    if (dayMatch && parseInt(dayMatch[1], 10) > 7) {
      return false;
    }

    return true;
  };

  // ============================================================
  // APPLICATION MESSAGE
  // ============================================================

  const applicationText = `Hey there,

I’m Aviral Pathak, an Information Technology undergraduate with experience in B2B sales, data analysis, stakeholder coordination, leadership, and business-focused problem solving.

Recently, I built a data analysis system capable of processing 1M+ rows and identifying key data quality issues. I have also led teams of 50+ members and executed data-driven campaigns that improved engagement by 35%.

GitHub:
https://github.com/aviral-hub/datavtool

LinkedIn:
https://www.linkedin.com/in/aviralpathak/

Portfolio:
https://aviralweb.vercel.app/`;

  // ============================================================
  // COUNTERS
  // ============================================================

  let appliedCount = 0;
  let skippedCount = 0;
  let oldJobSkippedCount = 0;
  let scrollCount = 0;

  const processedButtons = new Set();

  console.log(
    "%c🚀 Starting smart auto-apply on Wellfound (1 week filter)...",
    "color: green; font-weight: bold;"
  );

  // ============================================================
  // HANDLE RELOCATION QUESTION
  // ============================================================

  const handleRelocationQuestion = async () => {
    try {
      const firstRadio = document.querySelector(
        'input[name="qualification.location.action"]'
      );

      if (firstRadio) {
        firstRadio.click();

        console.log(
          "%c📍 Selected relocation option",
          "color: orange"
        );
      }

      /*
       * The ID contains literal dots, therefore they need to be
       * escaped in a CSS selector.
       */

      const dropdownContainer = document.querySelector(
        "#form-input--qualification\\.location\\.locationId .select__control"
      );

      if (dropdownContainer) {
        dropdownContainer.click();

        console.log(
          "%c🔽 Opened location dropdown",
          "color: orange"
        );

        await delay(500);

        const firstOption = document.querySelector(
          ".select__menu-list div"
        );

        if (firstOption) {
          firstOption.click();

          console.log(
            "%c🌍 Selected first location in dropdown",
            "color: orange"
          );
        }

        await delay(2000);

        return true;
      }

      console.log(
        "%c⚠️ Dropdown not found",
        "color: gray"
      );
    } catch (err) {
      console.log(
        "%c❌ Error while handling relocation question",
        "color: red",
        err
      );
    }

    return false;
  };

  // ============================================================
  // HANDLE CUSTOM QUESTIONS
  // ============================================================

  const handleCustomQuestions = () => {
    const allGroups = document.querySelectorAll(
      '[data-test^="RadioGroup-customQuestionAnswers"]'
    );

    allGroups.forEach((group) => {
      const options = group.querySelectorAll(
        'input[type="radio"]'
      );

      if (options.length === 3) {
        // Original behavior: select second option
        options[1].click();

        console.log(
          "%c🎯 Selected second option for 3-option question",
          "color: dodgerblue"
        );
      } else if (options.length === 2) {
        // Original behavior: select first option
        options[0].click();

        console.log(
          "%c🎯 Selected first option for 2-option question",
          "color: dodgerblue"
        );
      } else {
        console.log(
          `%c⚠️ Unexpected number of options: ${options.length}`,
          "color: gray"
        );
      }
    });
  };

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  const closeModal = async () => {
    const closeBtn = await waitForElement(
      'button[data-test="closeButton"]',
      3000
    );

    if (closeBtn) {
      closeBtn.click();

      console.log(
        "%c❎ Modal closed",
        "color: crimson"
      );

      await delay(700);
    }
  };

  // ============================================================
  // PROCESS CURRENT BATCH
  // ============================================================

  const processBatch = async () => {
    let buttons = [
      ...document.querySelectorAll(
        'button[data-test="LearnMoreButton"]'
      )
    ];

    buttons = buttons.filter(
      (btn) => !processedButtons.has(btn)
    );

    if (buttons.length === 0) {
      return false;
    }

    for (const learnMoreBtn of buttons) {
      processedButtons.add(learnMoreBtn);

      try {
        learnMoreBtn.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

        await delay(500);

        learnMoreBtn.click();

        console.log(
          `%c🔍 [${
            appliedCount +
            skippedCount +
            oldJobSkippedCount +
            1
          }] Opened job modal...`,
          "color: blue"
        );

        // --------------------------------------------------------
        // WAIT FOR APPLY BUTTON
        // --------------------------------------------------------

        const applyBtn = await waitForElement(
          'button[data-test="JobDescriptionSlideIn--SubmitButton"]',
          5000
        );

        if (!applyBtn) {
          console.log(
            "%c❌ Modal failed to load",
            "color: red"
          );

          skippedCount++;

          await closeModal();

          continue;
        }

        // --------------------------------------------------------
        // GET MODAL
        // --------------------------------------------------------

        const modal =
          document.querySelector(
            '[data-test*="JobDescriptionSlideIn"]'
          ) ||
          document.querySelector(
            '[role="dialog"]'
          );

        // --------------------------------------------------------
        // CHECK JOB AGE
        // --------------------------------------------------------

        if (modal && !isJobRecent(modal)) {
          console.log(
            "%c⏭️ Skipping - Job older than 1 week",
            "color: gray"
          );

          oldJobSkippedCount++;

          await closeModal();

          continue;
        }

        // --------------------------------------------------------
        // HANDLE DISABLED APPLY BUTTON
        // --------------------------------------------------------

        if (applyBtn.disabled) {
          console.log(
            "%c⚠️ Apply button disabled. Checking questionnaire...",
            "color: orange"
          );

          const isFormFilled =
            await handleRelocationQuestion();

          if (isFormFilled) {
            console.log(
              "%c✅ Relocation questionnaire filled",
              "color: green"
            );
          } else {
            console.log(
              "%c⏭️ Apply button is disabled — skipping",
              "color: gray"
            );
          }

          skippedCount++;

          await closeModal();

          continue;
        }

        // --------------------------------------------------------
        // HANDLE CUSTOM QUESTIONS
        // --------------------------------------------------------

        handleCustomQuestions();

        await delay(500);

        // --------------------------------------------------------
        // FILL COVER LETTER / MESSAGE
        // --------------------------------------------------------

        const textarea =
          document.querySelector(
            'textarea:not([disabled])'
          );

        if (textarea) {
          /*
           * Use the native setter so React-controlled
           * textareas detect the change more reliably.
           */

          const setter =
            Object.getOwnPropertyDescriptor(
              HTMLTextAreaElement.prototype,
              "value"
            )?.set;

          if (setter) {
            setter.call(textarea, applicationText);
          } else {
            textarea.value = applicationText;
          }

          textarea.dispatchEvent(
            new Event("input", {
              bubbles: true
            })
          );

          textarea.dispatchEvent(
            new Event("change", {
              bubbles: true
            })
          );

          console.log(
            "%c📝 Autofilled application",
            "color: purple"
          );
        }

        // --------------------------------------------------------
        // WAIT BEFORE SUBMIT
        // --------------------------------------------------------

        await delay(1000);

        // Re-check button
        const currentApplyBtn =
          document.querySelector(
            'button[data-test="JobDescriptionSlideIn--SubmitButton"]'
          );

        if (!currentApplyBtn) {
          console.log(
            "%c❌ Apply button disappeared",
            "color: red"
          );

          skippedCount++;

          await closeModal();

          continue;
        }

        if (currentApplyBtn.disabled) {
          console.log(
            "%c⏭️ Apply button still disabled — skipping",
            "color: gray"
          );

          skippedCount++;

          await closeModal();

          continue;
        }

        // --------------------------------------------------------
        // SUBMIT APPLICATION
        // --------------------------------------------------------

        currentApplyBtn.click();

        console.log(
          "%c🚀 Application submitted...",
          "color: teal; font-weight: bold;"
        );

        await delay(3000);

        appliedCount++;

        console.log(
          "%c✅ Applied successfully",
          "color: teal; font-weight: bold;"
        );

        // --------------------------------------------------------
        // CLOSE MODAL
        // --------------------------------------------------------

        await closeModal();

        await delay(1000);

      } catch (err) {
        console.log(
          "%c❌ Error processing job:",
          "color: red; font-weight: bold;",
          err
        );

        skippedCount++;

        await closeModal();
      }
    }

    return true;
  };

  // ============================================================
  // MAIN SCROLL LOOP
  // ============================================================

  const maxScrolls = 10;

  while (scrollCount < maxScrolls) {
    const found = await processBatch();

    if (!found) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      });

      console.log(
        "%c📜 Scrolling to load more jobs...",
        "color: darkcyan"
      );

      scrollCount++;

      await delay(2000);
    } else {
      // New jobs were found, so continue processing.
      scrollCount = 0;
    }
  }

  // ============================================================
  // FINAL SUMMARY
  // ============================================================

  console.log(
    "%c🎉 All done! Smart auto-apply finished.",
    "color: limegreen; font-size: 16px; font-weight: bold;"
  );

  console.log(
    `%c📌 Jobs Applied: ${appliedCount}`,
    "color: #4CAF50; font-weight: bold;"
  );

  console.log(
    `%c📌 Jobs Skipped (other reasons): ${skippedCount}`,
    "color: #FF9800; font-weight: bold;"
  );

  console.log(
    `%c📌 Jobs Skipped (older than 1 week): ${oldJobSkippedCount}`,
    "color: #FF5722; font-weight: bold;"
  );
})();
