const inputTextElem = document.querySelector(".form__area-text");
const fileElem = document.querySelector(".download__input");
const selectLangElem = document.querySelector(".form__select");
const calculteBtnElem = document.querySelector(".form__submit");
const priceElem = document.querySelector(".price__number");
const deadlineElem = document.querySelector(".deadline");

const NORMAL_PRICE_FILE_FORMATS = ["doc", "docx", "rtf"];
const PRICE_PER_ITEM = 0.05;
const PRICE_PER_ENG_ITEM = 0.12; //  if selectedLang = selectElem.value === en
const MIN_NORM_PRICE = 50;
const MIN_ENG_PRICE = 120;

const handleInputFile = () => {
  const file = fileElem.files[0];

  if (!file) return;
  let textLength;

  const fileName = file.name;
  const fileLoadedDate = file.lastModifiedDate;
  const fileSize = file.size;
  // console.log(file);
  // console.log(fileName);
  // console.log(fileLoadedDate);
  // console.log(fileSize);

  const fileExtantion = fileName.substr(fileName.lastIndexOf(".") + 1);
  // console.log(fileExtantion);

  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = () => {
    const text = reader.result;
    console.log(text);
    textLength = text.length;
  };

  reader.onerror = () => {
    console.log(reader.error);
  };

  return { fileSize, fileLoadedDate, fileExtantion, textLength };
};

// inputTextElem.addEventListener("change", handleInputFile);
//---------

const getPriceForItem = (length, isFileType, pricePerItem, minPrice) => {
  const price = !isFileType ? pricePerItem * length * 1.2 : pricePerItem * length;
  return price > minPrice ? price : minPrice;
};

const handleCalcBtnClick = (e) => {
  e.preventDefault();

  const textareaTextLength = inputTextElem.value.length || 0;
  const fileTextLength = handleInputFile() === undefined ? 0 : handleInputFile().fileSize;
  const commonLenght = textareaTextLength + fileTextLength;
  console.log(commonLenght);

  const lang = selectLangElem.value;
  const minPrice = lang === "en" ? MIN_ENG_PRICE : MIN_NORM_PRICE;
  const pricePerItem = lang === "en" ? PRICE_PER_ENG_ITEM : PRICE_PER_ITEM;

  const fileType = handleInputFile() !== undefined ? NORMAL_PRICE_FILE_FORMATS.filter((type) => type === handleInputFile().fileExtantion).length : 0;
  // console.log(fileType);
  // console.log(handleInputFile().fileExtantion);
  // const fileTypeDate = handleInputFile() === undefined ? 0 : NORMAL_PRICE_FILE_FORMATS.filter((type) => type === handleInputFile().textLength).length;

  const price = getPriceForItem(commonLenght, fileType, pricePerItem, minPrice);
  // const priceDate = getPriceForItem(commonLenght, fileType, pricePerItem, minPrice);

  priceElem.textContent = parseInt(Math.ceil(price));
  deadlineElem.textContent = new Date();
};
//
calculteBtnElem.addEventListener("click", handleCalcBtnClick);
