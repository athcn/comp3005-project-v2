export const useRestApi = () => {
  const serverPort = 3000;
  
  const getFormatedUrl = (route: string) => {
    return `http://localhost:${serverPort}/api/${route}`
  }
  return {getFormatedUrl};
}