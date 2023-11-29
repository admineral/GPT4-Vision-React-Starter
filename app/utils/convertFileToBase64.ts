export const convertFileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
  console.log('converting image to Base64');
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = error => reject(error);
  console.log('image CONVERTED');
});