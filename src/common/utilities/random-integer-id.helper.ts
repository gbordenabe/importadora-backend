export const getRandomIntegerId = () => {
  const maxValue = 2147483647;
  const randomNumber = Math.floor(Math.random() * (maxValue + 1));
  return randomNumber;
};
export const getRandomInteger = (length: number) => {
  const maxValue = 10 ** length - 1;
  const randomNumber = Math.floor(Math.random() * (maxValue + 1));
  return randomNumber;
};
