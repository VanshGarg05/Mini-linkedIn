'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogOut} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Dropdown, DropdownItem } from '@/components/ui/dropdown';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const { user, logout } = useAuth();

  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleViewProfile = () => {
    router.push(`/profile/${user?.id}`);
  };

  return (
    <nav className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-purple-700 transition-all">
             MiniLinkedIn
          </Link>

          <div className="flex items-center space-x-4">
       
           

            {user ? (
              <>
                <div className="hidden sm:flex items-center space-x-3">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Welcome back, {user.name}! 👋</span>
                </div>
                
                <Dropdown
                  trigger={
                    <div className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
                        {user.name}
                      </span>
                    </div>
                  }
                >
                  <DropdownItem onClick={handleViewProfile} icon={<User size={16} />}>
                    View Profile
                  </DropdownItem>
                  <DropdownItem onClick={handleLogout} icon={<LogOut size={16} />}>
                    Logout
                  </DropdownItem>
                </Dropdown>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => router.push('/login')}>
                  Sign In
                </Button>
                <Button onClick={() => router.push('/register')}>
                  Join Now
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
