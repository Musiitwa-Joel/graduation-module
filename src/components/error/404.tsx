import { Button } from "@/components/ui/button";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

interface ErrorScreenProps {
  type: "404" | "500" | "session";
  title?: string;
  description?: string;
}

export default function ErrorScreen({
  type,
  title,
  description,
}: ErrorScreenProps) {
  const defaultContent = {
    "404": {
      title: "Page Not Found",
      description:
        "The page you're looking for doesn't exist or has been moved.",
      primaryAction: {
        label: "Go Home",
        icon: Home,
      },
    },
    "500": {
      title: "Server Error",
      description: "Something went wrong on our end. Please try again later.",
      primaryAction: {
        label: "Try Again",
        icon: RefreshCw,
        onClick: () => window.location.reload(),
      },
    },
    session: {
      title: "Session Expired",
      description: "Your session has expired. Please log in again to continue.",
      primaryAction: {
        label: "Log In Again",
        icon: RefreshCw,
      },
    },
  };

  const content = defaultContent[type];

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-100 p-6 dark:bg-red-900/20">
            <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-500" />
          </div>
        </div>
        <h1 className="mb-4 text-3xl font-bold tracking-tight">
          {title || content.title}
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          {description || content.description}
        </p>
        <div className="flex justify-center gap-4">
          {/* <Button size="lg" onClick={content.primaryAction.onClick}>
            <content.primaryAction.icon className="mr-2 h-4 w-4" />
            {content.primaryAction.label}
          </Button> */}
          {/* {type !== "404" && (
            <Button variant="outline" size="lg" onClick={() => navigate("/")}>
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          )} */}
        </div>
      </div>
    </div>
  );
}
