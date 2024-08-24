import React from 'react';
import { Flex, View, Text } from '@aws-amplify/ui-react';
import Image from "next/image";
import { TextGenerateEffect } from "../ui/textgenerate_effect";
import Link from "next/link";

interface NavItemProps {
  children: React.ReactNode;
  href?: string;
  bgColor?: string;
  hoverBgColor?: string;
  width?: string;
}

const NavItem: React.FC<NavItemProps> = ({ children, href, bgColor = '#000000', hoverBgColor = '#F5F5F5', width = '10%' }) => (
  <Link href={href || '/'} passHref>
    <Flex
      as="a"
      height="80%"
      width={width}
      justifyContent="center"
      alignItems="center"
      borderRadius="medium"
      backgroundColor={bgColor}
      color="white"
      fontSize="15px"
      style={{ textDecoration: 'none' }}
      hover={{
        backgroundColor: hoverBgColor,
        color: 'black',
      }}
    >
      {children}
    </Flex>
  </Link>
);

const Navbar: React.FC = () => {
  return (
    <Flex
      width="100%"
      height="60px"
      direction="row"
      gap="medium"
      padding="small"
      fontSize="15px"
    >
      <Flex
        height="40px"
        width="10%"
        backgroundColor="#000000"
        borderRadius="medium"
        justifyContent="center"
        alignItems="center"
        direction="row"
        gap="small"
        paddingX="small"
      >
        <View width="20%">
          <Image src="/logo2.png" alt="logo" width={30} height={30} />
        </View>
        <Flex
          height="100%"
          width="80%"
          color="white"
          justifyContent="center"
          alignItems="center"
        >
          <TextGenerateEffect words="HeadStarter" />
        </Flex>
      </Flex>
      
      <Flex
        height="40px"
        width="69%"
        backgroundColor="#000000"
        borderRadius="medium"
        color="white"
        direction="row"
        gap="medium"
        justifyContent="flex-start"
        alignItems="center"
        paddingLeft="large"
      >
        <NavItem>Pricing</NavItem>
        <NavItem>Features</NavItem>
        <NavItem>Forum</NavItem>
        <NavItem>Docs</NavItem>
      </Flex>
      
      <NavItem href="/" bgColor="#5577ED" hoverBgColor="#2255E4" width="7%">
        Discord
      </NavItem>
      
      <NavItem href="/" width="7%">
        <Flex direction="row" alignItems="center" gap="small">
          {/* Replace with appropriate icon from Amplify UI or another source */}
          <Text>GitHub</Text>
        </Flex>
      </NavItem>
      
      <NavItem href="/chat" width="7%">
        Chat
      </NavItem>
      
      <NavItem href="/" width="7%">
        Home
      </NavItem>
    </Flex>
  );
};

export default Navbar;