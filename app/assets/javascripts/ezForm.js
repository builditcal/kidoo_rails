function ezForm(ezObj) {
  const { formName, fields, onSubmit } = ezObj;

  const form = document.querySelector(`form[name=${formName}]`);
  const formFields = document.querySelectorAll(`form[name=${formName}] [name]`);
  let submitInitialInnerHTML = form.querySelector(
    `button[type="submit"]`,
  ).innerHTML;

  function grabFieldConfig(fieldNode) {
    const fieldName = fieldNode.name;

    for (let i = 0; i < fields.length; i++) {
      const config = fields[i];
      if (config.name == fieldName) {
        if (config?.valueNameField) {
          return false;
        }
        return config;
      } else if (config.valueNameField == fieldName) {
        return config;
      }
    }
  }

  function resetSubmit() {
    const submit = form.querySelector('button[type="submit"]');
    console.log(submit);
    submit.disabled = false;
    submit.innerHTML = submitInitialInnerHTML;
  }

  function generateFieldObject(eventOrNode) {
    let fieldName = eventOrNode?.target?.name || eventOrNode.name;
    const fieldValue = eventOrNode?.target?.value || eventOrNode.value;
    const fieldNode = eventOrNode?.target || eventOrNode;
    const fieldConfig = grabFieldConfig(fieldNode);

    let response = { fieldName, fieldValue, fieldConfig, fieldNode };

    if (fieldConfig) {
      if (fieldConfig.valueNameField == fieldName) {
        response = { ...response, fieldName: fieldConfig.name };
      }

      if (fieldConfig?.formatValue) {
        response = {
          ...response,
          fieldValue: fieldConfig.formatValue(fieldValue, fieldNode),
        };
      }

      return response;
    }
    return null;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const submitButton = form.querySelector(`button[type="submit"]`);
    submitButton.disabled = true;
    submitButton.innerHTML = `
    <div class="d-flex flex-row justify-content-center gap-2 m-0 p-0 w-fit h-fit">
      <div class="rotating">
        <i class="bi bi-disc h-100 d-flex flex-column justify-content-center"></i>
      </div> Please wait...
    </div>`;

    const data = [];

    formFields.forEach((node) => {
      const fieldObj = generateFieldObject(node);

      if (fieldObj?.fieldConfig?.validator) {
        ezFormValidateField(
          formName,
          fieldObj.fieldName,
          fieldObj.fieldValue,
          fieldObj.fieldConfig.validator,
        );
      }

      if (fieldObj != null) {
        data.push(fieldObj);
      }
    });

    console.log(getAllErrors(formName).length);

    if (getAllErrors(formName).length == 0) {
      const dataObj = {};

      for (let i = 0; i < data.length; i++) {
        dataObj[data[i].fieldName] = data[i].fieldValue;
      }
      onSubmit(dataObj, resetSubmit);
    } else {
      submitButton.disabled = false;
      submitButton.innerHTML = submitInitialInnerHTML;
    }
  });

  form.addEventListener("keyup", (event) => {
    const fieldObj = generateFieldObject(event);
    if (fieldObj?.fieldConfig?.validator) {
      ezFormValidateField(
        formName,
        fieldObj.fieldName,
        fieldObj.fieldValue,
        fieldObj.fieldConfig.validator,
      );
    }
  });

  form.addEventListener("change", (event) => {
    const fieldObj = generateFieldObject(event);
    if (fieldObj?.fieldConfig?.validator) {
      ezFormValidateField(
        formName,
        fieldObj.fieldName,
        fieldObj.fieldValue,
        fieldObj.fieldConfig.validator,
      );
    }
  });
}

function ezFormValidateField(formName, fieldName, fieldValue, validateFn) {
  ezFormRemoveValidationError(formName, fieldName);
  function addErrorText(node, text) {
    const errorMessage = document.createElement("div");
    errorMessage.classList.add("invalid-feedback");
    errorMessage.id = `error_message_${node.name}`;
    errorMessage.innerText = text;

    node.closest("div").append(errorMessage);
  }
  const formItem = document.querySelector(
    `form[name=${formName}] [name=${fieldName}]`,
  );
  const validationResult = validateFn(fieldValue, formItem);
  if (validationResult !== undefined) {
    formItem.classList.add("is-invalid");
    addErrorText(formItem, validationResult);
  }
}

function getAllErrors(formName) {
  return document.querySelectorAll(
    `form[name=${formName}] [id^="error_message_"]`,
  );
}

function clearAllErrors(formName) {
  getAllErrors(formName).forEach((node) => {
    node.remove();
  });
}

function ezFormRemoveValidationError(formName, fieldName) {
  const formItem = document.querySelector(
    `form[name=${formName}] [name=${fieldName}]`,
  );
  formItem.classList.remove("is-invalid");
  formItem.classList.add("is-valid");
  document
    .querySelectorAll(`form[name=${formName}] [id=error_message_${fieldName}]`)
    .forEach((node) => node.remove());
}
