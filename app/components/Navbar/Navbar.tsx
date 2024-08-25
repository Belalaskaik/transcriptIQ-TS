'use client'
import React, { useState, useEffect } from 'react';
import { Flex, Text, Button } from '@aws-amplify/ui-react';
import { MdMenu, MdClose } from 'react-icons/md';
import Image from "next/image";
import Link from "next/link";
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    console.log('Menu toggled:', !isMenuOpen); // Debug log
  };

  return (
    <nav className={styles.navbar}>
      <Flex
        width="100%"
        height="60px"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        padding="0 1rem"
        backgroundColor="#ffffff"
        boxShadow="0 2px 4px rgba(0,0,0,0.1)"
      >
        <Flex alignItems="center" gap="1rem">
          <Image src="/logo3.svg" alt="logo" width={30} height={30} />
          <Text fontSize="xl" fontWeight="bold">TranscriptIQ</Text>
        </Flex>
        
        {isMobile && (
          <Button onClick={toggleMenu} className={styles.menuButton}>
            {isMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </Button>
        )}
        
        {!isMobile && (
          <Flex gap="1rem">
            <Link href="/">Home</Link>
            <Link href="/features">Features</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/docs">Docs</Link>
            <Link href="/signin">Sign In</Link>
            <Link href="/signup">Create Account</Link>
          </Flex>
        )}
      </Flex>
      
      {isMobile && isMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/">Home</Link>
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/docs">Docs</Link>
          <Link href="/signin">Sign In</Link>
          <Link href="/signup">Create Account</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;