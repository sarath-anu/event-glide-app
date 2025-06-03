
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Shield, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">About EventEase</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're on a mission to make event discovery and management effortless. 
              Connect with amazing experiences and create lasting memories.
            </p>
          </div>

          {/* Mission Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                EventEase was founded with a simple belief: everyone deserves access to incredible experiences. 
                Whether you're looking to attend a tech conference, join a music festival, or organize a community gathering, 
                we provide the tools and platform to make it happen seamlessly.
              </p>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Easy Discovery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Find events that match your interests with our powerful search and filtering system.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" />
                  Community Focus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect with like-minded people and build lasting relationships through shared experiences.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  Secure & Reliable
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your data and payments are protected with enterprise-grade security measures.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Story Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Our Story</CardTitle>
              <CardDescription>How EventEase came to be</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                EventEase started in 2024 when our founders realized how difficult it was to discover and manage events 
                in their local community. After missing several amazing events due to poor promotion and complicated 
                registration processes, they decided to build a solution.
              </p>
              <p className="text-muted-foreground">
                Today, EventEase serves thousands of event organizers and attendees worldwide, making it easier than 
                ever to create, discover, and participate in meaningful experiences.
              </p>
            </CardContent>
          </Card>

          {/* Values Section */}
          <Card>
            <CardHeader>
              <CardTitle>Our Values</CardTitle>
              <CardDescription>What drives us every day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Badge variant="outline">Accessibility</Badge>
                  <p className="text-sm text-muted-foreground">
                    Events should be accessible to everyone, regardless of background or ability.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Badge variant="outline">Innovation</Badge>
                  <p className="text-sm text-muted-foreground">
                    We continuously improve our platform with the latest technology and user feedback.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Badge variant="outline">Community</Badge>
                  <p className="text-sm text-muted-foreground">
                    Building strong communities through shared experiences and connections.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Badge variant="outline">Trust</Badge>
                  <p className="text-sm text-muted-foreground">
                    Maintaining transparency and reliability in all our interactions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center mt-12 p-8 bg-primary/5 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of event enthusiasts and start discovering amazing experiences today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/events" 
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Browse Events
              </a>
              <a 
                href="/register" 
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Create Account
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
