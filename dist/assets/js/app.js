// modal
const modal = {
  el: document.querySelector(".modal"),
  blocks: document.querySelectorAll(".modal__content"),
  active: null,
  open: function (name, data, animation = true) {
    const target = this.el.querySelector(`[data-root=${name}]`);
    const title = target.querySelector("[data-title]");

    this.active = name;

    if (title && data) {
      title.innerText = data;
    }

    this.el.classList.add("active");
    this.el.style.display = "flex";
    target.style.display = "flex";

    if (animation) {
      setTimeout(() => {
        target.style.opacity = 1;
        target.style.transform = "scale(1) translateY(0)";
      }, 50);
    } else {
      target.style.opacity = 1;
      target.style.transform = "scale(1) translateY(0)";
    }
  },
  close: function (name, parent = true) {
    if (!name) {
      this.blocks.forEach((block) => {
        block.style.opacity = 0;
        block.style.transform = "scale(0.85) translateY(20%)";

        setTimeout(() => {
          block.style.display = "none";
        }, 350);
      });
    } else {
      const target = this.el.querySelector(`[data-root=${name}]`);
      target.style.opacity = 0;
      target.style.transform = "scale(0.85) translateY(20%)";

      if (!parent) {
        target.style.display = "none";
      } else {
        setTimeout(() => {
          target.style.display = "none";
        }, 350);
      }
    }

    if (parent) {
      setTimeout(() => {
        this.el.classList.remove("active");
        this.el.style.display = "none";
      }, 350);
    }
  },
};

const modalTriggers = document.querySelectorAll("[data-modal]");
modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const name = trigger.dataset.modal;

    if (name !== "close") {
      if (modal.el.classList.contains("active")) {
        modal.close(modal.active, false);
        modal.open(name, null, false);
      } else {
        modal.open(name);
      }
    } else {
      modal.close(null, true);
    }
  });
});

// header
const header = document.querySelector(".header");
if (header) {
  const burger = header.querySelector(".header__burger");
  const menu = header.querySelector(".header__menu");
  const close = header.querySelector(".header__menu-close");
  const overlay = header.querySelector(".header__menu-overlay");
  const links = header.querySelectorAll(".header__menu ul li a");

  const toggleMenu = () => {
    burger.classList.toggle("active");
    menu.classList.toggle("active");
  };

  burger.addEventListener("click", () => toggleMenu());
  close.addEventListener("click", () => toggleMenu());
  overlay.addEventListener("click", () => toggleMenu());
  links.forEach((link) => {
    link.addEventListener("click", () => toggleMenu());
  });

  window.addEventListener("scroll", function () {
    header.classList.toggle("sticky", window.scrollY > 0);
  });
}

// ** Accordions ** //
const getAccordionParents = document.querySelectorAll("[data-accordion");
getAccordionParents.forEach((parent) => {
  const isMultiple = parent.dataset.multiple;
  const accordions = parent.querySelectorAll(".accordion");
  accordions.forEach((accordion) => {
    const header = accordion.querySelector(".accordion__header");
    const body = accordion.querySelector(".accordion__body");
    const content = accordion.querySelector(".accordion__content");

    header.addEventListener("click", () => {
      const isActive = accordion.classList.contains("active");
      if (!isActive) {
        accordion.classList.add("active");
        body.style.maxHeight = content.scrollHeight + "px";
      } else {
        accordion.classList.remove("active");
        body.style.maxHeight = 0;
      }

      if (!isMultiple || isMultiple == "false") {
        accordions.forEach((el) => {
          if (el !== accordion) {
            el.classList.remove("active");
            el.querySelector(".accordion__body").style.maxHeight = 0;
          }
        });
      }
    });
  });
});

function successSend(alertSuccess, form) {
  if (alertSuccess) {
    alertSuccess.style.display = "flex";
  } else {
    modal.open("success");
  }

  setTimeout(() => {
    modal.close();
    setTimeout(() => {
      if (alertSuccess) {
        alertSuccess.style.display = "none";
      }
      form.reset();
    }, 350);
  }, 3000);
}

const forms = document.querySelectorAll("form");
forms.forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent form submission

    const requiredFields = form.querySelectorAll("[data-validate]");
    const alertBox = form.querySelector(".form-group-alert");
    const alertSuccess = form.querySelector(".form-group-success");
    let hasError = false;

    requiredFields.forEach((field) => {
      const { dataset } = field;
      const { validate, required } = dataset;
      const isRequired = required === "true";
      let value = field.value;

      const validation = validateField(validate, value, isRequired, field);
      const errorElement =
        field.parentElement.parentElement.querySelector(".form-group-msg");

      if (validation.status === 400) {
        errorElement.textContent = validation.msg;
        errorElement.style.display = "block";
        field.classList.add("error");
        hasError = true;
        if (alertBox) {
          alertBox.textContent = validation.msg;
          alertBox.style.display = "block";
        }
      } else {
        errorElement.style.display = "none";
        field.classList.remove("error");
        if (!hasError && alertBox) {
          alertBox.textContent = "";
          alertBox.style.display = "none";
        }
      }
    });

    if (!hasError) {
      successSend(alertSuccess, form);
    }
  });

  const validateField = (type, value, required, field) => {
    if (required && !value) {
      return {
        status: 400,
        msg: "Пожалуйста, заполните все обязательные поля",
      };
    }

    if (type === "name") {
      const namePattern = /^[A-Za-zА-Яа-яёЁ\s]+$/; // Name can include letters and spaces only
      if (!namePattern.test(value)) {
        return {
          status: 400,
          msg: "Укажите, пожалуйста, имя",
        };
      }
    } else if (type === "phone") {
      if (value.length < 9) {
        return {
          status: 400,
          msg: "Номер телефона должен содержать не более 9 цифр",
        };
      }
    }

    return { status: 200, msg: "" };
  };
});

// Initialize the fancybox
const fancyboxTriggers = Array.from(
  document.querySelectorAll("[data-fancybox]")
).filter((trigger) => trigger.dataset.fancybox);
if (fancyboxTriggers) {
  const fancyboxInstances = [];
  fancyboxTriggers.forEach((trigger) => {
    const name = trigger.dataset.fancybox;
    if (fancyboxInstances.includes(name)) {
      return; // Skip if already bound
    }
    // Add the name to the `fancyboxInstances` list
    fancyboxInstances.push(name);
  });
  fancyboxInstances.forEach((name) => {
    Fancybox.bind(`[data-fancybox="${name}"]`, {
      Images: { Panzoom: { maxScale: 3 } },
    });
  });
}

// brands swiper
let swiperBrands = new Swiper(".brands .swiper", {
  slidesPerView: "auto",
  spaceBetween: 15,
  loop: true,
  autoplay: {
    delay: 5000,
  },
  navigation: {
    nextEl: ".brands .btn-next",
    prevEl: ".brands .btn-prev",
  },
  breakpoints: {
    641: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1025: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  },
});

// projects swiper
let swiperProjects = new Swiper(".projects .swiper", {
  slidesPerView: "auto",
  spaceBetween: 15,
  loop: true,
  autoplay: {
    delay: 5000,
  },
  navigation: {
    nextEl: ".projects .btn-next",
    prevEl: ".projects .btn-prev",
  },
  breakpoints: {
    641: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1025: {
      slidesPerView: 3,
      spaceBetween: 40,
    },
    1680: {
      slidesPerView: 3,
      spaceBetween: 50,
    },
  },
});

// team swiper
if (window.innerWidth <= 768) {
  let teamSwiper = new Swiper(".team .swiper", {
    slidesPerView: "auto",
    spaceBetween: 15,
    loop: true,
    autoplay: {
      delay: 5000,
    },
  });
}
