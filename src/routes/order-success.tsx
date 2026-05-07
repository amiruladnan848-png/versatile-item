import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/order-success")({ component: Success });

function Success() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 grid place-items-center px-4 py-20">
        <div className="text-center max-w-md animate-float-up">
          <CheckCircle2 className="size-20 text-primary mx-auto animate-blink-glow" />
          <h1 className="mt-6 text-3xl font-extrabold">ধন্যবাদ! অর্ডার সফল হয়েছে</h1>
          <p className="mt-3 text-muted-foreground">
            আমরা আপনার পেমেন্ট যাচাই করে শীঘ্রই কল করব এবং পণ্য পাঠাব।
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-full px-6 py-3 font-bold gradient-brand text-primary-foreground shadow-brand"
          >
            হোমে ফিরে যান
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
