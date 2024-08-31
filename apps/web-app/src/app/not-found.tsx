import './global.css';
import NotFound from '../components/notfound';

const ErrorPage = () => {
  return (
    <html lang="en">
      <body className="bg-black">
        <NotFound />
      </body>
    </html>
  );
};

export default ErrorPage;
