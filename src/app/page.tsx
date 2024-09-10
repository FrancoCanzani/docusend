import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Link2,
  MessageSquare,
  RefreshCw,
  Users,
  Shield,
  BarChart2,
} from "lucide-react";

const features = [
  {
    title: "Reject attachments, embrace links",
    description:
      "Enhance security and control with dynamic links. Manage access and revoke permissions instantly.",
    icon: <Link2 className="h-6 w-6" />,
  },
  {
    title: "Real-time Engagement Insights",
    description:
      "Gain valuable insights with live document interaction data. Make informed decisions before your next meeting.",
    icon: <MessageSquare className="h-6 w-6" />,
  },
  {
    title: "Seamless Version Control",
    description:
      "Edit shared documents on-the-fly. Recipients always see the most up-to-date content without manual updates.",
    icon: <RefreshCw className="h-6 w-6" />,
  },
  {
    title: "Team collaboration",
    description:
      "Create teams, manage permissions, and collaborate seamlessly on shared documents.",
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: "Document analytics",
    description:
      "Track document views, time spent, and user engagement with team-wide analytics.",
    icon: <BarChart2 className="h-6 w-6" />,
  },
  {
    title: "Secure sharing",
    description:
      "Set granular access controls, expiration dates, and password protection for sensitive documents.",
    icon: <Shield className="h-6 w-6" />,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/50 via-white to-blue-100">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">DocuSend</h1>
          <div className="hidden md:flex space-x-4">
            <a href="#" className="text-sm font-medium hover:underline">
              Home
            </a>
            <a href="#" className="text-sm font-medium hover:underline">
              About
            </a>
            <a href="#" className="text-sm font-medium hover:underline">
              Support
            </a>
            <a href="#" className="text-sm font-medium hover:underline">
              Pricing
            </a>
          </div>
          <Link
            href={"/login"}
            className="text-sm font-medium hover:bg-primary/90 bg-black text-white rounded-lg px-4 py-2"
          >
            Get Started
          </Link>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-sm bg-white rounded-lg px-2 py-0.5 shadow w-fit mx-auto font-semibold uppercase">
          Unlock Document Sharing Power
        </h2>
        <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Empower Your Team with Next-Gen Document Sharing
        </h1>
        <p className="mx-auto my-8 max-w-2xl text-xl text-gray-600">
          Streamline your document management and collaboration experience with
          our innovative sharing platform
        </p>
        <form className="max-w-xl shadow flex border rounded-lg items-center relative mx-auto">
          <Input
            type="email"
            placeholder="Email"
            required
            className="py-3 px-4 pr-32 rounded-l-lg rounded-r-none border-none"
          />
          <Button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded-lg hover:opacity-95"
          >
            <ArrowRight size={16} className="mr-2" /> Keep me updated
          </Button>
        </form>
        <div className="mt-16 bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl mx-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">Project Documents</span>
              </div>
              <Button variant="ghost" size="sm">
                New Document
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-3">
                  <span>Q4 Financial Report.pdf</span>
                </div>
                <span className="text-sm text-gray-500">
                  Updated 2 hours ago
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-3">
                  <span>Marketing Strategy 2023.docx</span>
                </div>
                <span className="text-sm text-gray-500">Updated yesterday</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-3">
                  <span>Product Roadmap.xlsx</span>
                </div>
                <span className="text-sm text-gray-500">
                  Updated 3 days ago
                </span>
              </div>
            </div>
          </div>
        </div>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why do I need DocuSend?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="bg-white border-t-4 border-primary"
                >
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-50/50 via-white to-blue-100 flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="container mx-auto px-4 py-8">
        <div className="flex justify-center space-x-8"></div>
      </footer>
    </div>
  );
}
