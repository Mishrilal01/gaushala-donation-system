/**
 * Date Formatter Utility
 * Converts UTC timestamps to Indian Standard Time (IST, UTC+5:30)
 */

/**
 * Format date to IST with both date and time
 * @param {string} dateString - ISO date string from database (UTC)
 * @returns {string} - Formatted date in IST with Hindi locale and AM/PM
 */
export const formatDateTimeIST = (dateString) => {
  try {
    const utcDate = new Date(dateString);
    
    // Convert UTC to IST (UTC+5:30)
    // Get the IST offset: 5 hours 30 minutes = 330 minutes
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const istDate = new Date(utcDate.getTime() + istOffset);
    
    // Get date components using UTC getters on the adjusted date
    const day = istDate.getUTCDate();
    const month = istDate.getUTCMonth();
    const year = istDate.getUTCFullYear();
    let hours = istDate.getUTCHours();
    const minutes = istDate.getUTCMinutes().toString().padStart(2, '0');
    
    // Determine AM/PM
    const ampm = hours >= 12 ? 'pm' : 'am';
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    
    // Month names in Hindi
    const monthsHindi = [
      'जन', 'फर', 'मार', 'अप्र', 'मई', 'जून',
      'जुल', 'अग', 'सित', 'अक्टू', 'नव', 'दिस'
    ];
    
    const monthName = monthsHindi[month];
    
    return `${day} ${monthName} ${year}, ${hours}:${minutes} ${ampm}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format date to IST (date only, no time)
 * @param {string} dateString - ISO date string from database (UTC)
 * @returns {string} - Formatted date in IST with Hindi locale
 */
export const formatDateIST = (dateString) => {
  try {
    const utcDate = new Date(dateString);
    
    // Convert UTC to IST (UTC+5:30)
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const istDate = new Date(utcDate.getTime() + istOffset);
    
    const day = istDate.getUTCDate();
    const month = istDate.getUTCMonth();
    const year = istDate.getUTCFullYear();
    
    // Month names in Hindi
    const monthsHindi = [
      'जन', 'फर', 'मार', 'अप्र', 'मई', 'जून',
      'जुल', 'अग', 'सित', 'अक्टू', 'नव', 'दिस'
    ];
    
    const monthName = monthsHindi[month];
    
    return `${day} ${monthName} ${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};
