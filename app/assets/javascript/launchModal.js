function launchModal(modalOptionsObj) {
  let { title, body, options, closeText, allowClose, theme } = modalOptionsObj;
  options = options || [];
  allowClose = allowClose === undefined ? true : allowClose;
  closeText = closeText || "Close";

  let modalHTML = `
<div class="modal fade blur-background" id="js-modal" data-bs-backdrop="static" tabindex="-1" aria-labelledby="js-modal-label" aria-hidden="true" id="js-modal">
  <div class="modal-dialog modal-dialog-centered">
    <div id="js-modal-content" class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="js-modal-label">Modal title</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="js-modal-x-button"></button>
      </div>
      <div class="modal-body" id="js-modal-body">
      </div>
      <div class="modal-footer" id="js-modal-options">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="js-modal-close-button">Close</button>
      </div>
    </div>
  </div>
</div>`;

  if (!document.querySelector('body div[id="js-modal"]')) {
    const modal = document.createElement("div");
    modal.innerHTML = modalHTML;
    document.querySelector("body").appendChild(modal);
  }

  const modalNode = document.querySelector('div[id="js-modal"]');
  const modalContent = document.querySelector('div[id="js-modal-content"]');
  const modalTitleNode = document.querySelector('h1[id="js-modal-label"]');
  const modalBodyNode = document.querySelector('div[id="js-modal-body"]');
  const modalOptionsNode = document.querySelector('div[id="js-modal-options"]');
  const modalXButtonNode = document.querySelector(
    'button[id="js-modal-x-button"]',
  );
  const modalCloseButtonNode = document.querySelector(
    'button[id="js-modal-close-button"]',
  );

  if (theme) {
    modalTitleNode.classList.add(`text-${theme}`);
    modalContent.classList.add(`border-${theme}`);
  } else {
    modalTitleNode.classList.forEach((value, _) => {
      if (value.includes("text-")) {
        modalTitleNode.classList.remove(value);
      }
    });
    modalContent.classList.forEach((value, _) => {
      if (value.includes("border-")) {
        modalContent.classList.remove(value);
      }
    });
  }

  const bsModal = new bootstrap.Modal(modalNode);

  bsModal.hide();
  modalCleanup();

  modalTitleNode.innerHTML = title;
  modalBodyNode.innerHTML = body;
  document
    .querySelectorAll('button[id="js-modal-option"]')
    .forEach((button) => {
      button.remove();
    });

  const footerOptions = options.map((buttonObj) => {
    const newButton = document.createElement("button");
    newButton.type = "button";
    newButton.onclick = buttonObj.fn;
    newButton.classList.add("btn", `btn-${buttonObj.colour}`);
    newButton.id = "js-modal-option";
    newButton.innerText = buttonObj.text;
    return newButton;
  });

  footerOptions.forEach((button) => {
    const fn = button.onclick;
    button.onclick = () => {
      fn(bsModal);
    };

    modalOptionsNode.prepend(button);
  });

  if (!allowClose) {
    modalXButtonNode.setAttribute("hidden", true);
    modalCloseButtonNode.setAttribute("hidden", true);
  } else {
    modalXButtonNode.removeAttribute("hidden");
    modalCloseButtonNode.removeAttribute("hidden");
  }

  bsModal.show();
  modalNode.focus();
}

function modalCleanup() {
  const body = document.querySelector("body");
  body.classList.remove("modal-open");
  body.removeAttribute("style");

  document
    .querySelectorAll('div[class="modal-backdrop fade show"]')
    .forEach((node) => {
      node.remove();
    });
}
