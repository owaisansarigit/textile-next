import { AppProvider } from "./providers/AppProvider";
import { connectDB } from "./lib/db/mongo";
connectDB();

import MainLayout from "./components/MainLayout";
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
