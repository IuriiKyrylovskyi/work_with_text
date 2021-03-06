const inputTextElem = document.querySelector(".form__area-text");
const fileElem = document.querySelector(".download__input");
const selectLangElem = document.querySelector(".form__select");
const calculteBtnElem = document.querySelector(".form__submit");
const priceElem = document.querySelector(".price__number");
const deadlineDateElem = document.querySelector(".dealine__date");

const SARTUDAY = "Sartuday";
const SUNDAY = "Sunday";
const DAYS_OFF = ["Sartuday", "Sunday"];
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

//--------file info----
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

//------hours-------
const getWorksHours = (lang, type) => {
  const editingItemsPerHour = lang === "en" ? EDITING_ITEMS_PER_HOUR_ENG : EDITING_ITEMS_PER_HOUR;
  const commonLenght = getAmountOfSymbols();
  const workHours = type !== 0 ? commonLenght / editingItemsPerHour + PREP_TIME : (commonLenght / editingItemsPerHour) * EXTRA + PREP_TIME;
  console.log(workHours);
  return workHours < MIN_EDIT_HOUR ? MIN_EDIT_HOUR : workHours;
};
//-------item price----

const getPriceForItem = (length, isFileType, pricePerItem, minPrice) => {
  const price = !isFileType ? pricePerItem * length * EXTRA : pricePerItem * length;
  return price > minPrice ? price : minPrice;
};

//--------if day-off go to monday------
const includeDayOff = (edgeWorkDay, givenDay) => {
  if (givenDay === SARTUDAY) {
    edgeWorkDay = moment(edgeWorkDay, "MMMM DD YYYY, HH:mm")
      .add({
        days: 2,
      })
      .format("MMMM DD YYYY, HH:mm");
    console.log("sunday");
  }

  if (givenDay === SUNDAY) {
    edgeWorkDay = moment(edgeWorkDay, "MMMM DD YYYY, HH:mm")
      .add({
        days: 1,
      })
      .format("MMMM DD YYYY, HH:mm");
  }

  console.log("edgeWorkDay", edgeWorkDay);
  return edgeWorkDay;
};

//---------main-----
const handleCalcBtnClick = (e) => {
  e.preventDefault();

  const commonLenght = getAmountOfSymbols();

  const lang = selectLangElem.value;
  const minPrice = lang === "en" ? MIN_ENG_PRICE : MIN_NORM_PRICE;
  const pricePerItem = lang === "en" ? PRICE_PER_ENG_ITEM : PRICE_PER_ITEM;

  const fileType = handleInputFile() !== undefined ? NORMAL_PRICE_FILE_FORMATS.filter((type) => type === handleInputFile().fileExtantion).length : 0;
  console.log(fileType);

  const price = getPriceForItem(commonLenght, fileType, pricePerItem, minPrice);

  priceElem.textContent = parseInt(Math.ceil(price));

  const todayDay = moment().format("dddd");
  console.log("todayDay", todayDay);

  let startWorkDay = new Date();

  const startDate = includeDayOff(startWorkDay, todayDay);
  
  const workHours = getWorksHours(lang, fileType);
  const maxWorkHours = Math.ceil(workHours);

  const hours = parseInt(moment(startDate, "MMMM DD YYYY").format("HH"));
  // const hours = parseInt(moment(startWorkDay, "MMMM DD YYYY").format("HH"));
  console.log(hours);

  const hoursFromToday = hours < END_WORK_TIME - 1 ? hours : parseInt(moment(startDate, "MMMM DD YYYY, HH:mm").set("hour", 00));
  // const hoursFromToday = hours < END_WORK_TIME - 1 ? hours : parseInt(moment(startWorkDay, "MMMM DD YYYY, HH:mm").set("hour", 00));
  console.log("hoursFromToday", hoursFromToday);

  const todayWorkHoursStart = hoursFromToday > START_WORK_TIME ? hoursFromToday : START_WORK_TIME;
  console.log("todayWorkHoursStart", todayWorkHoursStart);

  const todayMaxWorkHours = END_WORK_TIME - todayWorkHoursStart;
  console.log("todayMaxWorkHours", todayMaxWorkHours);

  if (todayMaxWorkHours > maxWorkHours) {
    const endHour = Math.ceil(todayWorkHoursStart + workHours);
    const endWorkTime = moment().set("hour", endHour).format("MMMM DD YYYY o HH:mm");
    console.log("short endWorkTime", endWorkTime);

    deadlineDateElem.textContent = endWorkTime;
    return;
  }

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

  const getAmountOfLeftHours = Math.ceil((getAmountOfLeftWorkDays - parseInt(getAmountOfLeftWorkDays)) * WORK_HOURS_DURATION);
  console.log("LeftWorkHours", getAmountOfLeftHours);

  const endWorkHours = getAmountOfLeftHours + START_WORK_TIME;

  let editingDate = moment()
    .add({
      days: getAmountOfLeftWorkDays,
      weeks: getAmountOfWorkWeeks,
    })
    .set("hour", endWorkHours)
    .format("MMMM DD YYYY o HH:mm");

  console.log(editingDate);

  const endWorkDay = moment(editingDate, "MMMM DD YYYY").format("dddd");
  console.log("endWorkDay", endWorkDay);

  const endDate = includeDayOff(editingDate, endWorkDay);

  deadlineDateElem.textContent = endDate;
};

calculteBtnElem.addEventListener("click", handleCalcBtnClick);
