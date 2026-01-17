import "bootstrap/dist/css/bootstrap.min.css";
import { AppProvider } from "./providers/AppProvider";
import MainLayout from "./components/MainLayout";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <MainLayout>{children}</MainLayout>
        </AppProvider>
      </body>
    </html>
  );
}
