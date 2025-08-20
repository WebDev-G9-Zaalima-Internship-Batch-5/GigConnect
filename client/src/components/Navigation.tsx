import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Search,
  MessageSquare,
  Bell,
  LogOut,
  Settings,
  User as UserIcon,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserDropdown = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.fullName} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(user.fullName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate("/dashboard")}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate(`/profile/${user._id}`)}>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                GigConnect
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md-nav:flex items-center space-x-8">
              <Link
                to="/find-work"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/find-work")
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Find Work
              </Link>
              <Link
                to="/find-talent"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/find-talent")
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Find Talent
              </Link>
              <Link
                to="/how-it-works"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/how-it-works")
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                How it Works
              </Link>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md-nav:flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>

              {user ? (
                <UserDropdown />
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline">Login</Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="hero">Join Now</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md-nav:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <MobileMenu
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              isAuthenticated={!!user}
              user={user}
            />
          )}
        </div>
      </nav>
      <div className="h-16"></div>
    </>
  );
};

const MobileMenu = ({ isOpen, onClose, isAuthenticated, user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="md-nav:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t border-border min-h-svh">
        <Link
          to="/find-work"
          className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary"
          onClick={onClose}
        >
          Find Work
        </Link>
        <Link
          to="/find-talent"
          className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary"
          onClick={onClose}
        >
          Find Talent
        </Link>
        <Link
          to="/how-it-works"
          className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary"
          onClick={onClose}
        >
          How it Works
        </Link>
        <div className="pt-4 pb-3 border-t border-border">
          {isAuthenticated ? (
            <div className="space-y-3">
              <div className="flex items-center px-3 py-2">
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarImage src={user?.avatar} alt={user?.fullName} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user?.fullName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user?.fullName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  onClose();
                  navigate("/dashboard");
                }}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  onClose();
                  navigate(`/profile/${user?._id}`);
                }}
              >
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  onClose();
                  navigate("/settings");
                }}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={() => {
                  onClose();
                  logout();
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          ) : (
            <div className="grid gap-2">
              <Link to="/login" onClick={onClose}>
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link to="/signup" onClick={onClose}>
                <Button variant="hero" className="w-full">
                  Join Now
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
