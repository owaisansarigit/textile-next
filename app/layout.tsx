import { AppProvider } from "../app/providers/AppProvider";
import MainLayout from "../app/components/MainLayout";
import "bootstrap/dist/css/bootstrap.min.css";


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
