export const codeGenerator = (length: number) => {
  const dataSet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (var i = 0, n = dataSet.length; i < length; ++i) {
    code += dataSet.charAt(Math.floor(Math.random() * n));
  }
  return code;
};

export const numberGenerator = (length: number) => {
  const dataSet = "0123456789";
  let code = "";
  for (var i = 0, n = dataSet.length; i < length; ++i) {
    code += dataSet.charAt(Math.floor(Math.random() * n));
  }
  return code;
};
