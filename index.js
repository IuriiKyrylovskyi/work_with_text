const inputTextElem = document.querySelector(".form__area-text");
const fileElem = document.querySelector(".download__input");
const selectLangElem = document.querySelector(".form__select");
const calculteBtnElem = document.querySelector(".form__submit");
const priceElem = document.querySelector(".price__number");
const deadlineDateElem = document.querySelector(".dealine__date");
const deadlineTimeElem = document.querySelector(".dealine__time");

const NORMAL_PRICE_FILE_FORMATS = ["doc", "docx", "rtf"];
const PRICE_PER_ITEM = 0.05;
const PRICE_PER_ENG_ITEM = 0.12; //  if selectedLang = selectElem.value === en
const MIN_NORM_PRICE = 50;
const MIN_ENG_PRICE = 120;

const EDITING_ITEMS_PER_HOUR = 1333;
const EDITING_ITEMS_PER_HOUR_ENG = 333;
const MIN_EDIT_HOUR = 1;
const PREP_TIME = 0.5;

const WORK_HOURS_DURATION = 9;
const WORK_DAYS_PER_WEEK = 5;
const HOURS_PER_WEEK = 168;
const HOURS_PER_DAY = 24;
const START_WORK_TIME = 10;

const EXTRA = 1.2;

//--------price----
const handleInputFile = () => {
  const file = fileElem.files[0];

  if (!file) return;
  let textLength;

  const fileName = file.name;
  const fileLoadedDate = file.lastModifiedDate;
  const fileSize = file.size;

  const fileExtantion = fileName.substr(fileName.lastIndexOf(".") + 1);
  // console.log(fileExtantion);

  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = () => {
    const text = reader.result;
    // console.log(text);

    textLength = text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "").length;
    console.log(textLength);
  };
  console.log("2", textLength);

  reader.onerror = () => {
    console.log(reader.error);
  };

  return { fileSize, fileLoadedDate, fileExtantion, textLength };
};

// inputTextElem.addEventListener("change", handleInputFile);

const getAmountOfSymbols = () => {
  const textareaTextLength = inputTextElem.value.length || 0;
  const fileTextLength = handleInputFile() === undefined ? 0 : handleInputFile().fileSize;
  // const fileTextLength = handleInputFile() === undefined ? 0 : handleInputFile().textLength;
  const commonLenght = textareaTextLength + fileTextLength;
  // console.log(textareaTextLength);
  // console.log(fileTextLength);
  // console.log(commonLenght);
  return commonLenght;
};

//------date-------
const getWorksHours = (lang) => {
  const editingItemsPerHour = lang === "en" ? EDITING_ITEMS_PER_HOUR_ENG : EDITING_ITEMS_PER_HOUR;
  const commonLenght = getAmountOfSymbols();
  const workHours = commonLenght / editingItemsPerHour + PREP_TIME;
  console.log(workHours);
  return workHours < MIN_EDIT_HOUR ? MIN_EDIT_HOUR : workHours;
};

//---------

const getPriceForItem = (length, isFileType, pricePerItem, minPrice) => {
  const price = !isFileType ? pricePerItem * length * EXTRA : pricePerItem * length;
  return price > minPrice ? price : minPrice;
};

const handleCalcBtnClick = (e) => {
  e.preventDefault();

  const commonLenght = getAmountOfSymbols();

  const lang = selectLangElem.value;
  const minPrice = lang === "en" ? MIN_ENG_PRICE : MIN_NORM_PRICE;
  const pricePerItem = lang === "en" ? PRICE_PER_ENG_ITEM : PRICE_PER_ITEM;

  const fileType = handleInputFile() !== undefined ? NORMAL_PRICE_FILE_FORMATS.filter((type) => type === handleInputFile().fileExtantion).length : 0;
  // console.log(fileType);
  // const fileTypeDate = handleInputFile() !== undefined ? NORMAL_PRICE_FILE_FORMATS.filter((type) => type === handleInputFile().textLength).length : 0;

  const price = getPriceForItem(commonLenght, fileType, pricePerItem, minPrice);
  // const priceDate = getPriceForItem(commonLenght, fileType, pricePerItem, minPrice);

  priceElem.textContent = parseInt(Math.ceil(price));
  // priceElem.textContent = parseInt(Math.ceil(fileTypeDate));

  // ------------------------------------------------------
  const hoursLeftToday = 19 - moment().format("HH");
  const todayWorkHours = hoursLeftToday > 0 ? hoursLeftToday - 1 : 0;
  console.log("todayWorkHours", todayWorkHours);

  const todayDay = moment().format("dd");
  console.log(todayDay);

  const getAmountOfWorkDays = getWorksHours() >= WORK_HOURS_DURATION ? getWorksHours() / WORK_HOURS_DURATION : 1;
  console.log(getAmountOfWorkDays);

  const getAmountOfWorkWeeks = getAmountOfWorkDays >= WORK_DAYS_PER_WEEK ? getAmountOfWorkDays / WORK_DAYS_PER_WEEK : 0;
  console.log(getAmountOfWorkWeeks);

  const getAmountOfLeftWorkDays = getAmountOfWorkDays > WORK_DAYS_PER_WEEK ? getAmountOfWorkDays % WORK_DAYS_PER_WEEK : getAmountOfWorkDays;
  console.log(getAmountOfLeftWorkDays);

  const getAmountOfLeftWorkHours = (getAmountOfLeftWorkDays - parseInt(getAmountOfLeftWorkDays)) * HOURS_PER_DAY - todayWorkHours + START_WORK_TIME;
  console.log(getAmountOfLeftWorkHours);

  const editingDate = moment()
    .add({
      hours: 00,
      days: getAmountOfLeftWorkDays,
      weeks: getAmountOfWorkWeeks,
    })
    .format("MMMM DD YYYY, HH:mm");

  console.log(editingDate);

  const editingTime = moment(new Date(editingDate)).set("hour", 00).hours(getAmountOfLeftWorkHours).format("MMMM DD YYYY, HH:mm");
  console.log(editingTime);
  // const addWeeks = moment.duration(getAmountOfWorkWeeks, "weeks");
  // const addDays = moment.duration(getAmountOfLeftWorkDays, "days");

  deadlineDateElem.textContent = new Date();
  deadlineTimeElem.textContent = !fileType ? Math.ceil(getWorksHours(lang)) : Math.ceil(getWorksHours(lang) * EXTRA);
};
//
calculteBtnElem.addEventListener("click", handleCalcBtnClick);

console.log(moment().format("MMMM DD YYYY, HH:mm"));
console.log(moment().format("MMMM DD YYYY"));
