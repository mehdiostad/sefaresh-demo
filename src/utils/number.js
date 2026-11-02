export function numberDigits(number) {
  let str = number + "";
  // if (i18n?.language === "fa")
  str = str.replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

  return str;
}

function separate(number) {
  let strNumber = number + "";
  strNumber = strNumber.replace(",", "");
  let x = strNumber.split(".");
  let y = x[0];
  let z = x.length > 1 ? "." + x[1] : "";
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(y)) y = y.replace(rgx, "$1" + "," + "$2");
  return numberDigits(y + z);
}

export default separate;
