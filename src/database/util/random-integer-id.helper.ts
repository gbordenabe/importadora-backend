export const getRandomIntegerId = () => {
  const maxValue = 2147483647;
  const randomNumber = Math.floor(Math.random() * (maxValue + 1));
  return randomNumber;
};
