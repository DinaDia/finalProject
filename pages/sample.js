import { useEffect } from 'react';

export default function MyComponent() {
  useEffect(() => {
    fetch('/api/check-auth')
      .then(response => {
        if (response.ok) {
          // User is authenticated
          // Perform actions for authenticated users
          console.log('User is authenticated');
        } else {
          // User is not authenticated
          // Redirect to login page or show an error message
          console.log('User is not authenticated');
        }
      })
      .catch(error => {
        // Handle any errors that occur during the request
        console.error('Error checking authentication:', error);
      });
  }, []);

  return <div>My Component</div>;
}
