export async function sharePayroll(payroll: any, email: string) {
  // This is a mock implementation
  // In a real app, you would call your API endpoint to send the email

  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      if (email && payroll) {
        resolve({
          success: true,
          message: 'Email sent successfully',
        });
      } else {
        reject(new Error('Failed to send email'));
      }
    }, 1000);
  });
}
