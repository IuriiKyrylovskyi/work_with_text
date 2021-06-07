const inputTextElem = document.querySelector(".form__area-text");
const fileElem = document.querySelector(".download__input");
const selectLangElem = document.querySelector(".form__select");
const calculteBtnElem = document.querySelector(".form__submit");
const priceElem = document.querySelector(".price__number");
const deadlineDateElem = document.querySelector(".dealine__date");

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
const END_WORK_TIME = 19;

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

  textLength = new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = () => {
      const text = reader.result;
      // console.log(text);

      documentLength = text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "").length;
      // console.log(documentLength);
      resolve(documentLength);
    };

    reader.onerror = reject;

    reader.readAsText(file);
  });
  // console.log(textLength);
  return { fileSize, fileLoadedDate, fileExtantion, textLength };
};

const getAmountOfSymbols = () => {
  const onInputFile = handleInputFile();

  const textareaTextLength = inputTextElem.value.length || 0;
  const fileTextLength = onInputFile === undefined ? 0 : onInputFile.fileSize;
  const fileItemsLength =
    onInputFile === undefined
      ? 0
      : onInputFile.textLength.then((result) => {
          console.log(result);
        });
  console.log("fileItems", fileItemsLength);
  // const fileTextLength = handleInputFile() === undefined ? 0 : handleInputFile().textLength;
  const commonLenght = textareaTextLength + fileTextLength;
  // console.log(textareaTextLength);
  // console.log(fileTextLength);
  // console.log(commonLenght);
  return commonLenght;
};

//------date-------
const getWorksHours = (lang, type) => {
  const editingItemsPerHour = lang === "en" ? EDITING_ITEMS_PER_HOUR_ENG : EDITING_ITEMS_PER_HOUR;
  const commonLenght = getAmountOfSymbols();
  const workHours = type !== 0 ? commonLenght / editingItemsPerHour + PREP_TIME : (commonLenght / editingItemsPerHour) * EXTRA + PREP_TIME;
  console.log(workHours);
  return workHours < MIN_EDIT_HOUR ? MIN_EDIT_HOUR : workHours;
};
//===============
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
  console.log(fileType);
  // const fileTypeDate = handleInputFile() !== undefined ? NORMAL_PRICE_FILE_FORMATS.filter((type) => type === handleInputFile().textLength).length : 0;

  const price = getPriceForItem(commonLenght, fileType, pricePerItem, minPrice);
  // const priceDate = getPriceForItem(commonLenght, fileType, pricePerItem, minPrice);

  priceElem.textContent = parseInt(Math.ceil(price));
  // priceElem.textContent = parseInt(Math.ceil(fileTypeDate));
  // ------------------------------------------------------
  const workHours = getWorksHours(lang, fileType);
  // const workHours = fileType !== 0 ? getWorksHours() : getWorksHours() * EXTRA;

  const hours = parseInt(moment().format("HH"));
  console.log(hours);

  const hoursFromToday = hours < END_WORK_TIME - 1 ? hours : parseInt(moment().set("hour", 00));
  console.log("hoursFromToday", hoursFromToday);

  const todayWorkHoursStart = hoursFromToday > START_WORK_TIME ? hoursFromToday : START_WORK_TIME;
  console.log("todayWorkHoursStart", todayWorkHoursStart);

  const todayMaxWorkHours = END_WORK_TIME - todayWorkHoursStart;
  console.log(todayMaxWorkHours);

  if (todayMaxWorkHours >= workHours) {
    const endHour = Math.ceil(todayWorkHoursStart + workHours);
    //} || (todayMaxWorkHours >= workHours * EXTRA && fileType)) {
    const endWorkTime = moment().set("hour", endHour).format("MMMM DD YYYY o HH:mm");

    deadlineDateElem.textContent = endWorkTime;
    return;
  }

  // if (todayMaxWorkHours >= workHours * EXTRA && !fileType) {
  //   const endHour = Math.ceil(todayWorkHoursStart + workHours * EXTRA);
  //   endWorkTime = moment().set("hour", endHour).format("MMMM DD YYYY o HH:mm");

  //   deadlineDateElem.textContent = endWorkTime;
  //   return;
  // }

  const todayWorkHours = END_WORK_TIME - todayWorkHoursStart;
  console.log("todayWorkHours", todayWorkHours);

  const leftWorkHours = workHours - todayWorkHours;
  console.log("leftWorkHours", leftWorkHours);

  const getAmountOfWorkDays = leftWorkHours >= WORK_HOURS_DURATION ? leftWorkHours / WORK_HOURS_DURATION : 1;
  console.log("getAmountOfWorkDays", getAmountOfWorkDays);

  const getAmountOfWorkWeeks = getAmountOfWorkDays >= WORK_DAYS_PER_WEEK ? getAmountOfWorkDays / WORK_DAYS_PER_WEEK : 0;
  console.log("WorkWeeks", getAmountOfWorkWeeks);

  const getAmountOfLeftWorkDays = getAmountOfWorkDays > WORK_DAYS_PER_WEEK ? getAmountOfWorkDays % WORK_DAYS_PER_WEEK : getAmountOfWorkDays;
  console.log("LeftWorkDays", getAmountOfLeftWorkDays);

  const getAmountOfLeftHours = Math.ceil((getAmountOfLeftWorkDays - parseInt(getAmountOfLeftWorkDays)) * 100);
  console.log("LeftWorkHours", getAmountOfLeftHours);

  const endWorkHours = getAmountOfLeftHours + START_WORK_TIME;

  const editingDate = moment()
    .add({
      days: getAmountOfLeftWorkDays,
      weeks: getAmountOfWorkWeeks,
    })
    .set("hour", endWorkHours)
    .format("MMMM DD YYYY o HH:mm");

  console.log(editingDate);
  //===================
  // const getAmountOfLeftWorkHours = (workHours % HOURS_PER_DAY) + START_WORK_TIME;
  // console.log("LeftWorkHours", getAmountOfLeftWorkHours);

  const todayDay = moment().format("dd");
  console.log("todayDay", todayDay);

  // const addWeeks = moment.duration(getAmountOfWorkWeeks, "weeks");
  // const addDays = moment.duration(getAmountOfLeftWorkDays, "days");

  deadlineDateElem.textContent = editingDate;
};

calculteBtnElem.addEventListener("click", handleCalcBtnClick);

// console.log(moment().format("MMMM DD YYYY, HH:mm"));
// console.log(moment().format("MMMM DD YYYY"));
